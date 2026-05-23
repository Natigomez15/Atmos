const MAPA_COLORES = {
  primary:   { fondo: "bg-primary/10",   texto: "text-primary" },
  secondary: { fondo: "bg-secondary/10", texto: "text-secondary" },
  success:   { fondo: "bg-success/10",   texto: "text-success" },
  warning:   { fondo: "bg-warning/10",   texto: "text-warning" },
  danger:    { fondo: "bg-danger/10",    texto: "text-danger" },
}

export default function KPICard({
  titulo,
  valor,
  unidad,
  icono,
  tendencia,
  color    = "primary",
  cargando = false,
}) {
  const { fondo, texto } = MAPA_COLORES[color] ?? MAPA_COLORES.primary

  if (cargando) {
    return (
      <div className="card animate-pulse">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full ${fondo} flex items-center justify-center`}>
          <span className={texto}>{icono}</span>
        </div>
        {tendencia != null && (
          <span
            className={`text-xs font-medium flex items-center gap-0.5 ${
              tendencia >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {tendencia >= 0 ? "↑" : "↓"} {Math.abs(tendencia).toFixed(1)}%
          </span>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">{titulo}</p>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-2xl lg:text-3xl font-bold text-dark">{valor}</span>
        {unidad && <span className="text-sm text-muted">{unidad}</span>}
      </div>
    </div>
  )
}
