# Beacon UI

**[🇬🇧 Read in English](./README.md)**

Un design system de **Web Components construidos con Lit 3**, independientes de cualquier framework, y la consola de estado de servicios que lo usa: uptime, latencia, incidentes y un formulario para reportarlos.

![Vista general de Beacon en tema claro](./docs/overview-light.jpg)

> **Estado: `0.1.0`, solo front end.** Los datos vienen de una API simulada en `src/app/data` que imita la latencia de red y la cancelación de peticiones, así que las vistas ya manejan carga, errores y abortos. Para conectar un backend basta con reemplazar ese módulo por llamadas `fetch` reales.

## Por qué Web Components

Los componentes son custom elements que define el navegador, no un framework. El mismo `<bc-button>` o `<bc-text-field>` funciona en HTML plano, React 19, Angular, Vue o una página renderizada en servidor, que es justo lo que necesita un design system compartido entre varios equipos. Lit agrega propiedades reactivas y plantillas eficientes sobre el estándar, con unos 5 kB.

## Stack

| Área             | Elección                                                                                  |
| ---------------- | ----------------------------------------------------------------------------------------- |
| Componentes      | Lit 3.3 (`static properties`, sin decoradores)                                            |
| Estado           | `@lit/context` para inyección de dependencias y un store observable sin framework         |
| Datos asíncronos | `@lit/task` (carga, error y aborto por vista)                                             |
| Lenguaje         | TypeScript 6 `strict`, con `exactOptionalPropertyTypes` y `noUncheckedIndexedAccess`      |
| Estilos          | SCSS (tokens, mixins y una hoja por componente) compilado dentro de cada shadow root      |
| Build            | Vite 8                                                                                    |
| Tests            | Vitest 5 en modo navegador sobre Chromium real (Playwright) y axe-core                    |
| Lint             | ESLint (typescript-eslint strict, lit, wc, lit-a11y), Stylelint (SCSS estándar), Prettier |
| Documentación    | Custom Elements Manifest (`custom-elements.json`)                                         |
| CI/CD            | GitHub Actions con despliegue a GitHub Pages                                              |

## Cómo empezar

