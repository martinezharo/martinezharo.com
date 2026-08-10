# olisite — fase de maquetas

Tres direcciones visuales para el sitio personal, solo modo oscuro. En `/` está
el comparador con miniaturas; cada dirección vive en su ruta.

| Ruta | Dirección | Hero | Tarjeta de proyecto |
|---|---|---|---|
| `/a` | **Control Room** — consola de telemetría | Logotipo largo + franja de latencias por PoP | Fila de rack con medidores LED segmentados |
| `/b` | **Monograph** — catálogo editorial nocturno | Titular en serif + retrato como lámina duotono | Ficha de catálogo con tabla de valoraciones |
| `/c` | **Soft Machine** — producto táctil | Icono en una superficie que sigue al cursor | Tarjeta con dial de puntuación y reordenado animado |

## Stack

- **Astro 7** en modo estático durante las maquetas. Al elegir dirección se
  vuelve a `output: 'server'` con `@astrojs/cloudflare` y el binding D1.
- **React 19** solo como isla para los filtros. Es lo único interactivo.
- **Tailwind 4** (`@tailwindcss/vite`) para el comparador; las tres maquetas van
  con CSS propio y tokens por diseño, que es lo que permite que no se parezcan.
- **Fontsource** para servir las tipografías desde el mismo dominio: nada de
  peticiones a Google Fonts.

Pendiente para producción: cambiar React por Preact o por islas sin framework.
El runtime de React son ~57 kB comprimidos y esta interfaz no los necesita.

## Datos

Los proyectos, fechas y descripciones salen de la D1 real (`oliweb`, tabla
`projects`). Lo inventado para probar la maqueta está marcado en
`src/data/projects.ts`:

- **Tipo** (`ecommerce`, `marketplace`, `app`, `tool`, `brand`).
- **Stack** por proyecto.
- **Cuatro valoraciones** de 0 a 100 y las **horas invertidas**:
  - `craft` — acabado de la interfaz: composición, detalle e interacción.
  - `depth` — complejidad técnica: arquitectura, integraciones y casos límite.
  - `utility` — cuánto resuelve de verdad a quien lo usa a diario.
  - `impact` — resultados medibles: ventas, tráfico y adopción.
  - `hours` — tiempo invertido, en horas.

La puntuación global de la tarjeta es la media de las cuatro.

## Filtros y orden

Compartidos en `src/data/sorting.ts`, con una interfaz distinta en cada
dirección: nueve criterios de orden (fecha en ambos sentidos, alfabético,
global, cada métrica por separado y horas), estado (todos / en activo /
archivados) y tipo en selección múltiple.

## Lo que falta

- `/projects/[slug]`: las tarjetas ya enlazan ahí, pero la vista de detalle no
  existe. Ahí van la historia larga, capturas, el stack completo y el enlace al
  proyecto vivo.
- El formulario de contacto no envía: falta el endpoint.
- Los logos de proyecto son cuadrados opacos con su propio fondo, así que cada
  dirección los monta de una forma distinta. Con marcas en PNG transparente o
  SVG quedarían bastante mejor.
- El retrato es una foto de stock de Unsplash.
