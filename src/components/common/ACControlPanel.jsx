import { useEffect, useState } from "react"
import {
  MdPowerSettingsNew,
  MdPowerOff,
  MdAdd,
  MdRemove,
  MdCheckCircle,
  MdError,
} from "react-icons/md"
import { enviarComandoAC } from "../../api/monitoring"

export default function ACControlPanel({
  idSalon,
  nombreSalon,
  acEncendido = false,
  setpoint    = null,
  alComando,
}) {
  const [setpointLocal,    setSetpointLocal]    = useState(setpoint ?? 24)
  const [enviando,         setEnviando]         = useState(false)
  const [ultimoResultado,  setUltimoResultado]  = useState(null)

  useEffect(() => {
    if (setpoint != null) setSetpointLocal(setpoint)
  }, [setpoint])

  useEffect(() => {
    if (!ultimoResultado) return
    const temporizador = setTimeout(() => setUltimoResultado(null), 3000)
    return () => clearTimeout(temporizador)
  }, [ultimoResultado])

  async function ejecutarComando(tipoComando, parametrosExtra = {}) {
    setEnviando(true)
    try {
      await enviarComandoAC({
        room_id:      idSalon,
        command_type: tipoComando,
        source:       "manual",
        ...parametrosExtra,
      })
      setUltimoResultado("exito")
      alComando?.()
    } catch {
      setUltimoResultado("error")
    } finally {
      setTimeout(() => setEnviando(false), 1000)
    }
  }

  const estiloBotonContorno =
    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium " +
    "border border-gray-200 text-muted hover:bg-gray-50 transition-colors duration-200"

  return (
    <div className="card">
      <p className="font-semibold text-dark text-sm">Control AC</p>
      <p className="text-xs text-muted mb-3">{nombreSalon}</p>
      <hr className="border-gray-100 mb-4" />

      {/* Encender / Apagar */}
      <div className="flex gap-2 mb-4">
        <button
          disabled={enviando}
          onClick={() => ejecutarComando("on")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
            !acEncendido
              ? "bg-primary text-white hover:bg-primary/90"
              : estiloBotonContorno
          }`}
        >
          <MdPowerSettingsNew size={16} />
          Encender
        </button>

        <button
          disabled={enviando}
          onClick={() => ejecutarComando("off")}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
            acEncendido
              ? "bg-danger text-white hover:bg-danger/90"
              : estiloBotonContorno
          }`}
        >
          <MdPowerOff size={16} />
          Apagar
        </button>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* Setpoint */}
      <p className="text-sm font-medium text-dark mb-3">Temperatura objetivo</p>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setSetpointLocal(v => Math.max(16, v - 1))}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-muted hover:bg-gray-50 transition-colors"
        >
          <MdRemove size={18} />
        </button>

        <div className="text-center">
          <span className="text-2xl font-bold text-primary">{setpointLocal}</span>
          <span className="text-sm text-muted"> °C</span>
        </div>

        <button
          onClick={() => setSetpointLocal(v => Math.min(30, v + 1))}
          className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-muted hover:bg-gray-50 transition-colors"
        >
          <MdAdd size={18} />
        </button>
      </div>

      <button
        disabled={enviando || setpointLocal === setpoint}
        onClick={() => ejecutarComando("setpoint", { setpoint: setpointLocal })}
        className="btn-primary w-full justify-center flex items-center disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {enviando ? "Enviando..." : "Aplicar setpoint"}
      </button>

      {/* Resultado */}
      {ultimoResultado && (
        <div className={`flex items-center gap-1.5 mt-3 text-xs font-medium ${
          ultimoResultado === "exito" ? "text-success" : "text-danger"
        }`}>
          {ultimoResultado === "exito"
            ? <><MdCheckCircle size={14} /> Comando enviado</>
            : <><MdError size={14} /> Error al enviar</>
          }
        </div>
      )}

      <p className="text-xs text-muted mt-3">
        El ESP32 ejecutará el comando en su próximo ciclo (30-60s)
      </p>
    </div>
  )
}
