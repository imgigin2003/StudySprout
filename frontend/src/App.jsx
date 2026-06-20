// @ts-nocheck
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "./lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MusicProvider } from "./components/MusicProvider";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthNavbar from "./components/layout/AuthNavbar";
import Login from "./pages/LoginPage";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import GardenPage from "./pages/GardenPage";
import TimerPage from "./pages/TimerPage";
import ShelfPage from "./pages/ShelfPage";
import GardenLayout from "./components/layout/GardenLayout";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated, authChecked } = useAuth();

  // 1. Show loading spinner while checking auth
  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* 2. Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/garden" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/garden" /> : <Register />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 3. Landing Page (Only show if NOT authenticated) */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/garden" /> : <LandingPage />
          }
        />

        {/* 4. Protected Routes (Requires Login) */}
        <Route
          element={
            <ProtectedRoute
              unauthenticatedElement={<Navigate to="/" replace />}
            />
          }
        >
          <Route element={<GardenLayout />}>
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
          </Route>
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Renders only on /, /login, /register — internally guarded by
          AuthNavbar's own isAuthRoute check. GardenLayout renders the
          separate main Navbar for /garden, /timer, /shelf. */}
      <AuthNavbar />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <MusicProvider src="/sounds/bgm.m4a" volume={0.15} loop>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
        </MusicProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
