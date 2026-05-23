import cliente from "./client"

export const obtenerSalones = () =>
  cliente.get("/rooms").then(res => res.data)

export const obtenerUltimaLectura = (idSalon) =>
  cliente.get(`/readings/latest/${idSalon}`).then(res => res.data)

export const obtenerLecturasHistoricas = (idSalon, horas = 6) =>
  cliente.get("/readings", {
    params: {
      room_id: idSalon,
      start:   new Date(Date.now() - horas * 60 * 60 * 1000).toISOString(),
      end:     new Date().toISOString(),
      limit:   500,
    }
  }).then(res => res.data)

export const enviarComandoAC = (carga) =>
  cliente.post("/ac-commands", carga).then(res => res.data)

export const obtenerComandosPendientes = (idSalon) =>
  cliente.get("/ac-commands", {
    params: { room_id: idSalon, only_pending: true, limit: 10 }
  }).then(res => res.data)
