import { useEffect, useState, useRef, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import Sidebar             from "./Sidebar"
import Topbar              from "./Topbar"
import AlertToastContainer from "../common/AlertToast"
import cliente             from "../../api/client"
import { WS_BASE_URL }     from "../../constants/config"

const WS_URL_ALERTAS = `${WS_BASE_URL}/ws/alerts`

export default function PageWrapper({ children }) {
  const clienteQuery = useQueryClient()

  const [cantidadAlertas, setCantidadAlertas] = useState(0)
  const [wsConectado,     setWsConectado]     = useState(false)
  const [toasts,          setToasts]          = useState([])

  const refWs              = useRef(null)
  const timeoutReconexion  = useRef(null)
  const montado            = useRef(true)

  // ── helpers de toast ────────────────────────────────────────────────────
  const agregarToast = useCallback((datos) => {
    const nuevoToast = { ...datos, id: `${Date.now()}-${Math.random()}` }
    setToasts(prev => [...prev.slice(-4), nuevoToast]) // máx 5 visibles
  }, [])

  const cerrarToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── polling HTTP de respaldo (cada 60s) ──────────────────────────────────
  useEffect(() => {
    async function obtenerResumen() {
      try {
        const resp = await cliente.get("/alerts/summary")
        if (montado.current) {
          setCantidadAlertas(resp.data?.total_unresolved ?? 0)
        }
      } catch { /* mantener conteo anterior */ }
    }

    obtenerResumen()
    const intervalo = setInterval(obtenerResumen, 60000)
    return () => clearInterval(intervalo)
  }, [])

  // ── WebSocket global ─────────────────────────────────────────────────────
  useEffect(() => {
    montado.current = true

    function conectar() {
      if (!montado.current) return

      const ws = new WebSocket(WS_URL_ALERTAS)
      refWs.current = ws

      ws.onopen = () => {
        if (montado.current) setWsConectado(true)
      }

      ws.onmessage = (evento) => {
        if (!montado.current) return
        try {
          const datos = JSON.parse(evento.data)

          if (datos.type === "new_alert" || datos.type === "alert") {
            const alerta = datos.alert ?? datos

            // actualizar badge
            setCantidadAlertas(prev => prev + 1)

            // mostrar toast
            agregarToast({
              severity:   alerta.severity,
              alert_type: alerta.alert_type,
              message:    alerta.message,
              room_name:  alerta.room_name ?? null,
            })

            // invalidar queries para refrescar AlertsPage y Dashboard
            clienteQuery.invalidateQueries({ queryKey: ["alertas"] })
            clienteQuery.invalidateQueries({ queryKey: ["resumen-alertas"] })
            clienteQuery.invalidateQueries({ queryKey: ["resumen-tablero"] })
            clienteQuery.invalidateQueries({ queryKey: ["alertas-recientes"] })
          }

          if (datos.type === "alert_resolved") {
            setCantidadAlertas(prev => Math.max(0, prev - 1))
            clienteQuery.invalidateQueries({ queryKey: ["alertas"] })
            clienteQuery.invalidateQueries({ queryKey: ["resumen-alertas"] })
          }

          if (datos.type === "summary_update") {
            setCantidadAlertas(datos.total_unresolved ?? 0)
          }
        } catch { /* mensaje no JSON — ignorar */ }
      }

      ws.onerror = () => {
        if (montado.current) setWsConectado(false)
      }

      ws.onclose = () => {
        if (!montado.current) return
        setWsConectado(false)
        // reconectar en 5s
        timeoutReconexion.current = setTimeout(conectar, 5000)
      }
    }

    conectar()

    return () => {
      montado.current = false
      clearTimeout(timeoutReconexion.current)
      if (refWs.current) {
        refWs.current.onclose = null  // evita re-reconexión al desmontar
        refWs.current.close()
      }
    }
  }, [clienteQuery, agregarToast])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar cantidadAlertas={cantidadAlertas} />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar cantidadAlertas={cantidadAlertas} wsConectado={wsConectado} />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      <AlertToastContainer toasts={toasts} alCerrar={cerrarToast} />
    </div>
  )
}
