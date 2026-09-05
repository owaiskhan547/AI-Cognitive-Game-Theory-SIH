import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PatientLayout } from '@/layouts/PatientLayout'
import { CaregiverLayout } from '@/layouts/CaregiverLayout'

// Public Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'

// Patient Pages
import PatientDashboardPage from '@/pages/patient/DashboardPage'
import PatientAssistantPage from '@/pages/patient/AssistantPage'
import PatientEmergencyPage from '@/pages/patient/EmergencyPage'
import PatientMedicationsPage from '@/pages/patient/MedicationsPage'
import PatientMemoriesPage from '@/pages/patient/MemoriesPage'
import PatientProfilePage from '@/pages/patient/ProfilePage'
import PatientSchedulePage from '@/pages/patient/SchedulePage'

// Caregiver Pages
import CaregiverDashboardPage from '@/pages/caregiver/DashboardPage'
import CaregiverProgressPage from '@/pages/caregiver/ProgressPage'
import CaregiverRemindersPage from '@/pages/caregiver/RemindersPage'
import CaregiverReportsPage from '@/pages/caregiver/ReportsPage'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute requiredRole="patient">
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/patient/dashboard" replace />} />
            <Route path="dashboard" element={<PatientDashboardPage />} />
            <Route path="assistant" element={<PatientAssistantPage />} />
            <Route path="emergency" element={<PatientEmergencyPage />} />
            <Route path="medications" element={<PatientMedicationsPage />} />
            <Route path="memories" element={<PatientMemoriesPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
            <Route path="schedule" element={<PatientSchedulePage />} />
          </Route>

          {/* Protected Caregiver Routes */}
          <Route
            path="/caregiver"
            element={
              <ProtectedRoute requiredRole="caregiver">
                <CaregiverLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/caregiver/dashboard" replace />} />
            <Route path="dashboard" element={<CaregiverDashboardPage />} />
            <Route path="progress" element={<CaregiverProgressPage />} />
            <Route path="reminders" element={<CaregiverRemindersPage />} />
            <Route path="reports" element={<CaregiverReportsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
