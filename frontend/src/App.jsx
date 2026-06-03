import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/context/AuthContext.jsx";
import { NotificationProvider } from "@/context/NotificationContext.jsx";
import ProtectedRoute from "@/components/layout/ProtectedRoute.jsx";
import AppShell from "@/components/layout/AppShell.jsx";
import Landing from "@/pages/Landing.jsx";

// Auth pages
import LoginPage from "@/pages/auth/LoginPage.jsx";
import RegisterPage from "@/pages/auth/RegisterPage.jsx";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage.jsx";

// Citizen
import CitizenDashboard from "@/pages/citizen/Dashboard.jsx";
import NewComplaint from "@/pages/citizen/NewComplaint.jsx";
import MyComplaints from "@/pages/citizen/MyComplaints.jsx";
import CitizenComplaintDetail from "@/pages/citizen/ComplaintDetail.jsx";
import CitizenNotifications from "@/pages/citizen/Notifications.jsx";
import CitizenProfile from "@/pages/citizen/Profile.jsx";

// Officer
import OfficerDashboard from "@/pages/officer/Dashboard.jsx";
import AssignedComplaints from "@/pages/officer/AssignedComplaints.jsx";
import OfficerComplaintDetail from "@/pages/officer/ComplaintDetail.jsx";
import OfficerNotifications from "@/pages/officer/Notifications.jsx";
import OfficerProfile from "@/pages/officer/Profile.jsx";

// Admin
import AdminDashboard from "@/pages/admin/Dashboard.jsx";
import AdminAnalytics from "@/pages/admin/Analytics.jsx";
import AdminComplaints from "@/pages/admin/Complaints.jsx";
import AdminOfficers from "@/pages/admin/Officers.jsx";
import AdminDepartments from "@/pages/admin/Departments.jsx";
import AdminDepartmentDetail from "@/pages/admin/DepartmentDetail.jsx";
import AdminUsers from "@/pages/admin/Users.jsx";
import AdminActivities from "@/pages/admin/Activities.jsx";
import AdminNotifications from "@/pages/admin/Notifications.jsx";
import AdminHeatmap from "@/pages/admin/Heatmap.jsx";
import AdminReports from "@/pages/admin/Reports.jsx";
import AdminSettings from "@/pages/admin/Settings.jsx";
import AdminComplaintDetail from "@/pages/admin/ComplaintDetail.jsx";
import AdminProfile from "@/pages/admin/Profile.jsx";

import NotFound from "@/pages/NotFound.jsx";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Citizen */}
              <Route element={<ProtectedRoute roles={["citizen"]} />}>
                <Route element={<AppShell />}>
                  <Route path="/citizen" element={<Navigate to="/citizen/dashboard" replace />} />
                  <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                  <Route path="/citizen/complaints/new" element={<NewComplaint />} />
                  <Route path="/citizen/complaints" element={<MyComplaints />} />
                  <Route path="/citizen/complaints/:id" element={<CitizenComplaintDetail />} />
                  <Route path="/citizen/notifications" element={<CitizenNotifications />} />
                  <Route path="/citizen/profile" element={<CitizenProfile />} />
                </Route>
              </Route>

              {/* Officer */}
              <Route element={<ProtectedRoute roles={["officer"]} />}>
                <Route element={<AppShell />}>
                  <Route path="/officer" element={<Navigate to="/officer/dashboard" replace />} />
                  <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                  <Route path="/officer/complaints" element={<AssignedComplaints />} />
                  <Route path="/officer/complaints/:id" element={<OfficerComplaintDetail />} />
                  <Route path="/officer/notifications" element={<OfficerNotifications />} />
                  <Route path="/officer/profile" element={<OfficerProfile />} />
                </Route>
              </Route>

              {/* Admin */}
              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route element={<AppShell />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/activities" element={<AdminActivities />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  <Route path="/admin/complaints" element={<AdminComplaints />} />
                  <Route path="/admin/complaints/:id" element={<AdminComplaintDetail />} />
                  <Route path="/admin/officers" element={<AdminOfficers />} />
                  <Route path="/admin/departments" element={<AdminDepartments />} />
                  <Route path="/admin/departments/:id" element={<AdminDepartmentDetail />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/heatmap" element={<AdminHeatmap />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/profile" element={<AdminProfile />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
