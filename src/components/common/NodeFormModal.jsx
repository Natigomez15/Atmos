import { useState, useEffect } from "react"
import { MdClose } from "react-icons/md"
import { registrarNodo, actualizarNodo } from "../../api/nodes"

const DATOS_VACIOS = {
  mac_address:      "",
  node_type:        "sensor",
  room_id:          "",
  firmware_version: "",
  description:      "",
}

const TIPOS_NODO = ["sensor", "master"]

const estiloInput =
  "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white " +
  "focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"

function validarMac(mac) {
  return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac)
}

export default function NodeFormModal({ estaAbierto, alCerrar, alGuardar, nodo, salones = [] }) {
  const [formulario, setFormulario] = useState(DATOS_VACIOS)
  const [errores,    setErrores]    = useState({})
  const [guardando,  setGuardando]  = useState(false)
  const [errorApi,   setErrorApi]   = useState(null)

  const esEdicion = !!nodo?.id

  useEffect(() => {
    if (estaAbierto) {
      setFormulario(nodo ? {
        mac_address:      nodo.mac_address      ?? "",
        node_type:        nodo.node_type        ?? "sensor",
        room_id:          nodo.room_id          ?? "",
        firmware_version: nodo.firmware_version ?? "",
        description:      nodo.description      ?? "",
      } : DATOS_VACIOS)
      setErrores({})
      setErrorApi(null)
    }
  }, [estaAbierto, nodo])

  function actualizar(campo, valor) {
    setFormulario(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: undefined }))
  }

  function validar() {
    const errs = {}
    if (!formulario.mac_address.trim())        errs.mac_address = "Dirección MAC requerida"
    else if (!validarMac(formulario.mac_address)) errs.mac_address = "Formato inválido (ej: AA:BB:CC:DD:EE:FF)"
    if (!formulario.node_type)                 errs.node_type   = "Selecciona el tipo"
    return errs
  }

  async function manejarGuardar(e) {
    e.preventDefault()
    const errs = validar()
    if (Object.keys(errs).length) { setErrores(errs); return }
    setGuardando(true)
    setErrorApi(null)
    try {
      const carga = {
        mac_address:      formulario.mac_address.trim().toUpperCase(),
        node_type:        formulario.node_type,
        room_id:          formulario.room_id || null,
        firmware_version: formulario.firmware_version.trim() || null,
        description:      formulario.description.trim() || null,
      }
      if (esEdicion) await actualizarNodo(nodo.id, carga)
      else           await registrarNodo(carga)
      alGuardar()
    } catch {
      setErrorApi("Error al guardar el nodo. Verifica los datos e intenta nuevamente.")
    } finally {
      setGuardando(false)
    }
  }

  if (!estaAbierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={alCerrar} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-dark">
            {esEdicion ? "Editar nodo" : "Registrar nodo"}
          </h2>
          <button onClick={alCerrar} className="text-muted hover:text-dark transition-colors">
            <MdClose size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={manejarGuardar} className="flex flex-col gap-4 px-6 py-5 overflow-y-auto">

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">
              Dirección MAC *
            </label>
            <input
              type="text"
              value={formulario.mac_address}
              onChange={e => actualizar("mac_address", e.target.value)}
              placeholder="AA:BB:CC:DD:EE:FF"
              className={`${estiloInput} font-mono ${errores.mac_address ? "border-danger focus:ring-danger/30 focus:border-danger" : ""}`}
            />
            {errores.mac_address && <p className="text-xs text-danger mt-1">{errores.mac_address}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">
              Tipo de nodo *
            </label>
            <div className="flex gap-2">
              {TIPOS_NODO.map(tipo => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => actualizar("node_type", tipo)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors capitalize ${
                    formulario.node_type === tipo
                      ? "bg-secondary text-white border-secondary"
                      : "bg-white text-muted border-gray-200 hover:border-secondary/40"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
            {errores.node_type && <p className="text-xs text-danger mt-1">{errores.node_type}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">
              Salón asignado
            </label>
            <select
              value={formulario.room_id}
              onChange={e => actualizar("room_id", e.target.value)}
              className={estiloInput}
            >
              <option value="">Sin asignar</option>
              {salones.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">
              Versión de firmware
            </label>
            <input
              type="text"
              value={formulario.firmware_version}
              onChange={e => actualizar("firmware_version", e.target.value)}
              placeholder="v1.0.0"
              className={estiloInput}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <input
              type="text"
              value={formulario.description}
              onChange={e => actualizar("description", e.target.value)}
              placeholder="Descripción opcional..."
              className={estiloInput}
            />
          </div>

          {errorApi && <p className="text-xs text-danger">{errorApi}</p>}
        </form>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={alCerrar}
            className="flex-1 btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={manejarGuardar}
            disabled={guardando}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Guardando…
                </span>
              : esEdicion ? "Guardar cambios" : "Registrar nodo"
            }
          </button>
        </div>
      </div>
    </div>
  )
}
