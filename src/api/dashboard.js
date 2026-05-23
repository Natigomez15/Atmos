import cliente from "./client"

export const obtenerResumenTablero = () =>
  cliente.get("/reports/summary/pavilion?period_days=1").then(res => res.data)

export const obtenerUltimasLecturasSalones = async () => {
  const salones = await cliente.get("/rooms").then(res => res.data)
  const ultimasLecturas = await Promise.all(
    salones.map(salon =>
      cliente.get(`/readings/latest/${salon.id}`)
        .then(res => ({ ...res.data, room_name: salon.name, room_id: salon.id }))
        .catch(() => ({
          room_id:     salon.id,
          room_name:   salon.name,
          temperature: null,
          humidity:    null,
          presence:    false,
          ac_is_on:    false,
          power_w:     null,
          recorded_at: null,
        }))
    )
  )
  return ultimasLecturas
}

export const obtenerResumenAlertas = () =>
  cliente.get("/alerts/summary").then(res => res.data)

export const obtenerAlertasRecientes = () =>
  cliente.get("/alerts?is_resolved=false&limit=5").then(res => res.data)

export const obtenerConsumoPorHora = (idSalon) =>
  cliente.get(`/readings?room_id=${idSalon}&start=${
    new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }&end=${new Date().toISOString()}&limit=2000`).then(res => res.data)
