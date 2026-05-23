import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

function TooltipPersonalizado({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-md rounded-xl px-3 py-2 text-xs border border-gray-100">
      <p className="text-muted mb-1">{label}</p>
      {payload.map((entrada, i) => (
        <p key={i} style={{ color: entrada.color }} className="font-semibold">
          {entrada.name}: {entrada.value?.toFixed(1)}
          {entrada.name === "Temperatura" ? " °C" : " %"}
        </p>
      ))}
    </div>
  )
}

export default function TempHumidityChart({ datos = [], cargando = false }) {
  if (cargando) {
    return <div className="h-[220px] bg-gray-100 rounded-xl animate-pulse" />
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={datos} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="tiempo"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="izquierda"
          tick={{ fontSize: 11, fill: "#1B4F8A" }}
          axisLine={false}
          tickLine={false}
          unit=" °C"
          width={44}
        />
        <YAxis
          yAxisId="derecha"
          orientation="right"
          tick={{ fontSize: 11, fill: "#2ABFBF" }}
          axisLine={false}
          tickLine={false}
          unit=" %"
          width={40}
        />
        <Tooltip content={<TooltipPersonalizado />} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Line
          yAxisId="izquierda"
          type="monotone"
          dataKey="temperatura"
          name="Temperatura"
          stroke="#1B4F8A"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          yAxisId="derecha"
          type="monotone"
          dataKey="humedad"
          name="Humedad"
          stroke="#2ABFBF"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
