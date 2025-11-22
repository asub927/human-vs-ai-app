import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import DashboardPage from './pages/Dashboard'
import LoginPage from './pages/Login'
import ProjectsPage from './pages/Projects'
import ReportsPage from './pages/Reports'
import AuthCallbackPage from './pages/AuthCallback'

const queryClient = new QueryClient()

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <ProjectProvider>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/auth/callback" element={<AuthCallbackPage />} />
                            <Route path="/" element={<DashboardPage />} />
                            <Route path="/projects" element={<ProjectsPage />} />
                            <Route path="/reports" element={<ReportsPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </ProjectProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
