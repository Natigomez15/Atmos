import cliente from "./client"

export const obtenerAlertas       = (params)   => cliente.get("/alerts", { params }).then(r => r.data)
export const obtenerResumenAlertas = ()         => cliente.get("/alerts/summary").then(r => r.data)
export const resolverAlerta       = (idAlerta) => cliente.patch(`/alerts/${idAlerta}/resolve`).then(r => r.data)
export const ejecutarChecks       = ()         => cliente.post("/alerts/run-checks").then(r => r.data)
