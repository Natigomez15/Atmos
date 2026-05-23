import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

function formatearFechaCorta(iso) {
  if (!iso) return ""
  const fecha = new Date(iso)
  return `${String(fecha.getDate()).padStart(2, "0")}/${String(fecha.getMonth() + 1).padStart(2, "0")}`
}

function TooltipPersonalizado({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-md rounded-xl px-3 py-2 text-xs border border-gray-100">
      <p className="text-muted mb-1">{label}</p>
      {payload.map((entrada, i) => (
        <p key={i} style={{ color: entrada.color }} className="font-semibold">
          {entrada.name}:{" "}
          {entrada.value != null ? `${entrada.value.toFixed(1)}%` : "Sin datos reales"}
        </p>
      ))}
    </div>
  )
}

export default function AccuracyChart({ datos = [], cargando = false }) {
  if (cargando) {
    return <div className="h-[200px] bg-gray-100 rounded-xl animate-pulse" />
  }

  const datosFormateados = datos.map(d => ({
    ...d,
    fecha: formatearFechaCorta(d.predicted_at),
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={datosFormateados} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="fecha"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          unit="%"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<TooltipPersonalizado />} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="predicted_savings_pct"
          name="Predicho"
          fill="#2ABFBF"
          fillOpacity={0.3}
          radius={[4, 4, 0, 0]}
        />
        <Line
          dataKey="actual_savings_pct"
          name="Real"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ r: 4, fill: "#10B981" }}
          connectNulls={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
