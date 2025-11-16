import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pendaftaran from "./pages/Pendaftaran";
import Pemeriksaan from "./pages/Pemeriksaan";
import Apotek from "./pages/Apotek";
import Pembayaran from "./pages/Pembayaran";
import DataPasien from "./pages/DataPasien";
import DataObat from "./pages/DataObat";
import NotFound from "./pages/NotFound";
import Pengaturan from "./pages/Pengaturan";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "dokter", "apoteker", "resepsionis", "administrasi"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pendaftaran"
            element={
              <ProtectedRoute allowedRoles={["admin", "resepsionis"]}>
                <Pendaftaran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pemeriksaan"
            element={
              <ProtectedRoute allowedRoles={["admin", "dokter"]}>
                <Pemeriksaan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apotek"
            element={
              <ProtectedRoute allowedRoles={["admin", "apoteker"]}>
                <Apotek />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pembayaran"
            element={
              <ProtectedRoute allowedRoles={["admin", "administrasi"]}>
                <Pembayaran />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-pasien"
            element={
              <ProtectedRoute allowedRoles={["admin", "administrasi", "dokter"]}>
                <DataPasien />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-obat"
            element={
              <ProtectedRoute allowedRoles={["admin", "apoteker"]}>
                <DataObat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pengaturan"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Pengaturan />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
