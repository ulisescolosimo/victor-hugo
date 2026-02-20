# Supabase

## Crear la tabla de perfiles

1. Entra en [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto.
2. Ve a **SQL Editor** → **New query**.
3. Copia y pega el contenido de `migrations/20250220000000_create_profiles.sql`.
4. Ejecuta la consulta (Run).

Con eso se crea la tabla `profiles`, las políticas RLS y el trigger que crea un perfil automáticamente cuando un usuario se registra (con nombre y apellido desde el formulario).

## Tabla de fases de financiamiento

Para que los montos de las fases (FASE 01, 02, 03) se editen desde Supabase:

1. En **SQL Editor**, ejecuta el contenido de `migrations/20250220100000_create_funding_phases.sql`.
2. Se crea la tabla `funding_phases` con: `sort_order`, `title`, `amount`, `description`.
3. Para cambiar los montos: **Table Editor** → `funding_phases` → editar la columna `amount` (y opcionalmente `title`, `description`) en cada fila.
