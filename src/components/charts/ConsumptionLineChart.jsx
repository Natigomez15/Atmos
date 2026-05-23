import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

function TooltipPersonalizado({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white shadow-md rounded-xl px-3 py-2 text-xs border border-gray-100">
      <p className="text-muted mb-0.5">{label}</p>
      <p className="font-semibold text-dark">{payload[0].value?.toFixed(0)} W</p>
    </div>
  )
}

export default function ConsumptionLineChart({ datos = [], cargando = false }) {
  if (cargando) {
    return <div className="h-[220px] bg-gray-100 rounded-xl animate-pulse" />
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart datos={datos} data={datos} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        <XAxis
          dataKey="hora"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          unit=" W"
          tick={{ fontSize: 11, fill: "#64748B" }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<TooltipPersonalizado />} />
        <Line
          type="monotone"
          dataKey="potencia_w"
          stroke="#2ABFBF"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#2ABFBF" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
