import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administración de pagos",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-zinc-950 text-white">{children}</main>
}
