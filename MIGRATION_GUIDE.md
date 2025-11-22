# Guía de Migración a Producción: VenePOS (Next.js 15)

Esta guía detalla los pasos exactos para transformar el prototipo actual (React SPA simulada) en una aplicación **Next.js 15** de producción, manteniendo el 100% del diseño visual y la funcionalidad operativa.

El objetivo es obtener un **Frontend Template Funcional** donde la navegación, los estados de carga y la interacción con datos simulados funcionen nativamente bajo la arquitectura de Next.js.

---

## 1. Stack Tecnológico Objetivo

*   **Framework:** Next.js 15 (App Router).
*   **Lenguaje:** TypeScript.
*   **Estilos:** Tailwind CSS v4 (PostCSS).
*   **Componentes:** Shadcn/ui (Estructura base) + Lucide React.
*   **Notificaciones:** `sonner` (Reemplazando el Toast custom).
*   **Gráficos:** Recharts.
*   **Manejo de Formularios:** React Hook Form (Recomendado para el Wizard).
*   **Estado de URL:** `nuqs` (Type-safe search params) para filtros y modales profundos.

---

## 2. Inicialización del Proyecto

Ejecuta el siguiente comando en tu terminal:

```bash
npx create-next-app@latest venepos-frontend
```

**Configuración del Wizard:**
*   Would you like to use TypeScript? **Yes**
*   Would you like to use ESLint? **Yes**
*   Would you like to use Tailwind CSS? **Yes**
*   Would you like to use `src/` directory? **No** (Para mantener la estructura plana actual, o Yes si prefieres estándar).
*   Would you like to use App Router? **Yes**
*   Would you like to customize the default import alias (@/*)? **Yes**

### Instalación de Dependencias Adicionales

```bash
npm install lucide-react recharts sonner clsx tailwind-merge class-variance-authority
```

---

## 3. Migración de Estilos y Activos

### 3.1. Configuración de Tailwind
El prototipo usa CDN. En producción, usa el sistema de compilación.

1.  Copia las fuentes de `index.html` a `app/layout.tsx` (usando `next/font/google`).
2.  Mueve las variables CSS de `index.html` (`:root`, `.dark`) a `app/globals.css`.

**app/globals.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... Copiar todas las variables del index.html actual ... */
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
  }
}
```

### 3.2. Utilidades
Copia el archivo `lib/utils.ts` exacto a tu nuevo proyecto.

---

## 4. Arquitectura de Componentes (Refactorización)

El archivo `components/UI.tsx` actual contiene toda la librería. Para producción, debemos **atomizar**.

Crea la carpeta `components/ui/` y separa cada componente:
*   `components/ui/button.tsx`
*   `components/ui/card.tsx`
*   `components/ui/input.tsx`
*   `components/ui/sheet.tsx` (Drawer)
*   `components/ui/dialog.tsx` (Modal)
*   etc.

**Nota sobre Iconos:**
Asegúrate de instalar `lucide-react` y reemplazar las importaciones.

**Nota sobre Notificaciones:**
En lugar de usar el `ToastProvider` custom de `UI.tsx`, implementa `sonner`.
1.  En `app/layout.tsx`, agrega `<Toaster />` de `sonner`.
2.  Reemplaza `useToast()` en las páginas por `toast()` de `sonner`.

---

## 5. Migración de Datos (Mock Data)

Mueve el archivo `mockData.ts` a `lib/data.ts`.

**Estrategia de "Backend Simulado":**
Para que el frontend se sienta real, crea funciones asíncronas que simulen latencia de red.

```typescript
// lib/api.ts
import { clientsData } from './data';
import { Client } from '@/types';

