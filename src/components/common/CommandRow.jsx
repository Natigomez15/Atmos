import {
  MdPowerSettingsNew,
  MdPowerOff,
  MdThermostat,
  MdAir,
  MdAutoGraph,
} from "react-icons/md"

function formatearHora(iso) {
  if (!iso) return "—"
  const fecha = new Date(iso)
  const hoy   = new Date()
  const esHoy =
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()

  const hora = fecha.toLocaleTimeString("es-PE", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  })
  if (esHoy) return hora
  return `${hora} · ${fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}`
}

function segundosEntre(isoInicio, isoFin) {
  if (!isoInicio || !isoFin) return null
  return Math.round((new Date(isoFin) - new Date(isoInicio)) / 1000)
}

function minutosDesde(iso) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
}

function IconoComando({ tipo, setpoint, modo, velocidadVentilador }) {
  switch (tipo) {
    case "on":
      return <><MdPowerSettingsNew size={15} className="text-success" /><span>Encender</span></>
    case "off":
      return <><MdPowerOff size={15} className="text-danger" /><span>Apagar</span></>
    case "setpoint":
      return <><MdThermostat size={15} className="text-secondary" /><span>Setpoint {setpoint}°C</span></>
    case "mode":
      return <><MdAir size={15} className="text-primary" /><span>Modo {modo}</span></>
    case "fan_speed":
      return <><MdAir size={15} className="text-muted" /><span>Velocidad {velocidadVentilador}</span></>
    default:
      return <span className="text-muted">{tipo}</span>
  }
}

function InsigniaFuente({ fuente }) {
  if (fuente === "ml_model") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}
      >
        <MdAutoGraph size={12} /> Modelo ML
      </span>
    )
  }
  if (fuente === "emergency") return <span className="badge-danger">Emergencia</span>
  if (fuente === "schedule")  return <span className="badge-muted">Programado</span>
  return <span className="badge-muted">Manual</span>
}

function InsigniaEstado({ fueEjecutado, enviadoEn }) {
  if (!fueEjecutado && minutosDesde(enviadoEn) > 30) {
    return <span className="badge-danger">Expirado</span>
  }
  if (!fueEjecutado) {
    return (
      <span className="flex items-center gap-1.5 text-warning text-xs font-medium">
        <span className="w-2 h-2 bg-warning rounded-full animate-pulse inline-block" />
        Pendiente
      </span>
    )
  }
  return <span className="badge-success">Ejecutado</span>
}

export default function CommandRow({ comando, nombreSalon }) {
  const diferencia = segundosEntre(comando.commanded_at, comando.executed_at)

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
      {/* Salón */}
      <td className="px-4 py-3 text-sm font-medium text-dark">{nombreSalon}</td>

      {/* Comando */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-dark">
          <IconoComando
            tipo={comando.command_type}
            setpoint={comando.setpoint}
            modo={comando.mode}
            velocidadVentilador={comando.fan_speed}
          />
        </div>
      </td>

      {/* Fuente */}
      <td className="px-4 py-3">
        <InsigniaFuente fuente={comando.source} />
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <InsigniaEstado fueEjecutado={comando.was_executed} enviadoEn={comando.commanded_at} />
      </td>

      {/* Enviado */}
      <td className="px-4 py-3 text-sm text-muted">
        {formatearHora(comando.commanded_at)}
      </td>

      {/* Ejecutado */}
      <td className="px-4 py-3 text-sm">
        {comando.was_executed ? (
          <span className="text-dark">
            {formatearHora(comando.executed_at)}
            {diferencia != null && (
              <span className="block text-xs text-muted">({diferencia}s después)</span>
            )}
          </span>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
    </tr>
  )
}
