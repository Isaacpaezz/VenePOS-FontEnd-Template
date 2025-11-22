# Guía de Migración a Producción: VenePOS

**Versión del Documento:** 1.0.0
**Objetivo:** Transformar el prototipo "Client-Side" actual en una aplicación **Next.js 15 (App Router)** completa, conectada a base de datos real y lista para despliegue.

---

## 1. Stack Tecnológico de Producción

Debes inicializar el proyecto con estas tecnologías exactas para mantener la fidelidad del diseño y la funcionalidad requerida.

*   **Framework:** Next.js 15 (App Router).
*   **Lenguaje:** TypeScript (Estricto).
*   **Estilos:** Tailwind CSS v4 (vía PostCSS, no CDN).
*   **Base de Datos:** Supabase (PostgreSQL).
*   **Autenticación:** Better-Auth (Conectado a Supabase Postgres).
*   **ORM:** Drizzle ORM (Recomendado para SQL type-safety) o Prisma.
*   **Notificaciones:** Sonner (Reemplazando el toast mockeado).
*   **Iconos:** Lucide React.
*   **Gráficos:** Recharts.

---

## 2. Fase 1: Inicialización del Proyecto

### 2.1. Scaffolding
Ejecuta en tu terminal:
```bash
npx create-next-app@latest venepos
# Selecciona:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - `src/` directory: No (Para mantener la estructura actual `app/`)
# - App Router: Yes
# - Import alias: @/*
```

### 2.2. Instalación de Dependencias
```bash
pnpm add better-auth sonner lucide-react recharts clsx tailwind-merge @tanstack/react-table class-variance-authority
pnpm add drizzle-orm postgres # O el cliente de Supabase directo
pnpm add -D drizzle-kit
```

### 2.3. Migración de Estilos (Tailwind)
El prototipo usa variables CSS en `index.html`. Debes moverlas a `app/globals.css` en Next.js.