export async function getClients(): Promise<Client[]> {
  // Simula 600ms de latencia de red
  await new Promise(resolve => setTimeout(resolve, 600));
  return clientsData;
}
```
Usa estas funciones en tus Server Components (`page.tsx`) o con `useEffect` en Client Components.

---

## 6. Estructura de Rutas (App Router)

Aquí es donde ocurre la magia para eliminar el `App.tsx` gigante. Next.js usa el sistema de archivos.

### 6.1. Layouts (Grupos de Rutas)

Crea dos grupos de rutas para separar layouts:

1.  **`(auth)`**: Para Login/Register (Sin Sidebar).
2.  **`(dashboard)`**: Para la app principal (Con Sidebar).

Estructura de carpetas:
```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── onboarding/page.tsx
├── (dashboard)/
│   ├── layout.tsx          <-- Aquí va el AppLayout.tsx adaptado
│   ├── page.tsx            <-- Dashboard Home
│   ├── clients/page.tsx
│   ├── campaigns/page.tsx
│   ├── settings/page.tsx
│   └── ...
└── layout.tsx              <-- Root Layout (HTML, Body, Fonts, Toaster)
```

### 6.2. Adaptando AppLayout a Next.js

El archivo `app/components/AppLayout.tsx` actual usa `onNavigate` y `currentRoute`. Esto debe cambiar a navegación nativa.

**Transformación:**
1.  Mueve `app/components/AppLayout.tsx` a `app/(dashboard)/layout.tsx`.
2.  Reemplaza `currentRoute` con el hook `usePathname()` de `next/navigation`.
3.  Reemplaza `onNavigate('clients')` con `<Link href="/clients">` de `next/link`.

```tsx
// app/(dashboard)/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Lógica para saber si está activo
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  // ... El resto del diseño del Sidebar se mantiene igual ...
  // ... Reemplazar <div> onClick por <Link href> ...
}
```

### 6.3. Deep Linking (Wizard de Campañas)

En el prototipo, usamos `campaigns-new` como una ruta virtual. En Next.js, usaremos **Search Params**.

1.  El botón "Nueva Campaña" en el Dashboard debe ser un Link:
    `<Link href="/campaigns?new=true">Nueva Campaña</Link>`
2.  En `app/campaigns/page.tsx`, lee el parámetro:

```tsx
// app/campaigns/page.tsx
'use client';
import { useSearchParams } from 'next/navigation';

export default function CampaignsPage() {
  const searchParams = useSearchParams();
  const initialWizardOpen = searchParams.get('new') === 'true';
  
  const [isWizardOpen, setIsWizardOpen] = useState(initialWizardOpen);
  // ... resto del código
}
```

---

## 7. Migración de Páginas (Paso a Paso)

Copia el contenido de cada página del prototipo a su archivo correspondiente en Next.js, ajustando las importaciones.

### Dashboard (`app/page.tsx`)
*   Convierte el componente en `async` si quieres hacer data fetching del lado del servidor (Recomendado).
*   O mantenlo `'use client'` y usa el `useEffect` con `setTimeout` que ya tienes para simular la carga inicial con Skeletons.

### Clientes (`app/clients/page.tsx`)
*   **Crucial:** La funcionalidad de exportación CSV funciona nativamente en el navegador, así que el código se mantiene igual (Client Component).
*   El **Modo Edición** y el **Drawer 360** funcionan perfectamente con `useState` local.

### Settings & Integrations
*   Mantén los formularios y estados locales.
*   Para la integración con Chatwoot real en el futuro, estos formularios enviarán POST requests a API Routes de Next.js (`app/api/settings/route.ts`).

---

## 8. Integración Chatwoot (Embed)

La página `chatwoot-sidebar` debe vivir fuera del layout del dashboard.
*   Crea `app/integrations/chatwoot/page.tsx`.
*   Asegúrate de que esta ruta NO esté dentro del grupo `(dashboard)`. Puedes ponerla en la raíz o en un grupo `(standalone)`.

---

## 9. Checklist Final de Entrega

1.  [ ] **Routing:** Navegación fluida entre Sidebar y páginas usando `Link`.
2.  [ ] **Assets:** Fuentes Inter cargando correctamente. Iconos Lucide visibles.
3.  [ ] **Estilos:** Tailwind procesando clases correctamente (incluyendo `animate-in`).
4.  [ ] **Feedback:** Las notificaciones usan `sonner` y se ven apiladas y bonitas.
5.  [ ] **Mock Data:** Todas las tablas muestran los datos de `lib/data.ts`.
6.  [ ] **Wizard:** Entrar a `/campaigns?new=true` abre el modal automáticamente.
7.  [ ] **Export:** El botón de Excel descarga el CSV correctamente.

Esta estructura garantiza que tienes un **Frontend Profesional** listo para conectar con Supabase y Backend real, sin haber sacrificado ni un ápice de la calidad visual lograda en el prototipo.
