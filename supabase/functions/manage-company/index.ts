import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const createSchema = z.object({
  action: z.literal("create"),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  primary_domain: z.string().max(255).nullish(),
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  max_leads: z.number().int().positive().max(1000000).default(500),
  max_visits: z.number().int().positive().max(10000000).default(5000),
  logo_url: z.string().url().max(500).nullish(),
});

const updateSchema = z.object({
  action: z.literal("update"),
  id: z.number().int().positive(),
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  primary_domain: z.string().max(255).nullish(),
  plan: z.enum(["free", "pro", "enterprise"]).optional(),
  max_leads: z.number().int().positive().max(1000000).optional(),
  max_visits: z.number().int().positive().max(10000000).optional(),
  logo_url: z.string().url().max(500).nullish(),
  is_active: z.boolean().optional(),
});

const bodySchema = z.discriminatedUnion("action", [createSchema, updateSchema]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Service role client for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const rawBody = await req.json();

    // Validate input
    const parseResult = bodySchema.safeParse(rawBody);
    if (!parseResult.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parseResult.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = parseResult.data;

    if (body.action === "create") {
      const { action: _, ...insertData } = body;
      const webhook_secret = crypto.randomUUID();

      const { data: company, error: insertError } = await supabaseAdmin
        .from("companies")
        .insert({
          ...insertData,
          primary_domain: insertData.primary_domain || null,
          logo_url: insertData.logo_url || null,
          webhook_secret,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Company insert error:", insertError);
        let userMessage = "Failed to create company";
        if (insertError.code === "23505") {
          userMessage = "A company with this slug already exists";
        }
        return new Response(JSON.stringify({ error: userMessage }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Link user to company
      await supabaseAdmin.from("user_companies").insert({
        user_id: userId,
        company_id: company.id,
        role: "admin",
      });

      return new Response(JSON.stringify(company), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "update") {
      const { id, action: _, ...updates } = body;

      // Verify user has access to this company
      const { data: membership } = await supabaseAdmin
        .from("user_companies")
        .select("id")
        .eq("user_id", userId)
        .eq("company_id", id)
        .single();

      if (!membership) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: company, error: updateError } = await supabaseAdmin
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        console.error("Company update error:", updateError);
        return new Response(JSON.stringify({ error: "Failed to update company" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(company), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error in manage-company:", err);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
