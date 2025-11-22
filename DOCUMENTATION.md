# VenePOS - Documentación Técnica

**Versión:** 2.0.0  
**Última Actualización:** 21 Noviembre 2025  
**Estatus:** Producción (MVP Operativo)

---

## 1. Visión General del Proyecto

**VenePOS** es una plataforma SaaS B2B diseñada para la gestión masiva de terminales puntos de venta (POS) Credicard, recuperación de cartera inactiva y orquestación de comunicaciones.

La arquitectura está construida bajo el principio de **"Native Web App"**, priorizando transiciones instantáneas, estados de carga no bloqueantes (Skeletons) y una estética financiera de alta densidad de información.

### Stack Tecnológico

| Capa | Tecnología | Decisión Técnica |
| :--- | :--- | :--- |
| **Core** | React 19 (RC) | Utilizado vía CDN (`aistudiocdn`) para prototipado rápido sin bundlers complejos. |
| **Estilos** | Tailwind CSS v4 | Configurado en `index.html`. Uso extensivo de variables CSS para Modo Oscuro. |
| **Router** | Custom Client Router | Enrutador ligero basado en estado (`useState`) en `App.tsx` para simular SPA sin recargas. |
| **Iconos** | Lucide React | Stroke width: 1.5px. Consistencia visual estricta. |
| **Gráficos** | Recharts | Visualización de datos financieros y métricas de campañas. |
| **Estado** | React Context + Local | Gestión de estado local optimizada. |

---

## 2. Arquitectura del Proyecto

El sistema simula la estructura de **Next.js 15 App Router** para facilitar una futura migración a SSR si fuera necesario.

