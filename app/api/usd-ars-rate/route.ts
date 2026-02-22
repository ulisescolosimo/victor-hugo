import { NextResponse } from "next/server"
import { getUsdToArsRate } from "@/lib/get-usd-ars-rate"

/** GET: devuelve la cotización USD → ARS (venta) para mostrar precios en la UI. */
export async function GET() {
  try {
    const { rate } = await getUsdToArsRate()
    return NextResponse.json({ rate })
  } catch (err) {
    console.error("usd-ars-rate error:", err)
    return NextResponse.json(
      { error: "No se pudo obtener la cotización" },
      { status: 502 }
    )
  }
}
