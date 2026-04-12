# Auto-Form - Reglas del Proyecto

## Stack Tecnológico

- Chrome Extension (Manifest V3)
- React 18 + TypeScript
- Tailwind CSS 3 con diseño personalizado estilo "retoUI" (bordes negros gruesos, sombras neobrutalistas)
- Vite como bundler
- Radix UI como primitives
- class-variance-authority (CVA) para variantes de componentes
- Faker.js para datos sintéticos

## Comandos

- `pnpm build` → Compilar (tsc check + build)
- `pnpm check` → Solo check de tipos TypeScript
- `pnpm lint` → ESLint (max-warnings 0)
- `pnpm lint:fix` → ESLint con auto-fix
- `pnpm format` → Prettier format
- `pnpm format:check` → Prettier check
- `pnpm generate-icons` → Generar íconos SVG→PNG

## Convenciones de Código

- Sin comentarios en el código a menos que se soliciten explícitamente
- Comillas simples (`singleQuote: true`)
- Sin punto y coma al final de imports/exports donde Prettier lo permita
- `printWidth: 100`, `tabWidth: 2`
- `arrowParens: avoid`
- `endOfLine: lf`
- Imports con alias `@/` para `src/`, `@shared/` para `src/shared/`
- Props con prefijo `I` para interfaces de componentes (ej: `IButtonProps`)
- Componentes React funcionales con `React.forwardRef`
- Usar `cn()` de `@/lib/utils` para merge de clases Tailwind

## Estilo Visual (retoUI)

- Bordes negros de 2px (`border-2 border-black`)
- Sombras tipo neobrutalistas (`shadow-md`)
- Hover con translate (`hover:translate-y-1`) y active con translate más pronunciado (`active:translate-y-2 active:translate-x-1`)
- Colores primarios basados en HSL con CSS variables
- Tipografía sans-serif estándar del sistema

## Arquitectura

- `src/popup/` → UI del popup de la extensión (360px ancho)
- `src/options/` → Página de configuración avanzada
- `src/content/` → Content script (detector, filler, floating button)
- `src/background/` → Service worker (context menus, messaging)
- `src/shared/` → Código compartido (types, constants, heuristics, storage, validators, faker-factory)
- `src/components/retroui/` → Componentes UI reutilizables estilo retoUI

## Precauciones

- NO exponer secrets ni API keys en el código
- NO hacer commits sin que el usuario lo pida explícitamente
- Siempre ejecutar `pnpm check` y `pnpm lint` antes de considerar una tarea completa
- Respetar el color primario #4285F4 (blue) de la marca
- Mantener compatibilidad con Chrome 120+

## Changelog

- Archivo obligatorio: `CHANGELOG.md` en la raíz del proyecto
- Formato basado en [Keep a Changelog](https://keepachangelog.com)
- Secciones por versión: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`
- Cada versión nueva se añade al inicio del archivo (orden cronológico descendente)
- Ejemplo de estructura:

```markdown
## [0.1.0] - 2025-01-15

### Added
- Detección inteligente de campos por heurísticas
- Soporte para 9 idiomas con faker.js

### Fixed
- Error de detección en formularios dinámicos

### Known Issues
- No detecta campos dentro de iframes
```

- Actualizar el changelog como parte del proceso de cada release
- Enlazar cada versión con el tag de git correspondiente

## Versionado (Semantic Versioning)

- Formato: `vMAJOR.MINOR.PATCH` (ej: `v1.2.3`)
- `MAJOR`: Cambios que rompen compatibilidad (breaking changes)
- `MINOR`: Nuevas funcionalidades sin romper compatibilidad
- `PATCH`: Correcciones de bugs
- Etapas pre-release en orden de precedencia:
  - `v1.0.0-alpha.N` → Desarrollo interno, funcionalidades incompletas
  - `v1.0.0-beta.N` → Funcionalidades completas, testing externo limitado
  - `v1.0.0-rc.N` → Candidato a release, solo se corrigen bugs críticos
  - `v1.0.0` → Versión estable para producción
- Usar `0.x.x` mientras la API no sea estable
- Sincronizar la versión en `package.json` con el tag de git
- Usar `git tag -a vX.Y.Z -m "mensaje"` para crear tags
- Documentar cambios con formato Keep a Changelog (Added, Fixed, Changed, Known Issues)

## GitHub y Publicación

- README.md obligatorio en la raíz con: descripción, badges, características, instalación, comandos, estructura y licencia
- .gitignore debe excluir: `node_modules/`, `dist/`, secrets y archivos de configuración local
- Usar Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`
- Crear Releases en GitHub adjuntando `.zip` de `dist/` para descarga directa
- Configurar GitHub Actions para ejecutar `pnpm check` y `pnpm lint` en cada Pull Request
- En GitHub Pages: la landing page (`index.html`) se sirve desde la rama principal
- Los archivos estáticos externos van en `public/assets/` (ej: `i18n.js`)

## Internacionalización (i18n)

- La landing page (`index.html`) soporta multi-idioma vía JavaScript con `data-i18n`
- Traducciones centralizadas en `public/assets/i18n.js`
- 9 idiomas soportados: es, en, pt_BR, fr, de, it, ja, ko, zh_CN
- Usar `<span data-i18n="clave">texto</span>` para textos que coexisten con iconos SVG
- El selector de idioma persiste la preferencia en `localStorage`
- El mockup de la landing page también traduce sus valores de ejemplo
- Al añadir un nuevo texto traducible, actualizar todos los idiomas en `i18n.js`

## Landing Page

- Archivo principal: `index.html` en la raíz (estática, sin framework)
- Estilo visual coherente con la extensión (neobrutalista/retoUI)
- Compatible con GitHub Pages (solo HTML/CSS/JS del lado del cliente)
- No depende de Node.js ni de procesos del servidor
- Los scripts JS se incluyen con `<script src="public/assets/...">`
- Bordes negros de 3px en la landing page (vs 2px en la extensión)
