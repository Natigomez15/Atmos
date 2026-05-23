import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { MdAdd, MdRefresh, MdRouter, MdWifi, MdWifiOff, MdSignalWifiStatusbarNull } from "react-icons/md"
import PageWrapper    from "../components/layout/PageWrapper"
import NodeCard       from "../components/common/NodeCard"
import NodeFormModal  from "../components/common/NodeFormModal"
import { obtenerNodos, obtenerSalonesNodos } from "../api/nodes"

const OPCIONES_ESTADO = [
  { valor: "todos",    etiqueta: "Todos" },
  { valor: "online",   etiqueta: "En línea" },
  { valor: "inactive", etiqueta: "Inactivos" },
  { valor: "offline",  etiqueta: "Sin señal" },
]

const OPCIONES_TIPO = [
  { valor: "todos",  etiqueta: "Todos los tipos" },
  { valor: "master", etiqueta: "Master" },
  { valor: "sensor", etiqueta: "Sensor" },
]

function TarjetaConteo({ icono, etiqueta, cantidad, colorIcono }) {
  return (
    <div className="card flex items-center gap-3 py-3">
      <span className={colorIcono}>{icono}</span>
      <div>
        <p className="text-xl font-bold text-dark">{cantidad}</p>
        <p className="text-xs text-muted">{etiqueta}</p>
      </div>
    </div>
  )
}

export default function NodesPage() {
  const clienteQuery = useQueryClient()

  const [mostrarModal,   setMostrarModal]   = useState(false)
  const [nodoEditando,   setNodoEditando]   = useState(null)
  const [filtroSalon,    setFiltroSalon]    = useState("todos")
  const [filtroEstado,   setFiltroEstado]   = useState("todos")
  const [filtroTipo,     setFiltroTipo]     = useState("todos")

  const { data: nodos = [], isLoading: cargandoNodos, refetch: recargar } = useQuery({
    queryKey: ["nodos"],
    queryFn:  obtenerNodos,
    refetchInterval: 30000,
  })

  const { data: salones = [] } = useQuery({
    queryKey: ["salones-nodos"],
    queryFn:  obtenerSalonesNodos,
  })

  const conteoEnLinea   = nodos.filter(n => n.status === "online").length
  const conteoInactivo  = nodos.filter(n => n.status === "inactive").length
  const conteoSinSenal  = nodos.filter(n => n.status === "offline").length

  const nodosFiltrados = nodos.filter(nodo => {
    if (filtroSalon !== "todos" && String(nodo.room_id) !== filtroSalon) return false
    if (filtroEstado !== "todos" && nodo.status !== filtroEstado)         return false
    if (filtroTipo   !== "todos" && nodo.node_type !== filtroTipo)        return false
    return true
  })

  function abrirNuevoNodo() {
    setNodoEditando(null)
    setMostrarModal(true)
  }

  function abrirEdicionNodo(nodo) {
    setNodoEditando(nodo)
    setMostrarModal(true)
  }

  function cerrarModal() {
    setMostrarModal(false)
    setNodoEditando(null)
  }

  function alGuardar() {
    cerrarModal()
    clienteQuery.invalidateQueries({ queryKey: ["nodos"] })
  }

  function alActualizar() {
    clienteQuery.invalidateQueries({ queryKey: ["nodos"] })
  }

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">

        {/* Encabezado */}
        <div className="flex items-center justify-between">
          <div />
          <button
            onClick={abrirNuevoNodo}
            className="btn-primary flex items-center gap-2"
          >
            <MdAdd size={18} /> Registrar nodo
          </button>
        </div>

        {/* Conteos */}
        <div className="grid grid-cols-3 gap-2 lg:gap-4">
          <TarjetaConteo
            icono={<MdWifi size={22} />}
            etiqueta="En línea"
            cantidad={conteoEnLinea}
            colorIcono="text-success"
          />
          <TarjetaConteo
            icono={<MdSignalWifiStatusbarNull size={22} />}
            etiqueta="Inactivo"
            cantidad={conteoInactivo}
            colorIcono="text-warning"
          />
          <TarjetaConteo
            icono={<MdWifiOff size={22} />}
            etiqueta="Sin señal"
            cantidad={conteoSinSenal}
            colorIcono="text-danger"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2">
          <select
            value={filtroSalon}
            onChange={e => setFiltroSalon(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition-colors"
          >
            <option value="todos">Todos los salones</option>
            {salones.map(s => (
              <option key={s.id} value={String(s.id)}>{s.name}</option>
            ))}
          </select>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {OPCIONES_ESTADO.map(op => (
              <button
                key={op.valor}
                onClick={() => setFiltroEstado(op.valor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filtroEstado === op.valor
                    ? "bg-white text-dark shadow-sm"
                    : "text-muted hover:text-dark"
                }`}
              >
                {op.etiqueta}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {OPCIONES_TIPO.map(op => (
              <button
                key={op.valor}
                onClick={() => setFiltroTipo(op.valor)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filtroTipo === op.valor
                    ? "bg-white text-dark shadow-sm"
                    : "text-muted hover:text-dark"
                }`}
              >
                {op.etiqueta}
              </button>
            ))}
          </div>

          <button
            onClick={() => recargar()}
            className="btn-secondary flex items-center gap-1.5 text-sm py-2"
          >
            <MdRefresh size={16} /> Actualizar
          </button>

          {nodosFiltrados.length !== nodos.length && (
            <span className="text-xs text-muted">
              {nodosFiltrados.length} de {nodos.length} nodos
            </span>
          )}
        </div>

        {/* Grid de nodos */}
        {cargandoNodos
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card h-48 animate-pulse bg-gray-100" />
              ))}
            </div>
          : nodosFiltrados.length === 0
            ? <div className="card flex flex-col items-center justify-center h-48 gap-3">
                <MdRouter size={40} className="text-gray-300" />
                <p className="text-muted text-sm">
                  {nodos.length === 0
                    ? "No hay nodos registrados. Presiona \"Registrar nodo\" para agregar uno."
                    : "Ningún nodo coincide con los filtros aplicados."
                  }
                </p>
              </div>
            : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {nodosFiltrados.map(nodo => (
                  <NodeCard
                    key={nodo.id}
                    nodo={nodo}
                    alActualizar={alActualizar}
                  />
                ))}
              </div>
        }

      </div>

      <NodeFormModal
        estaAbierto={mostrarModal}
        alCerrar={cerrarModal}
        alGuardar={alGuardar}
        nodo={nodoEditando}
        salones={salones}
      />
    </PageWrapper>
  )
}
