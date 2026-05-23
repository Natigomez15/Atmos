import { NavLink } from "react-router-dom"
import logoAtmos from "../../assets/logo_atmos.png"
import {
  MdDashboard,
  MdMeetingRoom,
  MdMonitor,
  MdAir,
  MdAutoGraph,
  MdNotifications,
  MdAssessment,
  MdRouter,
  MdSettings,
} from "react-icons/md"

const navPrincipal = [
  { etiqueta: "Dashboard",       icono: MdDashboard,     ruta: "/dashboard" },
  { etiqueta: "Salones",         icono: MdMeetingRoom,   ruta: "/rooms" },
  { etiqueta: "Monitoreo",       icono: MdMonitor,       ruta: "/monitoring" },
  { etiqueta: "Comandos AC",     icono: MdAir,           ruta: "/commands" },
  { etiqueta: "Predicciones ML", icono: MdAutoGraph,     ruta: "/predictions" },
  { etiqueta: "Alertas",         icono: MdNotifications, ruta: "/alerts" },
  { etiqueta: "Reportes",        icono: MdAssessment,    ruta: "/reports" },
]

const navSistema = [
  { etiqueta: "Nodos ESP32", icono: MdRouter,   ruta: "/nodes" },
  { etiqueta: "Ajustes",     icono: MdSettings, ruta: "/settings" },
]

const estiloBase =
  "flex items-center gap-3 px-4 py-3 rounded-xl mx-2 text-sm text-muted " +
  "hover:bg-gray-50 hover:text-dark transition-colors duration-200"
const estiloActivo = "bg-secondary/10 text-secondary font-medium"

function ElementoNav({ elemento, cantidadAlertas }) {
  const Icono = elemento.icono
  return (
    <NavLink
      to={elemento.ruta}
      className={({ isActive }) =>
        isActive ? `${estiloBase} ${estiloActivo}` : estiloBase
      }
    >
      <Icono size={18} />
      <span className="flex-1">{elemento.etiqueta}</span>
      {elemento.ruta === "/alerts" && cantidadAlertas > 0 && (
        <span className="relative flex items-center justify-center w-5 h-5">
          <span className="absolute inline-flex w-full h-full rounded-full bg-danger opacity-40 animate-ping" />
          <span className="relative flex items-center justify-center w-4 h-4 rounded-full bg-danger text-white text-[10px] font-bold leading-none">
            {cantidadAlertas > 9 ? "9+" : cantidadAlertas}
          </span>
        </span>
      )}
    </NavLink>
  )
}

export default function Sidebar({ cantidadAlertas = 0 }) {
  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 flex flex-col items-center">
        <img
          src={logoAtmos}
          alt="ATMOS"
          className="h-10 w-auto object-contain mx-auto"
        />
        <p className="text-xs text-muted mt-0.5 text-center">Sistema de Control Energético</p>
        <hr className="mt-4 border-gray-100" />
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-0 py-2">
        <p className="px-6 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
          Menú Principal
        </p>
        <div className="flex flex-col gap-0.5">
          {navPrincipal.map((elemento) => (
            <ElementoNav key={elemento.ruta} elemento={elemento} cantidadAlertas={cantidadAlertas} />
          ))}
        </div>

        <p className="px-6 mt-6 mb-2 text-xs font-semibold text-muted uppercase tracking-wider">
          Sistema
        </p>
        <div className="flex flex-col gap-0.5">
          {navSistema.map((elemento) => (
            <ElementoNav key={elemento.ruta} elemento={elemento} cantidadAlertas={cantidadAlertas} />
          ))}
        </div>
      </nav>

      {/* Pie de página */}
      <div className="px-6 py-4">
        <p className="text-xs text-muted">ATMOS v1.0</p>
        <p className="text-xs text-muted">UTP — Proyecto JIC 2025</p>
      </div>
    </aside>
  )
}
