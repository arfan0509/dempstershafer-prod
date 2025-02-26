import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/user/LoginPasienPage";
import LoginAdminPage from "./pages/admin/LoginAdminPage";
import LoginPasienPage from "./pages/user/LoginPasienPage";
import RegisterPasienPage from "./pages/user/RegisterPasienPage";
import SistemPakarPage from "./pages/user/SistemPakarPage";
import Dashboard from "./pages/admin/Dashboard";
import DataPenyakitDanSolusi from "./pages/admin/DataPenyakitDanSolusi";
import DataGejala from "./pages/admin/DataGejala";
import DataRelasiGejala from "./pages/admin/DataRelasiGejala";
import AdminSidebar from "./components/admin/AdminSidebar";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import ProfilePage from "./pages/user/ProfilePage";
import RiwayatDiagnosisPage from "./pages/user/RiwayatDiagnosisPage";
import RiwayatDiagnosisAdminPage from "./pages/admin/RiwayatDiagnosisAdmin";

const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
        Memuat halaman...
      </p>
    </div>
  </div>
);

const PrivateRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isAdmin, isLoading } = useContext(AuthContext);
  if (isLoading) return <LoadingScreen />;
  return isLoggedIn && isAdmin ? (
    children
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

const PrivateRoutePasien = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, isPasien, isLoading } = useContext(AuthContext);
  if (isLoading) return <LoadingScreen />;
  return isLoggedIn && isPasien ? (
    children
  ) : (
    <Navigate to="/pasien-login" replace />
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ✅ Halaman Umum */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<LoginAdminPage />} />
          <Route path="/pasien-login" element={<LoginPasienPage />} />
          <Route path="/pasien-register" element={<RegisterPasienPage />} />

          {/* ✅ Halaman Pasien */}
          <Route
            path="/sistem-pakar"
            element={
              <PrivateRoutePasien>
                <SistemPakarPage />
              </PrivateRoutePasien>
            }
          />
          <Route
            path="/akun-saya"
            element={
              <PrivateRoutePasien>
                <ProfilePage />
              </PrivateRoutePasien>
            }
          />
          <Route
            path="/riwayat-diagnosis"
            element={
              <PrivateRoutePasien>
                <RiwayatDiagnosisPage />
              </PrivateRoutePasien>
            }
          />
         

          {/* ✅ Halaman Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <Dashboard />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-penyakit-dan-solusi"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataPenyakitDanSolusi />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-gejala"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataGejala />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/data-relasi-gejala"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <DataRelasiGejala />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />
          <Route
            path="/riwayatdiagnosis-admin"
            element={
              <PrivateRouteAdmin>
                <AdminSidebar>
                  <RiwayatDiagnosisAdminPage />
                </AdminSidebar>
              </PrivateRouteAdmin>
            }
          />

          {/* ✅ Fallback jika route tidak ditemukan */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
