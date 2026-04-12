## 1. Diseño de Arquitectura

```mermaid
graph TD
    A[Usuario] --> B[Popup UI - React]
    A --> C[Botón Flotante - Inyectado]
    A --> D[Context Menu - Chrome API]

    B --> E[Background Service Worker]
    C --> F[Content Script]
    D --> E

    E --> F
    F --> G[faker.js - Generación de Datos]
    F --> H[DOM de la Página Web]

    E --> I[Chrome Storage API]
    B --> I

    subgraph "Extensión Chrome"
        subgraph "Capa de UI"
            B
            C
        end

        subgraph "Capa de Lógica"
            E
            F
            G
        end

        subgraph "Capa de Datos"
            I
        end
    end

    subgraph "Página Web Externa"
        H
    end
```

## 2. Descripción de Tecnologías

- **Frontend (Popup & Options)**: React\@18 + TypeScript + TailwindCSS\@3 + Vite

- **Runtime**: Chrome Extension Manifest V3

- **Generación de Datos**: @faker-js/faker\@9 (bundled)

- **Backend**: No requerido — toda la lógica se ejecuta en el navegador

- **Almacenamiento**: Chrome Storage API (sync + local)

## 3. Definición de Rutas (Popup / Options)

| Ruta             | Propósito                                                                        |
| ---------------- | -------------------------------------------------------------------------------- |
| `/` (popup.html) | Popup principal: botón autocompletado, detección de campos, configuración rápida |
| `/options.html`  | Página de opciones avanzadas: locale, heurísticas, campos ignorados              |

## 4. Estructura de Archivos

