import { createHash, timingSafeEqual } from "node:crypto"

const ADMIN_COOKIE_NAME = "vh_admin_session"

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

function getAdminPassword(): string {
  return process.env.ADMIN_DASHBOARD_PASSWORD ?? ""
}

function getAdminSecret(): string {
  return process.env.ADMIN_DASHBOARD_SECRET ?? "victor-hugo-admin"
}

export function isAdminConfigured(): boolean {
  return getAdminPassword().length > 0
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME
}

function expectedToken(): string {
  return sha256(`${getAdminPassword()}:${getAdminSecret()}`)
}

export function verifyAdminPassword(password: string): boolean {
  const current = getAdminPassword()
  if (!current || !password) return false
  if (password.length !== current.length) return false
  return timingSafeEqual(Buffer.from(password), Buffer.from(current))
}

export function createAdminSessionToken(): string {
  return expectedToken()
}

export function isValidAdminSession(token?: string): boolean {
  if (!token || !isAdminConfigured()) return false
  const expected = expectedToken()
  if (token.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}
