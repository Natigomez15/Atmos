import axios from "axios"
import { API_BASE_URL, API_KEY } from "../constants/config"

const cliente = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  },
  timeout: 10000,
})

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      console.error("ATMOS: Clave de API inválida o ausente")
    }
    if (error.response?.status === 503) {
      console.error("ATMOS: Backend no disponible")
    }
    return Promise.reject(error)
  }
)

export default cliente
