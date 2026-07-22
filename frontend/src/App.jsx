// @ts-nocheck
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "./lib/query-client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
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
  const { isLoadingAuth, isAuthenticated, isGuest, authChecked } = useAuth();

  // 1. Show the cute splash until the user taps "Continue".
  //    The buttons appear once the auth check has finished (`ready`).
  const [entered, setEntered] = useState(false);
  if (!entered) {
    return (
      <SplashScreen
        ready={authChecked && !isLoadingAuth}
        onContinue={() => setEntered(true)}
      />
    );
  }

  // A user is "in the app" if they are authenticated OR browsing as a guest.
  const inApp = isAuthenticated || isGuest;

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

        {/* 3. Landing Page (Only show if NOT in the app) */}
        <Route
          path="/"
          element={inApp ? <Navigate to="/garden" /> : <LandingPage />}
        />

        {/* 4. Protected Routes (Requires Login OR Guest mode) */}
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
        <MusicProvider src="/sounds/bgm.m4a" volume={0.17} loop>
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
