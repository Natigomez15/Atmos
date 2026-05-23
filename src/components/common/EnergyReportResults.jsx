import { MdDownload, MdBolt, MdSavings, MdTrendingDown, MdLightbulb } from "react-icons/md"

function formatearFechaCorta(iso) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function TarjetaResumen({ icono, etiqueta, valor, colorTexto }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
      <span className={colorTexto}>{icono}</span>
      <div>
        <p className="text-xs text-muted">{etiqueta}</p>
        <p className={`text-lg font-bold ${colorTexto}`}>{valor}</p>
      </div>
    </div>
  )
}

export default function EnergyReportResults({ reporte, alDescargar }) {
  if (!reporte) return null

  const salones       = reporte.rooms ?? []
  const totalKwh      = salones.reduce((acc, s) => acc + (s.total_energy_kwh ?? 0), 0)
  const totalCosto    = salones.reduce((acc, s) => acc + (s.estimated_cost ?? 0), 0)
  const totalAhorro   = salones.reduce((acc, s) => acc + (s.savings_cost ?? 0), 0)
  const promedioAhorro = salones.length
    ? salones.reduce((acc, s) => acc + (s.savings_pct ?? 0), 0) / salones.filter(s => s.savings_pct != null).length
    : 0

  const maxCosto = Math.max(...salones.map(s => s.estimated_cost ?? 0))

  const sumaTemp      = salones.reduce((acc, s) => acc + (s.avg_temperature ?? 0), 0)
  const sumaPresencia = salones.reduce((acc, s) => acc + (s.presence_ratio ?? 0), 0)
  const sumaHorasAC   = salones.reduce((acc, s) => acc + (s.ac_on_hours ?? 0), 0)

  const recomendaciones = salones.flatMap(s => s.recommendations ?? [])

  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-dark text-sm">Resultados del reporte</p>
        <button
          onClick={alDescargar}
          className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
        >
          <MdDownload size={14} /> Exportar CSV
        </button>
      </div>

      <p className="text-xs text-muted">
        {formatearFechaCorta(reporte.period_start)} → {formatearFechaCorta(reporte.period_end)}
      </p>

      {/* Totales globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <TarjetaResumen
          icono={<MdBolt size={20} />}
          etiqueta="Consumo total"
          valor={`${totalKwh.toFixed(2)} kWh`}
          colorTexto="text-secondary"
        />
        <TarjetaResumen
          icono={<span className="text-lg font-bold">$</span>}
          etiqueta="Costo total"
          valor={`$${totalCosto.toFixed(2)} USD`}
          colorTexto="text-warning"
        />
        <TarjetaResumen
          icono={<MdSavings size={20} />}
          etiqueta="Ahorro estimado"
          valor={`$${totalAhorro.toFixed(2)} USD`}
          colorTexto="text-success"
        />
        <TarjetaResumen
          icono={<MdTrendingDown size={20} />}
          etiqueta="Reducción promedio"
          valor={`${isNaN(promedioAhorro) ? "—" : promedioAhorro.toFixed(1)}%`}
          colorTexto="text-success"
        />
      </div>

      {/* Tabla por salón */}
      <div className="card p-0 overflow-x-auto">
        <p className="px-4 pt-4 pb-2 text-sm font-semibold text-dark">Detalle por salón</p>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                { texto: "Salón",         clase: "" },
                { texto: "Consumo (kWh)", clase: "" },
                { texto: "Costo (USD)",   clase: "" },
                { texto: "Temp avg",      clase: "hidden md:table-cell" },
                { texto: "Presencia",     clase: "hidden md:table-cell" },
                { texto: "AC on (h)",     clase: "hidden lg:table-cell" },
                { texto: "Ahorro est.",   clase: "" },
              ].map(enc => (
                <th key={enc.texto} className={`px-4 py-2 text-left text-xs font-semibold text-muted uppercase tracking-wide ${enc.clase}`}>
                  {enc.texto}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {salones.map((salon, i) => (
              <tr key={salon.room_id ?? i} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-2 font-medium text-dark">{salon.room_name}</td>
                <td className="px-4 py-2 text-dark">{salon.total_energy_kwh?.toFixed(3) ?? "—"}</td>
                <td className={`px-4 py-2 font-medium ${salon.estimated_cost === maxCosto ? "text-warning" : "text-dark"}`}>
                  ${salon.estimated_cost?.toFixed(2) ?? "—"}
                </td>
                <td className="px-4 py-2 text-dark hidden md:table-cell">{salon.avg_temperature?.toFixed(1) ?? "—"} °C</td>
                <td className="px-4 py-2 text-dark hidden md:table-cell">
                  {salon.presence_ratio != null ? `${(salon.presence_ratio * 100).toFixed(0)}%` : "—"}
                </td>
                <td className="px-4 py-2 text-dark hidden lg:table-cell">{salon.ac_on_hours?.toFixed(1) ?? "—"} h</td>
                <td className="px-4 py-2">
                  {salon.savings_pct != null
                    ? <span className="badge-success">{salon.savings_pct.toFixed(1)}%</span>
                    : <span className="text-muted">—</span>
                  }
                </td>
              </tr>
            ))}
            {/* Fila totales */}
            {salones.length > 0 && (
              <tr className="bg-gray-50 font-semibold">
                <td className="px-4 py-2 text-dark text-xs uppercase tracking-wide">Total pabellón</td>
                <td className="px-4 py-2 text-dark">{totalKwh.toFixed(3)}</td>
                <td className="px-4 py-2 text-dark">${totalCosto.toFixed(2)}</td>
                <td className="px-4 py-2 text-dark hidden md:table-cell">{salones.length ? (sumaTemp / salones.length).toFixed(1) : "—"} °C</td>
                <td className="px-4 py-2 text-dark hidden md:table-cell">{salones.length ? `${(sumaPresencia / salones.length * 100).toFixed(0)}%` : "—"}</td>
                <td className="px-4 py-2 text-dark hidden lg:table-cell">{salones.length ? (sumaHorasAC / salones.length).toFixed(1) : "—"} h</td>
                <td className="px-4 py-2 text-dark">{isNaN(promedioAhorro) ? "—" : `${promedioAhorro.toFixed(1)}%`}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Recomendaciones */}
      {recomendaciones.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
          <p className="text-sm font-semibold text-dark mb-3">Recomendaciones del sistema</p>
          <ul className="flex flex-col gap-2">
            {recomendaciones.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-dark">
                <MdLightbulb size={16} className="text-warning flex-shrink-0 mt-0.5" />
                {typeof rec === "string" ? rec : rec.message ?? JSON.stringify(rec)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
