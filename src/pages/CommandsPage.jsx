import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { MdRefresh, MdAir } from "react-icons/md"

import PageWrapper       from "../components/layout/PageWrapper"
import QuickCommandForm  from "../components/common/QuickCommandForm"
import CommandRow        from "../components/common/CommandRow"
import { obtenerComandos, obtenerSalonesComandos } from "../api/commands"

const ENCABEZADOS_TABLA = ["Salón", "Comando", "Fuente", "Estado", "Enviado", "Ejecutado"]

function minutosDesde(iso) {
  if (!iso) return 0
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
}

function formatearHoraActual() {
  return new Date().toLocaleTimeString("es-PE", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  })
}

export default function CommandsPage() {
  const [idSalonFiltro,   setIdSalonFiltro]   = useState("")
  const [solosPendientes, setSoloPendientes]  = useState(false)
  const [horaActualizacion]                   = useState(formatearHoraActual)

  // ── Queries ────────────────────────────────────────────────────────

  const { data: salones } = useQuery({
    queryKey: ["rooms"],
    queryFn:  obtenerSalonesComandos,
  })

  const { data: comandos, isLoading: cargandoComandos, refetch: recargarComandos } = useQuery({
    queryKey:        ["commands", idSalonFiltro, solosPendientes],
    queryFn:         () => obtenerComandos({
      room_id:      idSalonFiltro || undefined,
      only_pending: solosPendientes,
      limit:        100,
    }),
    refetchInterval: 15000,
  })

  // ── Datos derivados ────────────────────────────────────────────────

  const mapaSalones = useMemo(
    () => Object.fromEntries(salones?.map(s => [s.id, s.name]) ?? []),
    [salones]
  )

  const conteoTotal     = comandos?.length ?? 0
  const conteoPendiente = useMemo(
    () => comandos?.filter(c => !c.was_executed && minutosDesde(c.commanded_at) <= 30).length ?? 0,
    [comandos]
  )
  const conteoEjecutado = useMemo(
    () => comandos?.filter(c => c.was_executed).length ?? 0,
    [comandos]
  )

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <PageWrapper>

      {/* ── Fila 1: Encabezado ──────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dark">Comandos AC</h2>
        <p className="text-sm text-muted mt-0.5">
          {conteoTotal} comandos
        </p>
      </div>

      {/* ── Fila 2: Dos columnas ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Columna izquierda — 35% */}
        <div className="lg:col-span-2">
          <QuickCommandForm
            salones={salones ?? []}
            alExito={recargarComandos}
          />
        </div>

        {/* Columna derecha — 65% */}
        <div className="lg:col-span-3 card p-0 flex flex-col">

          {/* Barra de filtros */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filtro por salón */}
              <select
                value={idSalonFiltro}
                onChange={e => setIdSalonFiltro(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 bg-white text-dark
                           focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
              >
                <option value="">Todos los salones</option>
                {salones?.map(salon => (
                  <option key={salon.id} value={salon.id}>{salon.name}</option>
                ))}
              </select>

              {/* Toggle solo pendientes */}
              <button
                onClick={() => setSoloPendientes(v => !v)}
                className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                  solosPendientes
                    ? "bg-warning/10 text-warning border border-warning/30"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                Solo pendientes
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={recargarComandos}
                className="btn-secondary flex items-center gap-1.5 py-1.5"
              >
                <MdRefresh size={15} /> Actualizar
              </button>
              <span className="text-xs text-muted hidden sm:block">Actualiza cada 15s</span>
            </div>
          </div>

          {/* Píldoras de estadísticas */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100">
            <span className="text-xs text-muted">{conteoTotal} total</span>
            {conteoPendiente > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">
                {conteoPendiente} pendientes
              </span>
            )}
            {conteoEjecutado > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                {conteoEjecutado} ejecutados
              </span>
            )}
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {ENCABEZADOS_TABLA.map(encabezado => (
                    <th
                      key={encabezado}
                      className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide"
                    >
                      {encabezado}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {cargandoComandos ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !comandos?.length ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center">
                      <MdAir size={40} className="text-muted mx-auto mb-3" />
                      <p className="text-sm font-medium text-dark">
                        No hay comandos registrados
                      </p>
                      <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                        Los comandos aparecerán aquí cuando se envíen desde el
                        dashboard o el modelo ML
                      </p>
                    </td>
                  </tr>
                ) : (
                  comandos.map((comando, i) => (
                    <CommandRow
                      key={comando.id ?? i}
                      comando={comando}
                      nombreSalon={mapaSalones[comando.room_id] ?? "Salón desconocido"}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pie de tabla */}
          {!cargandoComandos && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-muted">
                Mostrando {comandos?.length ?? 0} comandos
              </p>
              <p className="text-xs text-muted">
                Última actualización: {horaActualizacion}
              </p>
            </div>
          )}
        </div>
      </div>

    </PageWrapper>
  )
}
