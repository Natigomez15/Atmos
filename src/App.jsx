import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import PageWrapper from "./components/layout/PageWrapper"
import DashboardPage  from "./pages/DashboardPage"
import MonitoringPage from "./pages/MonitoringPage"
import RoomsPage      from "./pages/RoomsPage"
import CommandsPage     from "./pages/CommandsPage"
import PredictionsPage  from "./pages/PredictionsPage"
import ReportsPage      from "./pages/ReportsPage"
import NodesPage        from "./pages/NodesPage"
import AlertsPage       from "./pages/AlertsPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
})

const PlaceholderPage = ({ title }) => (
  <PageWrapper>
    <div className="flex items-center justify-center h-64">
      <p className="text-muted text-sm">{title} — próximamente</p>
    </div>
  </PageWrapper>
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"   element={<DashboardPage />} />
          <Route path="/rooms"       element={<RoomsPage />} />
          <Route path="/monitoring"  element={<MonitoringPage />} />
          <Route path="/commands"    element={<CommandsPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/alerts"      element={<AlertsPage />} />
          <Route path="/reports"     element={<ReportsPage />} />
          <Route path="/nodes"       element={<NodesPage />} />
          <Route path="/settings"    element={<PlaceholderPage title="Ajustes" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
