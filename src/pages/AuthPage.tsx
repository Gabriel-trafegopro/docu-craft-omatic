import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Zap, Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  if (authLoading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (mode: "login" | "signup") => {
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = mode === "login" ? await signIn(email, password) : await signUp(email, password);
    setLoading(false);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else if (mode === "signup") {
      toast({ title: "Conta criada!", description: "Verifique seu email para confirmar o cadastro." });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({ title: "Digite seu email primeiro", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email enviado", description: "Verifique sua caixa de entrada para redefinir a senha." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md card-glow">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">LeadTracker</CardTitle>
          <CardDescription>Acesse seu dashboard de analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            {(["login", "signup"] as const).map((mode) => (
              <TabsContent key={mode} value={mode} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`${mode}-email`}>Email</Label>
                  <Input
                    id={`${mode}-email`}
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(mode)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${mode}-password`}>Senha</Label>
                  <Input
                    id={`${mode}-password`}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit(mode)}
                  />
                </div>
                <Button className="w-full" disabled={loading} onClick={() => handleSubmit(mode)}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </Button>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="w-full text-center text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Esqueci minha senha
                  </button>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
