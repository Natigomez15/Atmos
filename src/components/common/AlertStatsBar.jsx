import { MdError, MdWarning, MdInfo, MdRouter, MdBolt, MdThermostat } from "react-icons/md"

export default function AlertStatsBar({ resumen }) {
  const porSeveridad = resumen?.by_severity ?? {}
  const porTipo      = resumen?.by_type     ?? {}

  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* Severidad alta */}
      <div className="bg-danger/5 border border-danger/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <MdError size={24} className="text-danger flex-shrink-0" />
        <div>
          <p className="text-2xl font-bold text-danger">{porSeveridad.high ?? 0}</p>
          <p className="text-xs text-muted">Severidad alta</p>
        </div>
      </div>

      {/* Severidad media */}
      <div className="bg-warning/5 border border-warning/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <MdWarning size={24} className="text-warning flex-shrink-0" />
        <div>
          <p className="text-2xl font-bold text-warning">{porSeveridad.medium ?? 0}</p>
          <p className="text-xs text-muted">Severidad media</p>
        </div>
      </div>

      {/* Severidad baja */}
      <div className="bg-success/5 border border-success/20 rounded-2xl px-4 py-3 flex items-center gap-3">
        <MdInfo size={24} className="text-success flex-shrink-0" />
        <div>
          <p className="text-2xl font-bold text-success">{porSeveridad.low ?? 0}</p>
          <p className="text-xs text-muted">Severidad baja</p>
        </div>
      </div>

      <div className="hidden sm:block w-px h-12 bg-gray-200" />

      {/* Pills por tipo */}
      <div className="flex flex-wrap gap-2">
        <div className="bg-gray-100 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs text-muted">
          <MdRouter size={14} />
          Sin señal: <span className="font-semibold text-dark">{porTipo.node_offline ?? 0}</span>
        </div>
        <div className="bg-gray-100 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs text-muted">
          <MdBolt size={14} />
          Consumo: <span className="font-semibold text-dark">{porTipo.power_anomaly ?? 0}</span>
        </div>
        <div className="bg-gray-100 px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs text-muted">
          <MdThermostat size={14} />
          Temperatura: <span className="font-semibold text-dark">{porTipo.temperature_stuck ?? 0}</span>
        </div>
      </div>

    </div>
  )
}
