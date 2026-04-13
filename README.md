# 🚀 Auto-Form

**Autocompleta formularios web con datos sintéticos realistas en un solo clic.**

Auto-Form es una extensión de Chrome (Manifest V3) diseñada para desarrolladores y testers que necesitan llenar formularios rápidamente durante el desarrollo o control de calidad. Utiliza **Faker.js** para generar datos coherentes y localizados en 9 idiomas.

[![Version](https://img.shields.io/badge/version-0.1.0-blue?style=for-the-badge)](https://github.com/aalfaray/auto-form)
[![Manifest](https://img.shields.io/badge/Manifest-V3-green?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/aalfaray)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/aalfaray)

---

## ✨ Características Principales

- **Detección Inteligente**: Heurísticas avanzadas para identificar campos de nombre, email, teléfono, dirección, contraseñas y más.
- **9 Idiomas Soportados**: Datos localizados para 🇪🇸 Español, 🇺🇸 English, 🇧🇷 Português, 🇫🇷 Français, 🇩🇪 Deutsch, 🇮🇹 Italiano, 🇯🇵 日本語, 🇰🇷 한국어 y 🇨🇳 中文.
- **Diseño Neobrutalista**: UI moderna y limpia inspirada en el estilo "retoUI".
- **Botón Flotante**: Acceso rápido directamente en la página web.
- **Configuración Avanzada**: Ignora selectores específicos y personaliza el comportamiento de detección.

---

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Estilos**: Tailwind CSS + Radix UI (Primitives)
- **Generación de Datos**: Faker.js
- **Bundler**: Vite
- **Iconos**: Lucide React

---

## 🚀 Instalación (Desarrollo)

Para cargar la extensión en tu navegador Chrome:

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/aalfaray/auto-form.git
   cd auto-form
   ```

2. **Instala las dependencias**:

   ```bash
   pnpm install
   ```

3. **Compila el proyecto**:

   ```bash
   pnpm build
   ```

4. **Carga en Chrome**:
   - Abre `chrome://extensions/` en tu navegador.
   - Activa el **Modo de desarrollador** (esquina superior derecha).
   - Haz clic en **Cargar descomprimida**.
   - Selecciona la carpeta `dist/` generada en el paso anterior.

---

## 📖 Comandos Disponibles

- `pnpm build`: Compila la extensión (TS check + Vite build).
- `pnpm dev`: Compila en modo desarrollo.
- `pnpm check`: Solo verificación de tipos con TypeScript.
- `pnpm lint`: Ejecuta ESLint para asegurar la calidad del código.
- `pnpm format`: Formatea el código con Prettier.

---

## 📁 Estructura del Proyecto

- `src/popup/`: Interfaz de usuario del popup de la extensión.
- `src/options/`: Página de configuración avanzada.
- `src/content/`: Scripts que se ejecutan en las páginas web (detector y autocompletado).
- `src/background/`: Service worker para gestión de menús contextuales y mensajes.
- `src/shared/`: Lógica compartida, tipos, constantes y heurísticas.
- `src/components/retroui/`: Componentes UI reutilizables con estilo neobrutalista.

---

## ☕ Apoya el Proyecto

Si Auto-Form te ahorra tiempo en tu día a día, considera apoyar su desarrollo:

[![Ko-fi](https://img.shields.io/badge/Ko--fi-Support%20me-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/aalfaray)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/aalfaray)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

Desarrollado con ❤️ para mejorar la productividad de los desarrolladores.
