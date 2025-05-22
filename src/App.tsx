
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

// Layout
import MainLayout from "@/components/MainLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Clients from "@/pages/Clients";
import NewClient from "@/pages/NewClient";
import SalesFunnel from "@/pages/SalesFunnel";
import Proposals from "@/pages/Proposals";
import Contracts from "@/pages/Contracts";
import Services from "@/pages/Services";
import Financial from "@/pages/Financial";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

// Install react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              } 
            />
            
            {/* Protected routes (require authentication) */}
            <Route element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/clientes/novo" element={<NewClient />} />
              <Route path="/funil" element={<SalesFunnel />} />
              <Route path="/propostas" element={<Proposals />} />
              <Route path="/contratos" element={<Contracts />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/financeiro" element={<Financial />} />
              <Route path="/configuracoes" element={<Settings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