```
auto-form/
├── manifest.json              # Manifest V3
├── public/
│   ├── icons/                 # Iconos de la extensión (16, 48, 128)
│   ├── popup.html             # Entry point del popup
│   └── options.html           # Entry point de opciones
├── src/
│   ├── background/
│   │   └── service-worker.ts  # Service worker: context menu, mensajería
│   ├── content/
│   │   ├── detector.ts        # Detección de campos y heurísticas
│   │   ├── filler.ts          # Llenado de campos con faker
│   │   ├── floating-button.ts # Inyección del botón flotante
│   │   └── index.ts           # Entry point del content script
│   ├── popup/
│   │   ├── App.tsx            # Componente principal del popup
│   │   ├── components/        # Componentes UI del popup
│   │   └── main.tsx           # Entry point React del popup
│   ├── options/
│   │   ├── App.tsx            # Componente principal de opciones
│   │   ├── components/        # Componentes UI de opciones
│   │   └── main.tsx           # Entry point React de opciones
│   ├── shared/
│   │   ├── types.ts           # Tipos TypeScript compartidos
│   │   ├── constants.ts       # Constantes (locales, selectores)
│   │   ├── faker-factory.ts   # Factoría de instancias faker por locale
│   │   ├── heuristics.ts      # Lógica de heurísticas de detección
│   │   ├── validators.ts      # Validadores de formato (email, phone, zip)
│   │   └── storage.ts         # Wrapper de Chrome Storage API
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

## 5. Modelo de Datos (Chrome Storage)

### 5.1 Esquema de Datos

```mermaid
erDiagram
    USER_CONFIG {
        string locale
        boolean strictValidation
        boolean showFloatingButton
        json detectionAttributes
        json ignoredSelectors
    }

    FIELD_MAPPING {
        string pattern
        string fakerMethod
        string category
    }

    USER_CONFIG ||--o{ FIELD_MAPPING : uses
```

### 5.2 Definición de Datos

**Configuración del Usuario** (Chrome Storage - sync)

```typescript
interface UserConfig {
  locale: 'es' | 'en' | 'pt_BR' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh_CN'
  strictValidation: boolean
  showFloatingButton: boolean
  detectionAttributes: {
    name: boolean
    id: boolean
    placeholder: boolean
    label: boolean
    type: boolean
  }
  ignoredSelectors: string[]
}
```

**Mapeo de Campos** (Hardcoded en la extensión)

```typescript
interface FieldMapping {
  pattern: RegExp
  fakerMethod: string
  category: 'personal' | 'contact' | 'address' | 'payment' | 'misc'
}

// Ejemplos de mapeos:
const FIELD_MAPPINGS: FieldMapping[] = [
  { pattern: /(first[_-]?name|nombre)/i, fakerMethod: 'person.firstName', category: 'personal' },
  { pattern: /(last[_-]?name|apellido)/i, fakerMethod: 'person.lastName', category: 'personal' },
  { pattern: /(email|e-mail|correo)/i, fakerMethod: 'internet.email', category: 'contact' },
  { pattern: /(phone|tel|telefono|teléfono)/i, fakerMethod: 'phone.number', category: 'contact' },
  {
    pattern: /(address|direccion|dirección)/i,
    fakerMethod: 'location.streetAddress',
    category: 'address',
  },
  { pattern: /(city|ciudad)/i, fakerMethod: 'location.city', category: 'address' },
  { pattern: /(state|estado|provincia)/i, fakerMethod: 'location.state', category: 'address' },
  { pattern: /(zip|postal|cp)/i, fakerMethod: 'location.zipCode', category: 'address' },
  { pattern: /(country|pais|país)/i, fakerMethod: 'location.country', category: 'address' },
  { pattern: /(company|empresa|compania)/i, fakerMethod: 'company.name', category: 'misc' },
  { pattern: /(user|usuario|username)/i, fakerMethod: 'internet.username', category: 'contact' },
  { pattern: /(password|contraseña|pass)/i, fakerMethod: 'internet.password', category: 'contact' },
]
```

**Datos iniciales por defecto** (Chrome Storage - sync)

```typescript
const DEFAULT_CONFIG: UserConfig = {
  locale: 'es',
  strictValidation: true,
  showFloatingButton: true,
  detectionAttributes: {
    name: true,
    id: true,
    placeholder: true,
    label: true,
    type: true,
  },
  ignoredSelectors: [],
}
```

### 5.3 Permisos del Manifest V3

```json
{
  "manifest_version": 3,
  "permissions": ["activeTab", "storage", "contextMenus", "scripting"],
  "host_permissions": ["<all_urls>"],
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "css": ["content-styles.css"],
      "run_at": "document_idle"
    }
  ]
}
```

### 5.4 Flujo de Mensajería entre Componentes

```mermaid
sequenceDiagram
    participant P as Popup
    participant B as Background SW
    participant C as Content Script
    participant F as faker.js

    Note over C: Detecta campos al cargar la página
    C->>B: {type: 'FIELDS_DETECTED', count: N}
    B->>P: Forward a popup si está abierto

    P->>B: {type: 'AUTOFILL_REQUEST'}
    B->>C: {type: 'AUTOFILL_REQUEST'}
    C->>C: Ejecuta heurísticas sobre campos detectados
    C->>F: Genera datos según locale y tipo de campo
    F-->>C: Datos sintéticos
    C->>C: Rellena campos en el DOM
    C->>C: Valida formato si strictValidation = true
    C->>B: {type: 'AUTOFILL_RESULT', success: true, filled: N, errors: []}
    B->>P: Forward del resultado
    P->>P: Muestra feedback visual
```

### 5.5 Algoritmo de Heurística de Detección

```typescript
// Orden de prioridad para identificar tipo de campo:
// 1. Atributo `type` (email, tel, number, url, etc.)
// 2. Atributo `name` (coincidencia con patrones regex)
// 3. Atributo `id` (coincidencia con patrones regex)
// 4. Atributo `placeholder` (coincidencia con patrones regex)
// 5. Texto del `<label>` asociado (atributo for, o label padre)
// 6. Atributo `autocomplete` si existe
// 7. Fallback: texto genérico según tipo de input

// Para elementos <select>:
// - Se selecciona una opción aleatoria válida (no disabled)
// - Se priorizan opciones no-placeholder (ej: "Seleccione..." se ignora)
```

### 5.6 Manejo de Errores

```typescript
// Estrategias de error handling:
// 1. Campos dinámicos (SPA): MutationObserver detecta nuevos campos inyectados
// 2. Campos deshabilitados/readonly: Se detectan y se omiten del autocompletado
// 3. Campos con validación compleja: Se generan datos que cumplen el patrón
//    del atributo `pattern` si existe
// 4. iframes same-origin: Se escanean y rellenan campos dentro de iframes
// 5. Campos con eventos custom: Se dispatchean eventos input/change/blur
//    para compatibilidad con React, Vue, Angular y vanilla JS
```
