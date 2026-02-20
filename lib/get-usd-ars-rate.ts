/**
 * Obtiene la cotización USD → ARS (dólar oficial venta) desde DolarAPI.
 * Usamos "venta" para calcular el monto que paga el usuario en ARS.
 */
const DOLAR_API_URL = "https://dolarapi.com/v1/dolares/oficial"

export type DolarOficial = {
  moneda: string
  casa: string
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export async function getUsdToArsRate(): Promise<{ rate: number; raw?: DolarOficial }> {
  const res = await fetch(DOLAR_API_URL, { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error(`DolarAPI error: ${res.status}`)
  }
  const data = (await res.json()) as DolarOficial
  return { rate: data.venta, raw: data }
}
