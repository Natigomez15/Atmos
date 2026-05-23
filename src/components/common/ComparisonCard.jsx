import { MdTrendingDown, MdTrendingUp, MdTrendingFlat } from "react-icons/md"

const CONFIGURACION_VEREDICTO = {
  "Mejora significativa": { claseInsignia: "badge-success",  claseBarra: "bg-success" },
  "Mejora leve":          { claseInsignia: "badge-success",  claseBarra: "bg-success" },
  "Sin cambios":          { claseInsignia: "badge-muted",    claseBarra: "bg-muted" },
  "Aumento de consumo":   { claseInsignia: "badge-danger",   claseBarra: "bg-danger" },
}

function IconoTendencia({ porcentajeCambio }) {
  if (porcentajeCambio < 0)  return <MdTrendingDown  size={32} className="text-success" />
  if (porcentajeCambio > 0)  return <MdTrendingUp    size={32} className="text-danger" />
  return <MdTrendingFlat size={32} className="text-muted" />
}

export default function ComparisonCard({ comparacion, cargando }) {
  if (cargando) {
    return <div className="card h-48 animate-pulse bg-gray-100" />
  }
  if (!comparacion) return null

  const configVeredicto = CONFIGURACION_VEREDICTO[comparacion.verdict] ?? CONFIGURACION_VEREDICTO["Sin cambios"]
  const anchoBarra      = Math.min(Math.abs(comparacion.energy_change_pct ?? 0), 100)
  const esAhorro        = (comparacion.cost_change_usd ?? 0) < 0

  return (
    <div className="card flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-dark">{comparacion.room_name}</p>
        <span className={configVeredicto.claseInsignia}>
          {comparacion.verdict ?? "Sin datos"}
        </span>
      </div>

      {/* Dos columnas: período actual vs anterior */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-muted mb-1">Período actual</p>
          <p className="text-2xl font-bold text-dark">
            {comparacion.total_energy_kwh?.toFixed(2) ?? "—"}
            <span className="text-sm font-normal text-muted"> kWh</span>
          </p>
          <p className="text-sm text-muted mt-0.5">
            ${comparacion.total_cost_usd?.toFixed(2) ?? "—"} USD
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-muted mb-1">Período anterior</p>
          <p className="text-xl font-bold text-muted">
            {comparacion.baseline_energy_kwh?.toFixed(2) ?? "—"}
            <span className="text-sm font-normal"> kWh</span>
          </p>
          <p className="text-sm text-muted mt-0.5">
            ${comparacion.baseline_cost_usd?.toFixed(2) ?? "—"} USD
          </p>
        </div>
      </div>

      {/* Indicador de cambio */}
      <div className="flex flex-col items-center gap-1">
        <IconoTendencia porcentajeCambio={comparacion.energy_change_pct ?? 0} />
        <p className={`text-xl font-bold ${
          (comparacion.energy_change_pct ?? 0) < 0 ? "text-success" : "text-danger"
        }`}>
          {comparacion.energy_change_pct?.toFixed(1) ?? "—"}%
        </p>
        <p className="text-xs text-muted">vs período anterior</p>
      </div>

      {/* Barra de progreso */}
      <div className="bg-gray-100 h-3 rounded-full">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${configVeredicto.claseBarra}`}
          style={{ width: `${anchoBarra}%` }}
        />
      </div>

      {/* Ahorro en costo */}
      <p className={`text-sm font-medium ${esAhorro ? "text-success" : "text-danger"}`}>
        Ahorro en costo: ${Math.abs(comparacion.cost_change_usd ?? 0).toFixed(2)} USD
        {esAhorro ? " ahorrados" : " adicionales"}
      </p>
    </div>
  )
}
