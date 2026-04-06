/**
 * Lista de emails de administrador (coma-separados, sin espacios extra).
 * Definir en .env.local: ADMIN_EMAILS=uno@ejemplo.com,otro@ejemplo.com
 */
export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ""
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return getAdminEmails().includes(normalized)
}
