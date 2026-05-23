import cliente from "./client"

export const obtenerSalones = () =>
  cliente.get("/rooms").then(res => res.data)

export const crearSalon = (carga) =>
  cliente.post("/rooms", carga).then(res => res.data)

export const actualizarSalon = (idSalon, carga) =>
  cliente.patch(`/rooms/${idSalon}`, carga).then(res => res.data)

export const obtenerUltimaLecturaDetalladaSalon = (idSalon) =>
  cliente.get(`/readings/latest/${idSalon}`)
    .then(res => res.data)
    .catch(() => null)
