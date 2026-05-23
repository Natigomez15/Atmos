function tiempoAtras(iso) {
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutos < 1)  return "ahora"
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24)   return `${horas} h`
  return `${Math.floor(horas / 24)} d`
}

const SEVERIDAD = {
  high:   { punto: "bg-danger",  insignia: "badge-danger",  etiqueta: "Alta" },
  medium: { punto: "bg-warning", insignia: "badge-warning", etiqueta: "Media" },
  low:    { punto: "bg-success", insignia: "badge-success", etiqueta: "Baja" },
}

export default function AlertItem({
  alert_type,
  severity = "low",
  message,
  created_at,
  room_name,
}) {
  const nivel = SEVERIDAD[severity] ?? SEVERIDAD.low

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${nivel.punto}`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-dark leading-snug">{message}</p>
        <p className="text-xs text-muted mt-0.5">
          {room_name && <span>{room_name} &bull; </span>}
          {created_at ? tiempoAtras(created_at) : "—"}
        </p>
      </div>

      <span className={`flex-shrink-0 ${nivel.insignia}`}>{nivel.etiqueta}</span>
    </div>
  )
}
