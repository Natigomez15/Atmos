import { useState } from "react"
import { MdWifi, MdWifiOff, MdMemory, MdRouter, MdMoreVert, MdPowerSettingsNew } from "react-icons/md"
import { desactivarNodo, activarNodo } from "../../api/nodes"

function minutosDesde(iso) {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
}

function etiquetaMinutos(minutos) {
  if (minutos == null)  return "Sin datos"
  if (minutos < 1)      return "Ahora mismo"
  if (minutos === 1)    return "1 min atrás"
  if (minutos < 60)     return `${minutos} min atrás`
  const horas = Math.floor(minutos / 60)
  return `${horas} h atrás`
}

const CONFIG_ESTADO = {
  online:   { punto: "bg-success",  texto: "text-success",  etiqueta: "En línea" },
  inactive: { punto: "bg-warning",  texto: "text-warning",  etiqueta: "Inactivo" },
  offline:  { punto: "bg-danger",   texto: "text-danger",   etiqueta: "Sin señal" },
}

const CONFIG_TIPO = {
  master: { etiqueta: "Master",  clase: "badge-secondary" },
  sensor: { etiqueta: "Sensor",  clase: "badge-muted" },
}

export default function NodeCard({ nodo, alActualizar }) {
  const [ocupado, setOcupado] = useState(false)

  const minutos      = minutosDesde(nodo.last_seen)
  const configEstado = CONFIG_ESTADO[nodo.status] ?? CONFIG_ESTADO.offline
  const configTipo   = CONFIG_TIPO[nodo.node_type] ?? { etiqueta: nodo.node_type ?? "—", clase: "badge-muted" }
  const estaActivo   = nodo.is_active !== false

  async function alternarActivacion() {
    setOcupado(true)
    try {
      if (estaActivo) await desactivarNodo(nodo.id)
      else            await activarNodo(nodo.id)
      alActualizar?.()
    } catch {
      // silencioso — el estado persiste en backend
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className={`card p-4 lg:p-6 flex flex-col gap-3 transition-opacity ${!estaActivo ? "opacity-60" : ""}`}>
      {/* Encabezado */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${configEstado.punto} flex-shrink-0`} />
          <span className={`text-xs font-medium ${configEstado.texto}`}>{configEstado.etiqueta}</span>
        </div>
        <span className={configTipo.clase}>{configTipo.etiqueta}</span>
      </div>

      {/* Ícono central */}
      <div className="flex justify-center py-1">
        {nodo.status === "offline"
          ? <MdWifiOff size={36} className="text-danger/60" />
          : <MdRouter  size={36} className="text-secondary" />
        }
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-mono text-muted truncate">{nodo.mac_address ?? "—"}</p>
        <p className="font-semibold text-dark text-sm truncate">{nodo.room_name ?? nodo.room_id ?? "Sin salón"}</p>
        {nodo.firmware_version && (
          <p className="text-xs text-muted flex items-center gap-1">
            <MdMemory size={12} /> fw {nodo.firmware_version}
          </p>
        )}
      </div>

      {/* Última señal */}
      <p className="text-xs text-muted">{etiquetaMinutos(minutos)}</p>

      {/* Botón */}
      <button
        onClick={alternarActivacion}
        disabled={ocupado}
        className={`flex items-center justify-center gap-1.5 text-xs py-1.5 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          estaActivo
            ? "border-danger/30 text-danger hover:bg-danger/5"
            : "border-success/30 text-success hover:bg-success/5"
        }`}
      >
        {ocupado
          ? <span className="w-3.5 h-3.5 border-2 border-current/40 border-t-current rounded-full animate-spin" />
          : <MdPowerSettingsNew size={14} />
        }
        {estaActivo ? "Desactivar" : "Activar"}
      </button>
    </div>
  )
}
