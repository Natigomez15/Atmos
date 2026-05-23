import { useEffect, useRef, useState, useCallback } from "react"
import { WS_BASE_URL, API_KEY } from "../constants/config"

export function useRoomWebSocket(idSalon) {
  const refWs              = useRef(null)
  const timeoutReconexion  = useRef(null)

  const [ultimaLectura, setUltimaLectura]   = useState(null)
  const [estaConectado, setEstaConectado]   = useState(false)
  const [reconectando,  setReconectando]    = useState(false)

  const conectar = useCallback(() => {
    if (!idSalon) return
    const url = `${WS_BASE_URL}/ws/rooms/${idSalon}?api_key=${API_KEY}`
    const ws  = new WebSocket(url)
    refWs.current = ws

    ws.onopen = () => {
      setEstaConectado(true)
      setReconectando(false)
    }

    ws.onmessage = (evento) => {
      const datos = JSON.parse(evento.data)
      if (datos.type === "new_reading") {
        setUltimaLectura(datos)
      }
    }

    ws.onclose = () => {
      setEstaConectado(false)
      setReconectando(true)
      timeoutReconexion.current = setTimeout(conectar, 5000)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [idSalon])

  useEffect(() => {
    conectar()
    return () => {
      clearTimeout(timeoutReconexion.current)
      refWs.current?.close()
    }
  }, [conectar])

  const enviarMensaje = useCallback((mensaje) => {
    if (refWs.current?.readyState === WebSocket.OPEN) {
      refWs.current.send(JSON.stringify(mensaje))
    }
  }, [])

  return { ultimaLectura, estaConectado, reconectando, enviarMensaje }
}