**Archivo `app/globals.css`:**
Copiar todo el contenido dentro de la etiqueta `<style>` del `index.html` actual, pero adaptando la sintaxis a CSS estándar de Tailwind:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... Copiar todas las variables del index.html aquí ... */
    --radius: 0.75rem;
  }
  .dark {
    /* ... Copiar variables dark ... */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

---

## 3. Fase 2: Migración del Frontend (UI)

El objetivo es mantener el 100% del diseño.

### 3.1. Atomización de Componentes
Actualmente, `components/UI.tsx` es un archivo gigante. En producción, sepáralo:

*   Crear `components/ui/button.tsx` -> Pegar código de `Button`.
*   Crear `components/ui/card.tsx` -> Pegar código de `Card`, `CardHeader`, etc.
*   Crear `components/ui/input.tsx` -> Pegar código de `Input`.
*   Crear `components/ui/sheet.tsx` -> Pegar código de `Sheet`.
*   Crear `components/ui/dialog.tsx` -> Pegar código de `Dialog`.
*   Crear `lib/utils.ts` -> Mantener la función `cn`.

### 3.2. Layouts
Mueve `app/components/AppLayout.tsx` a `components/layout/SidebarLayout.tsx`.
*   **Importante:** En Next.js, el layout principal (`app/layout.tsx`) debe contener el `<body>` y la fuente `Inter`.
*   El `SidebarLayout` debe envolver solo las páginas del dashboard, no el login.

**Estructura de Carpetas Resultante:**
```
app/
├── (auth)/                 # Grupo de rutas (sin sidebar)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── onboarding/page.tsx
├── (dashboard)/            # Grupo de rutas (con SidebarLayout)
│   ├── layout.tsx          # Aquí importas SidebarLayout
│   ├── page.tsx            # Dashboard Home
│   ├── clients/page.tsx
│   ├── campaigns/page.tsx
│   └── settings/page.tsx
├── layout.tsx              # Root Layout (Providers: Sonner, Auth)
└── globals.css
```

---

## 4. Fase 3: Base de Datos (Supabase Mapping)

Esta es la parte crítica para la consistencia de datos. Debes crear tablas en Supabase que coincidan **exactamente** con las interfaces de `types.ts`.

### 4.1. Tabla `organizations` (Tenant)
*   `id`: uuid (PK)
*   `name`: text
*   `rif`: text
*   `chatwoot_config`: jsonb (URL, token, account_id)

### 4.2. Tabla `clients` (Espejo del Excel)
Esta tabla es vital para la importación/exportación.
```sql
create table clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id),
  afipos bigint unique,        -- Columna A
  numpos int,                  -- Columna B (Calculado o importado)
  codigo_afiliado text,        -- Columna C
  nombre_afiliado text,        -- Columna D
  rif_afiliado text,           -- Columna E
  telefono_afiliado text,      -- Columna F
  persona_contacto text,       -- Columna G
  direccion_afiliado text,     -- Columna H
  nombre_banco text,           -- Columna I
  region text,                 -- Columna J
  estado text,                 -- Columna K
  ciudad text,                 -- Columna L
  sector text,                 -- Columna M
  categoria_comercio text,     -- Columna N
  rango_tx text,               -- Columna T (CRÍTICO: Valores "SIN TX...", etc)
  gestion_estado text,         -- Columna W (CRÍTICO: "POR GESTIONAR", etc)
  email text,                  -- Campo CRM adicional
  created_at timestamptz default now()
);
```

### 4.3. Tabla `terminals`
*   `serial`: text (PK o Unique)
*   `client_id`: uuid references clients(id)
*   `modelo`: text
*   `marca`: text
*   `operadora`: text
*   `estado_pos`: text

---

## 5. Fase 4: Autenticación (Better-Auth)

Implementarás Better-Auth conectado a Supabase.

1.  **Setup:** Configura el cliente en `lib/auth.ts`.
2.  **Schema:** Better-Auth necesita sus propias tablas (`user`, `session`, `account`, `verification`). Deja que Better-Auth genere la migración en Supabase.
3.  **Login Page (`app/auth/login/page.tsx`):**
    *   Reemplaza el `setTimeout` simulado.
    *   Usa `authClient.signIn.email({ email, password })`.
    *   Maneja errores reales (credenciales inválidas) usando **Sonner**.

---

## 6. Fase 5: Integración de Funcionalidades

### 6.1. Notificaciones (Sonner)
En el prototipo usamos un mock. En producción:
1.  En `app/layout.tsx`, agrega `<Toaster position="top-right" />` (importado de `sonner`).
2.  En toda la app, reemplaza `const { toast } = useToast()` por:
    ```typescript
    import { toast } from 'sonner';
    // Uso:
    toast.success('Cliente actualizado');
    toast.error('Error de conexión');
    ```

### 6.2. Importación Masiva (Excel/CSV)
En `app/dashboard/import/page.tsx`:
1.  Usa una librería como `papaparse` o `xlsx` en el cliente para leer el archivo.
2.  **Validación:** Asegura que las columnas del CSV coincidan con las del modelo de base de datos.
3.  **Server Action:** Envía el array de datos a una Server Action `importClients(data)`.
4.  **Batch Insert:** Usa `db.insert(clients).values(data)` para insertar masivamente en Supabase.

### 6.3. Edición en Tiempo Real (Perfil 360)
En `app/dashboard/clients/page.tsx`:
1.  Convierte el componente Drawer en un **Client Component**.
2.  Crea una **Server Action** `updateClient(id, data)`.
3.  Al dar click en "Guardar Cambios":
    *   Llama a `await updateClient(...)`.
    *   Si es exitoso -> `toast.success(...)`.
    *   Usa `router.refresh()` para actualizar la tabla de fondo sin recargar la página.

### 6.4. Campañas y Deep Linking
*   Mantén la lógica de `campaigns-new`. En Next.js real, esto puede manejarse vía **Query Params**:
    *   Ruta: `/dashboard/campaigns?action=new`
    *   En `CampaignsPage`, lee el searchParam `action`. Si es `new`, abre el modal `useState(true)`.

---

## 7. Lista de Verificación Final (Pre-Deploy)

*   [ ] **Environment Variables:** Configura `.env.local` con `DATABASE_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`.
*   [ ] **Build:** Ejecuta `pnpm build` y asegura que no haya errores de tipos (TypeScript estricto).
*   [ ] **Images:** Reemplaza las imágenes de `ui-avatars.com` por almacenamiento real (Supabase Storage) para los logos de empresas y avatares de usuarios.
*   [ ] **Seguridad:** Configura **Row Level Security (RLS)** en Supabase para que un Tenant no pueda ver los clientes de otro Tenant (usando `organization_id`).

Esta guía garantiza que VenePOS pase de ser un prototipo visualmente impactante a un producto SaaS operativo de clase mundial.