Requisitos: Node.js 22 o superior y [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm exec playwright install chromium   # una vez, para los tests en navegador
pnpm dev
```

Abre <http://localhost:5173>. No hace falta ninguna variable de entorno.

## Scripts

| Script                         | Qué hace                                         |
| ------------------------------ | ------------------------------------------------ |
| `pnpm dev`                     | Servidor de desarrollo                           |
| `pnpm build`                   | Type-check y build de producción                 |
| `pnpm preview`                 | Sirve el build de producción                     |
| `pnpm lint`                    | ESLint y Stylelint                               |
| `pnpm typecheck`               | `tsc --noEmit`                                   |
| `pnpm format` / `format:check` | Prettier                                         |
| `pnpm test`                    | Todos los tests, en Chromium headless            |
| `pnpm test:coverage`           | Igual, con cobertura y umbrales (90 % de líneas) |
| `pnpm analyze`                 | Genera `custom-elements.json`                    |

## Qué hay en la app

| Ruta             | Página                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `#/`             | Vista general: el estado en una frase, el uptime de 90 días de cada servicio, una lista filtrable y la línea de tiempo de incidentes |
| `#/services/:id` | Detalle del servicio: cifras de uptime y latencia, pestañas de latencia, uptime e incidentes                                         |
| `#/report`       | Formulario para reportar un incidente (acepta `?service=`)                                                                           |
| `#/components`   | Guía de estilo viva con todos los componentes                                                                                        |

Un incidente reportado cambia al instante el estado de su servicio, se guarda en `sessionStorage` y se puede resolver desde la página del servicio tras un diálogo de confirmación.

![Detalle de un servicio en tema oscuro](./docs/service-dark.jpg)

## Design system

Quince elementos con prefijo `bc-`. Lo más destacable:

- **`bc-text-field`, `bc-select`, `bc-switch`** son _form-associated custom elements_ (`ElementInternals`): aparecen en `FormData`, bloquean el envío cuando son inválidos, se reinician con el formulario y respetan `<fieldset disabled>`. El formulario de la app es un `<form>` nativo, sin librería de formularios.
- **`bc-button`** también es form-associated: `type="submit"` funciona aunque el `<button>` esté dentro de un shadow root.
- **`bc-tabs`** sigue el patrón WAI-ARIA: roving tabindex, flechas, Home y End.
- **`bc-dialog`** usa `<dialog>` nativo, así que el foco atrapado, Escape y la capa superior los da el navegador.
- **`bc-sparkline` y `bc-uptime-bar`** son gráficas SVG con un resumen en texto para lectores de pantalla.

**Tokens.** `src/design-system/styles` define la paleta, la escala tipográfica, el espaciado y dos temas como mapas SCSS, y los emite como custom properties en `:root`. Las custom properties se heredan a través del Shadow DOM, así que cada componente lee el tema actual sin importar nada y cambiar de tema no requiere recompilar.

**Estilos por componente.** Cada componente tiene su `.scss`, que usa los mixins compartidos (`host-base`, `focus-ring`, `touch-target`, `tone-variants`, `type()`…). Vite lo compila en build y el componente lo adopta con `unsafeCSS`; es seguro porque la entrada es un archivo estático del repo, nunca contenido del usuario. Las funciones deprecadas de Sass rompen el build.

## Estructura

```text
src/
  design-system/          Independiente del framework, publicable por separado
    styles/               Paleta, fundamentos, temas, mixins, tokens.scss
    shared/               defineElement, clase base FormControl, helpers de campos
    components/<Nombre>/  Una carpeta por componente
  app/                    La consola construida con el design system
    data/  core/  parts/  shell/  views/  styles/  test/
```

Cada componente: `X.ts` (clase y registro), `X.types.ts`, `X.constants.ts`, `X.utils.ts`, `X.scss`, `X.test.ts` e `index.ts`. Las decisiones técnicas están explicadas en [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Convenciones

- Código, comentarios, documentación y commits en inglés.
- Constantes y tipos nunca en el archivo del elemento.
- Todo lleva JSDoc: clases, funciones, métodos, cada propiedad (con `@default`), cada tipo, campo de interfaz y constante.
- Una línea en blanco entre los miembros de una clase y antes de cada `return` que sigue a otras instrucciones.
- Métricas por función obligatorias: complejidad 10, complejidad cognitiva 10, 50 líneas, 3 parámetros y 3 niveles de anidación.
- Nada deprecado: `@typescript-eslint/no-deprecated` es error, igual que las funciones deprecadas de Sass.
- Sin decoradores: propiedades con `static properties` y campos `declare`, JavaScript estándar sin transformaciones.
- La accesibilidad es parte del componente: roles, teclado, foco visible y áreas táctiles de 44 px.
- Commits convencionales, uno por componente o funcionalidad.

## Documentación y métricas de código

**JSDoc en todo.** ESLint (`eslint-plugin-jsdoc`) rompe el build si una clase, función, método, propiedad, tipo, campo de interfaz o constante no tiene su bloque JSDoc, si falta documentar un parámetro, el valor de retorno o un error lanzado, o si el bloque no tiene descripción. Las propiedades de los componentes siguen un solo formato:

```ts
/**
 * Most characters accepted. Also shows a character counter.
 *
 * @default undefined
 */
declare
maxlength: number | undefined
```

Las clases de componentes llevan además `@tag`, `@slot`, `@fires`, `@csspart`, `@cssprop` y un `@example`. El analizador de Custom Elements Manifest lee esos comentarios, así que `custom-elements.json` lista cada atributo, propiedad (con descripción, valor por defecto y la clase base de la que viene), evento, slot y CSS part, y editores como VS Code lo muestran como autocompletado en HTML.

**Métricas de código.** Los límites viven en un solo archivo, [`metrics.config.js`](./metrics.config.js), y los leen dos herramientas:

| Métrica                             |            Límite | Lo valida                                       |
| ----------------------------------- | ----------------: | ----------------------------------------------- |
| Complejidad ciclomática por función |                10 | ESLint `complexity`, `pnpm metrics`             |
| Complejidad cognitiva por función   |                10 | ESLint `sonarjs/cognitive-complexity`           |
| Líneas de código por función        | 50 (200 en tests) | ESLint `max-lines-per-function`, `pnpm metrics` |
| Parámetros por función              |                 3 | ESLint `max-params`, `pnpm metrics`             |
| Niveles de anidación                |                 3 | ESLint `max-depth`, `pnpm metrics`              |
| Instrucciones por función           |  15 (25 en tests) | ESLint `max-statements`                         |
| Callbacks dentro de callbacks       |    3 (4 en tests) | ESLint `max-nested-callbacks`                   |
| Líneas de código por archivo        |               300 | ESLint `max-lines`                              |

`pnpm metrics` mide cada función con el compilador de TypeScript, imprime los totales y las funciones más complejas, y termina con error si alguna pasa un límite. Su conteo de complejidad coincide con el de ESLint en todas las funciones del proyecto. Los números actuales están en [`docs/CODE-METRICS.md`](./docs/CODE-METRICS.md). Las dos validaciones corren en CI.

## Tests y calidad

Los tests corren en **Chromium real** con el modo navegador de Vitest, no en jsdom: Shadow DOM, `ElementInternals`, `<dialog>`, foco y teclado se comportan como los vive el usuario.

- Tests unitarios de cada función pura, tests de cada componente, tests del flujo completo de la app (reportar un incidente de punta a punta incluido) y **axe-core en todas las páginas y en ambos temas contra WCAG 2.2 AA, con cero violaciones**.
- 182 tests, alrededor del 92 % de las sentencias cubiertas y umbrales exigidos en CI.

## Despliegue

`pnpm build` genera un sitio estático en `dist/`. El enrutamiento usa el hash de la URL, así que no necesita reescrituras en el servidor. En cada push a `main`, CI hace lint, type-check, tests en navegador, build con `BASE_PATH=/beacon-ui/` y despliega a GitHub Pages (actívalo en **Settings → Pages → Source: GitHub Actions**).

## Autor

**Jhon David Toro Muriel** · [GitHub](https://github.com/Jhon-David-Toro) · [portfolio.doxel.dev](https://portfolio.doxel.dev)
