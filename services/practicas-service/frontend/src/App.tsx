import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';
import AgreementsPage from './pages/AgreementsPage';
import VacanciesPage from './pages/VacanciesPage';
import RequestsPage from './pages/RequestsPage';
import CallsPage from './pages/CallsPage';
import RankingPage from './pages/RankingPage';
import AssignmentsPage from './pages/AssignmentsPage';
import ResultsPage from './pages/ResultsPage';
import CompleteProfilePage from './pages/CompleteProfilePage';

export default function App() {
  return (
    <Routes>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/agreements" element={<AgreementsPage />} />
        <Route path="/vacancies" element={<VacanciesPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/prelocalization/calls" element={<CallsPage />} />
        <Route path="/prelocalization/calls/:callId/ranking" element={<RankingPage />} />
        <Route path="/prelocalization/calls/:callId/assignments" element={<AssignmentsPage />} />
        <Route path="/prelocalization/results" element={<ResultsPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}