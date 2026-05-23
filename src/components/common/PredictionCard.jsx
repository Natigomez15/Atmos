import { MdAutoGraph, MdCheckCircle, MdSend } from "react-icons/md"

function tiempoAtras(iso) {
  if (!iso) return "—"
  const minutos = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutos < 1)  return "hace un momento"
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  if (horas < 24)   return `hace ${horas} h`
  return `hace ${Math.floor(horas / 24)} d`
}

function formatearFecha(iso) {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  })
}

function CirculoConfianza({ puntuacion }) {
  const porcentaje  = Math.round((puntuacion ?? 0) * 100)
  const radio       = 20
  const circunferencia = 2 * Math.PI * radio
  const trazo       = circunferencia * (porcentaje / 100)
  const colorTrazo  = puntuacion >= 0.8 ? "#10B981" : puntuacion >= 0.6 ? "#F59E0B" : "#EF4444"

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={52} height={52} className="-rotate-90">
        <circle cx={26} cy={26} r={radio} fill="none" stroke="#F1F5F9" strokeWidth={4} />
        <circle
          cx={26} cy={26} r={radio}
          fill="none"
          stroke={colorTrazo}
          strokeWidth={4}
          strokeDasharray={`${trazo} ${circunferencia}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-sm font-bold text-dark -mt-8 relative z-10 rotate-0"
        style={{ position: "relative", top: -38 }}>
        {porcentaje}%
      </span>
      <p className="text-xs text-muted" style={{ marginTop: -24 }}>Confianza</p>
    </div>
  )
}

export default function PredictionCard({ prediccion, alAplicar, aplicando }) {
  const sinDatos = prediccion.recommended_setpoint == null

  return (
    <div className="card flex flex-col gap-3">
      {/* Fila superior */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-dark text-sm">{prediccion.room_name}</p>
        <span className="badge-muted">
          {prediccion.model_version ?? "Sin modelo"}
        </span>
      </div>

      {sinDatos ? (
        <div className="flex flex-col items-center py-6 gap-2">
          <MdAutoGraph size={32} className="text-muted" />
          <p className="text-sm text-muted font-medium">Sin predicción disponible</p>
          <p className="text-xs text-muted text-center">
            El modelo necesita más datos históricos
          </p>
        </div>
      ) : (
        <>
          {/* Métricas */}
          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-3xl font-bold text-primary">
                {prediccion.recommended_setpoint}°C
              </span>
              <p className="text-xs text-muted text-center">Setpoint óptimo</p>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-3xl font-bold text-success">
                {prediccion.predicted_savings_pct?.toFixed(1)}%
              </span>
              <p className="text-xs text-muted text-center">Ahorro estimado</p>
            </div>
            <CirculoConfianza puntuacion={prediccion.confidence_score} />
          </div>

          <hr className="border-gray-100" />

          {/* Estado + acción */}
          <div className="flex items-center justify-between gap-2">
            <div>
              {prediccion.was_applied ? (
                <>
                  <span className="badge-success flex items-center gap-1 w-fit">
                    <MdCheckCircle size={12} /> Aplicada
                  </span>
                  {prediccion.applied_at && (
                    <p className="text-xs text-muted mt-0.5">
                      {formatearFecha(prediccion.applied_at)}
                    </p>
                  )}
                </>
              ) : (
                <span className="badge-muted">Pendiente de aplicar</span>
              )}
            </div>

            {prediccion.was_applied ? (
              <button
                disabled
                className="btn-secondary text-xs opacity-50 cursor-not-allowed flex items-center gap-1"
              >
                Ya aplicada
              </button>
            ) : (
              <button
                onClick={() => alAplicar(prediccion.id)}
                disabled={aplicando}
                className="btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aplicando
                  ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <MdSend size={13} />
                }
                Aplicar ahora
              </button>
            )}
          </div>
        </>
      )}

      {/* Pie */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <p className="text-xs text-muted">{tiempoAtras(prediccion.predicted_at)}</p>
        {prediccion.model_version && (
          <p className="text-xs text-muted">Modelo: {prediccion.model_version}</p>
        )}
      </div>
    </div>
  )
}
