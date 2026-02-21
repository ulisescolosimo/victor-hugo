/**
 * Traduce mensajes de error de Supabase Auth al español según el contexto.
 */

export type AuthErrorContext = "forgot-password" | "password-reset"

const FORGOT_PASSWORD_MESSAGES: Record<string, string> = {
  "Email not confirmed":
    "Confirmá tu email antes de recuperar la contraseña.",
  "Invalid email": "El correo electrónico no es válido.",
  "User not found": "No hay ninguna cuenta con ese correo.",
  "Rate limit exceeded": "Demasiados intentos. Esperá un momento y probá de nuevo.",
}

const PASSWORD_RESET_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "El enlace no es válido o ya expiró.",
  "Token has expired": "El enlace expiró. Solicitá uno nuevo.",
  "Code has expired": "El enlace expiró. Solicitá uno nuevo.",
  "code_already_used": "Este enlace ya fue usado. Solicitá uno nuevo.",
  "Invalid code": "El enlace no es válido. Solicitá uno nuevo.",
  "New password should be different from the old password":
    "La nueva contraseña debe ser distinta a la anterior.",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres.",
}

export function translateAuthError(
  message: string,
  context: AuthErrorContext
): string {
  const map =
    context === "forgot-password" ? FORGOT_PASSWORD_MESSAGES : PASSWORD_RESET_MESSAGES
  const normalized = message?.trim() ?? ""
  return map[normalized] ?? map[normalized.toLowerCase()] ?? message
}
