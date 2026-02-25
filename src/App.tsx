import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CompanyProvider } from "@/hooks/useCompany";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import FunnelPage from "./pages/FunnelPage";
import UTMPage from "./pages/UTMPage";
import GeoPage from "./pages/GeoPage";
import EventsPage from "./pages/EventsPage";
import TemporalPage from "./pages/TemporalPage";
import AuthPage from "./pages/AuthPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<ProtectedRoute><CompanyProvider><Index /></CompanyProvider></ProtectedRoute>} />
            <Route path="/leads" element={<ProtectedRoute><CompanyProvider><LeadsPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/leads/:id" element={<ProtectedRoute><CompanyProvider><LeadDetailPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/funnel" element={<ProtectedRoute><CompanyProvider><FunnelPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/utm" element={<ProtectedRoute><CompanyProvider><UTMPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/geo" element={<ProtectedRoute><CompanyProvider><GeoPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><CompanyProvider><EventsPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="/temporal" element={<ProtectedRoute><CompanyProvider><TemporalPage /></CompanyProvider></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
