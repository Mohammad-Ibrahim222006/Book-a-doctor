import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";
import ErrorBoundary from "./components/ErrorBoundary";
import "antd/dist/reset.css";
import "./App.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserHome = lazy(() => import("./pages/UserHome"));
const Notification = lazy(() => import("./pages/Notification"));
const UserAppointments = lazy(() => import("./pages/UserAppointments"));
const AdminHome = lazy(() => import("./pages/AdminHome"));
const AdminAppointments = lazy(() => import("./pages/AdminAppointments"));
const DoctorDashboard = lazy(() => import("./pages/DoctorDashboard"));

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;

  const getDashboardPath = () => {
    if (user?.type === "admin") return "/adminhome";
    if (user?.isdoctor) return "/doctordashboard";
    return "/userhome";
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to={getDashboardPath()} /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to={getDashboardPath()} /> : <Register />
            }
          />
          <Route
            path="/userhome"
            element={
              <ProtectedRoute>
                <UserHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctordashboard"
            element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userappointments"
            element={
              <ProtectedRoute>
                <UserAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminhome"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminappointments"
            element={
              <ProtectedRoute>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;