> **🚀 MIGRACIÓN A PRODUCCIÓN:**  
> Para llevar este sistema a un entorno Next.js real, consulta la guía detallada en [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

```
/
├── app/
│   ├── auth/                       # Módulo de Autenticación
│   │   ├── login/                  # Login Split-screen
│   │   ├── register/               # Registro de Tenant (Paso 1: Admin, Paso 2: Empresa)
│   │   └── onboarding/             # Configuración inicial (Chatwoot + Equipo)
│   ├── components/
│   │   └── AppLayout.tsx           # Shell principal (Sidebar Responsivo + Header)
│   ├── dashboard/
│   │   ├── campaigns/              # Gestión de Campañas (Kanban + Wizard + Detalle)
│   │   ├── clients/                # Directorio (Data Grid + Filtros + Sheet 360 con Edición)
│   │   ├── import/                 # Carga de Datos (Drag & Drop)
│   │   ├── profile/                # Perfil de Usuario (Seguridad y Preferencias)
│   │   └── settings/               # Configuración de Tenant (Integraciones, Equipo)
│   ├── integrations/
│   │   └── chatwoot-sidebar/       # Micro-frontend para embeber en Chatwoot (Iframe)
│   ├── layout.tsx                  # Root Layout (Fonts, Global Styles)
│   └── page.tsx                    # Dashboard Ejecutivo (KPIs + Gráficos)
├── components/
│   └── UI.tsx                      # Design System (Atomos: Button, Input, Sheet, Dialog, Popover)
├── lib/
│   └── utils.ts                    # Utilidad 'cn' (Tailwind merge)
├── mockData.ts                     # Base de datos simulada (Estructura Excel Venezuela)
├── types.ts                        # Definiciones TypeScript estrictas
└── App.tsx                         # Entry Point & Router Logic
```

---

## 3. Diccionario de Datos (Data Models)

El modelo de datos ha sido adaptado estrictamente para reflejar el **Archivo Maestro de Operaciones (Excel)** utilizado por Credicard/VenePOS. La consistencia aquí es vital para la importación/exportación.

### 3.1. Cliente (Client)
Representa un comercio afiliado.
*   `afipos` (Number): Identificador único del POS en el sistema bancario (Columna A).
*   `codigoAfiliado` (String): Código interno del comercio (Columna C).
*   `rif` (String): Identificación fiscal venezolana (V-12345678) (Columna E).
*   `personaContacto` (String): Nombre del responsable (Columna G).
*   `telefono` (String): Teléfono principal (Columna F).
*   `direccion` (String): Dirección fiscal completa (Columna H).
*   `banco` (String): Entidad bancaria emisora (ej. "BANCO DE VENEZUELA", "BANPLUS") (Columna I).
*   `region`, `estado`, `ciudad`, `sector`: Datos geográficos para segmentación (Columnas J-M).
*   `categoriaComercio`: Rubro del negocio (ej. "SUPERMERCADOS ABASTOS") (Columna N).
*   `rango` (String): **Métrica Crítica (Columna T)**. Define la inactividad operativa. Valores:
    *   "SIN TX EN EL MES ACTUAL"
    *   "30 DIAS SIN TX"
    *   "60 DIAS SIN TX"
    *   "90 DIAS SIN TX"
    *   "120 DIAS SIN TX"
*   `gestion` (String): **Estado Operativo (Columna W)**. Define la acción requerida por el agente. Valores:
    *   "POR GESTIONAR"
    *   "ILOCALIZABLE"
    *   "CONTACTAR DE NUEVO"
    *   "EQUIPO EN TALLER"
    *   "COMPROMISO DE PAGO"
    *   "RECUPERADO"

### 3.2. Terminal (POS)
Dispositivo físico asociado a un cliente.
*   `serial` (String): Serial único del hardware (Columna Q).
*   `marca`, `modelo`: Identificación del equipo (ej. "PAX A920") (Columnas O-P).
*   `operadora`: Conectividad (MOVILNET, DIGITEL) (Columna R).
*   `estadoPos`: Estado físico (ej. "INSTALADO") (Columna S).

### 3.3. Campaña (Campaign)
*   `status`: Ciclo de vida (`draft` -> `scheduled` -> `sending` -> `completed`).
*   `audience`: Cantidad de clientes objetivo.
*   `stats`: Métricas de conversión (`sent`, `delivered`, `read`, `replied`).

---

## 4. Funcionalidad Detallada por Módulo

### 4.1. Dashboard Ejecutivo (`/dashboard`)
*   **Objetivo:** Visión de "Torre de Control" y eficiencia del embudo.
*   **Deep Linking:** El botón "Nueva Campaña" redirige a la vista de Campañas y abre automáticamente el Wizard.
*   **KPIs:**
    *   *Terminales Recuperados:* Métrica de éxito principal.
    *   *Terminales Inactivos:* Muestra tendencia inversa (Rojo si sube, Verde si baja).
*   **Gráfico de Embudo:** Visualización diaria de mensajes enviados vs. respuestas vs. recuperaciones.

### 4.2. Clientes (`/dashboard/clients`)
*   **Data Grid (Tabla):**
    *   Diseñada para alta densidad de información.
    *   **Filtros Command Menu:** Menús desplegables estilo "Stripe/Linear" con búsqueda integrada y selección múltiple para Bancos, Regiones y Estados de Gestión.
    *   **Exportación CSV Estricta:** El botón "Exportar Excel" genera un CSV que replica **exactamente** las columnas del archivo maestro de importación, permitiendo la re-ingesta de datos en sistemas bancarios sin transformación.
*   **Perfil 360 (Drawer/Sheet):**
    *   **Modo Edición (Nuevo):** Al hacer clic en el icono de lápiz, los campos clave (Teléfono, Persona Contacto, Email) se vuelven editables.
    *   **Gestión de Estado:** Permite cambiar el estatus de `gestion` (ej. de "POR GESTIONAR" a "ILOCALIZABLE") directamente desde el perfil.
    *   **Tabs:** General, Terminales (Lista detallada con seriales y operadoras), Ubicación.

### 4.3. Campañas (`/dashboard/campaigns`)
*   **Kanban Board:**
    *   Grid responsivo (1 col móvil -> 5 cols desktop).
    *   Columnas: Borrador, Programadas, Enviando, Enviadas, Completadas.
*   **Wizard de Creación:**
    *   **Paso 1 (Config):** Selección de canal (WhatsApp/SMS).
    *   **Paso 2 (Audiencia):** Filtros basados en **Rango TX** (ej. "Mayor a 30 días sin TX").
    *   **Paso 3 (Mensaje):** Editor con variables (`{{nombre}}`, `{{banco}}`, `{{dias_inactivo}}`) y preview de smartphone.
*   **Vista Detalle:**
    *   **Agregar Miembros:** Modal para añadir clientes manualmente a una campaña activa. Filtra automáticamente los clientes que ya pertenecen a la campaña para evitar duplicados.
    *   **Analítica:** Gráficos de línea de tiempo de interacción.

### 4.4. Configuración (`/dashboard/settings`)
*   **Integraciones (Chatwoot):**
    *   Configuración de credenciales (URL, Account ID, Token).
    *   **Automatización de Etiquetas (Label Mapping):** Motor de reglas "If This Then That". Permite mapear etiquetas de Chatwoot (ej. `pago-confirmado`) a cambios de estado en VenePOS (ej. `RECUPERADO`).
*   **Equipo:** Gestión de roles (Admin, Agente, Visualizador).

### 4.5. Integración Chatwoot (`/integrations/chatwoot-sidebar`)
*   **Micro-Frontend:** Página optimizada para `iframe` de 300px.
*   **Funcionalidad:** Muestra alertas de terminales inactivos y permite navegación rápida a la app principal.

---

## 5. Sistema de Diseño y UX (Design System)

### 5.1. Componentes UI (`components/UI.tsx`)
*   **Popovers (Command Menu):** Componentes flotantes con `overflow-visible` en contenedores padre para evitar recortes visuales.
*   **Skeletons & Spinners:** Gestión de estados de carga nativos.
*   **Badges Semánticos:** Colores consistentes para estados (Esmeralda=Éxito, Ámbar=Alerta, Rosa=Peligro/Inactivo).

### 5.2. Patrones de "App Nativa"
*   **Navegación:** Uso de `key={currentRoute}` en `AppLayout` para forzar animaciones de entrada (`fade-in zoom-in`) al cambiar de ruta.
*   **Feedback Inmediato:** Los cambios de estado (ej. editar un cliente) se reflejan instantáneamente en la UI (Optimistic UI patterns).

---

## 6. Autenticación y Seguridad

*   **Multi-tenant:** Flujo de registro separado para Usuario Admin y Datos de Organización.
*   **Onboarding:** Asistente de configuración inicial post-registro.
*   **Perfil:** Gestión de seguridad (2FA simulado) y preferencias de tema.

---

## 7. Guía de Desarrollo

### Mantenimiento del Modelo de Datos
Para mantener la compatibilidad con el archivo maestro de Excel:
1.  **No renombrar** las propiedades `afipos`, `rif`, `banco`, `rango`, `gestion` en `types.ts`.
2.  Al agregar nuevas columnas al Excel, deben agregarse a la interfaz `Client` y al array de headers en la función `handleExport` de `ClientsPage.tsx`.

### Despliegue
El proyecto es "Deploy Ready" para Vercel/Netlify como una SPA estática.
*   **Build Command:** `npm run build` (o `pnpm`).
*   **Output Directory:** `.next` o `out` (dependiendo de la configuración de exportación estática).
