export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

export const API_KEY = import.meta.env.VITE_API_KEY || ""

export const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/v1"

export const COST_PER_KWH = 0.17

export const REFRESH_INTERVAL_MS = 30000

export const COLORS = {
  primary:   "#1B4F8A",
  secondary: "#2ABFBF",
  success:   "#10B981",
  warning:   "#F59E0B",
  danger:    "#EF4444",
  muted:     "#64748B",
}

export const CHART_COLORS = [
  "#2ABFBF",
  "#1B4F8A",
  "#10B981",
  "#F59E0B",
  "#EF4444",
]
