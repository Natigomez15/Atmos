import { MdAir, MdThermostat, MdWaterDrop, MdBolt } from "react-icons/md"

function minutosAtras(iso) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
}

function ColorTemperatura({ temperatura }) {
  if (temperatura == null) return <span className="text-muted">—</span>
  const clase = temperatura > 26 ? "text-warning" : temperatura <= 24 ? "text-success" : "text-dark"
  return <span className={`font-medium ${clase}`}>{temperatura.toFixed(1)}</span>
}

export default function RoomStatusCard({
  room_name,
  temperature = null,
  humidity    = null,
  presence    = false,
  ac_is_on    = false,
  power_w     = null,
  recorded_at = null,
  onClick,
}) {
  const minutos  = minutosAtras(recorded_at)
  const sinSenal = minutos == null || minutos > 10

  return (
    <div
      className="card cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Nombre del salón + presencia */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-dark text-sm">{room_name}</span>
        {presence
          ? <span className="badge-success">Ocupado</span>
          : <span className="badge-muted">Vacío</span>
        }
      </div>

      {/* Estado del AC */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <MdAir size={16} className={ac_is_on ? "text-secondary" : "text-muted"} />
          <span className="text-xs text-muted">
            {ac_is_on ? "AC Encendido" : "AC Apagado"}
          </span>
        </div>
        {ac_is_on && (
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        )}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col items-center gap-0.5">
          <MdThermostat size={14} className="text-muted" />
          <div className="text-xs">
            <ColorTemperatura temperatura={temperature} />
            {temperature != null && <span className="text-muted"> °C</span>}
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MdWaterDrop size={14} className="text-muted" />
          <div className="text-xs">
            {humidity != null
              ? <><span className="font-medium text-dark">{humidity.toFixed(0)}</span><span className="text-muted"> %</span></>
              : <span className="text-muted">—</span>
            }
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <MdBolt size={14} className="text-muted" />
          <div className="text-xs">
            {power_w != null
              ? <><span className="font-medium text-dark">{power_w.toFixed(0)}</span><span className="text-muted"> W</span></>
              : <span className="text-muted">—</span>
            }
          </div>
        </div>
      </div>

      {/* Marca de tiempo */}
      <p className={`text-xs ${sinSenal ? "text-danger" : "text-muted"}`}>
        {sinSenal ? "Sin señal" : `Actualizado hace ${minutos} min`}
      </p>
    </div>
  )
}
