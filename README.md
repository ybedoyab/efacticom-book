# EFACTICOM — Cartilla web interactiva

Micrositio estático en HTML, CSS y JavaScript (vanilla) con animaciones GSAP. Pensado para presentación institucional, embebido en `iframe` y exportación a PDF mediante la función de impresión del navegador.

## Estructura del proyecto

```
/
├── index.html
├── README.md
├── styles/
│   ├── main.css        # Tokens, layout base, tipografía, header, secciones, hero, footer
│   ├── components.css  # Botones, tableros, diagrama, timeline, tablas, acordeón
│   └── print.css       # Reglas solo para impresión / PDF
├── scripts/
│   ├── data.js         # Textos, timeline, clústeres, configuración de mocks de dashboards
│   ├── ui.js           # Renderizado: KPIs, filtros, gráficas mock, diagrama SVG, tablas
│   ├── animations.js   # GSAP + ScrollTrigger (fade, stagger, trazos del diagrama)
│   └── main.js         # Arranque: inicializa UI y animaciones
└── assets/
    ├── img/            # Imágenes de apoyo (opcional)
    ├── icons/          # favicon.svg y similares
    └── logos/          # IN3, variantes desde PPT, etc.
```

## Cómo ejecutarlo en local

No requiere build. Opciones:

1. **Python:** `python -m http.server 8080` en la raíz del proyecto y abrir `http://localhost:8080`.
2. **Node:** `npx serve .` (u otro servidor estático).
3. **VS Code / Cursor:** extensión “Live Server” sobre `index.html`.

Abrir `index.html` directamente desde el sistema de archivos puede limitar algunos recursos; se recomienda un servidor HTTP local.

## Modularidad del código

| Archivo | Responsabilidad |
|--------|------------------|
| `scripts/data.js` | Única fuente de contenido: titulares, párrafos, etapas, lista de variables por clúster, filtros mock, series de gráficos, 30 filas de estadística. |
| `scripts/ui.js` | Funciones reutilizables (`renderKpiCard`, `renderFilterBar`, `renderBarChart`, `renderDonutRow`, `renderDashboardGrid`, `renderStatsTable`), generación del diagrama de clústeres en SVG y `init()` que inyecta datos en el DOM. |
| `scripts/animations.js` | Registro de GSAP/ScrollTrigger, animaciones al scroll, omisión si `prefers-reduced-motion: reduce`. |
| `scripts/main.js` | Punto de entrada: llama a `EFACTICOM_UI.init()` y `EFACTICOM_ANIM.init()`. |
| `styles/main.css` | Variables de color (azules), modo documento (`.doc-page`, `.doc-viewport`), barra `.doc-toolbar`, botón **Guardar PDF** (`.doc-toolbar__pdf`). |
| `styles/components.css` | Componentes visuales: cards, dashboards, donuts, barras, timeline, acordeón. |
| `styles/print.css` | Oculta navegación y elementos no impresos; ajusta tipografía y saltos para PDF. |

## Cambiar textos o datos

1. Editar `scripts/data.js` (objeto `EFACTICOM_DATA`).
2. Recargar la página. No hace falta tocar `index.html` salvo que agregues nuevas secciones o contenedores con `data-*`.

## Cambiar logos o imágenes (resumen)

1. Coloca archivos en `assets/logos/` o `assets/img/`.
2. Actualiza rutas en `index.html` o en `scripts/data.js` según corresponda.
3. Sustituye los **placeholders** del footer por `<img>` reales.

Para una guía **manual detallada** (PPT, Minciencias, formatos y rutas exactas), lee la siguiente sección.

---

## Guía manual: qué hacer tú paso a paso (logos y archivos)

Esta sección lista solo lo que **debes hacer a mano**: descargar, exportar, convertir y colocar archivos en las carpetas correctas. La raíz del proyecto se asume como la carpeta donde está `index.html` (por ejemplo `C:\Users\yulcr\Escritorio\gisela\`).

### 1. Convención de formatos (PNG, JPG, SVG)

| Formato | Cuándo usarlo |
|--------|----------------|
| **PNG** | Casi siempre para **logos en web**: admite fondo transparente. Usa PNG-24 si el logo tiene degradados suaves. |
| **SVG** | Ideal si tienes el logo en **vectorial** (escalable, nítido en retina y en PDF). Mejor opción para EFACTICOM o IN3 si la marca lo permite. |
| **JPG** | Solo si el archivo **solo existe en JPG** (p. ej. foto o logo sobre fondo blanco fijo). Evita JPG para logos con transparencia (no la tiene). |

**Regla práctica:** para footer y hero, prioriza **PNG transparente** o **SVG**. Convierte a JPG solo si la fuente oficial lo entrega así y no puedes obtener PNG/SVG.

**Herramientas para convertir (si hace falta):**

- **Paint.NET, GIMP, Photoshop, Affinity:** Abrir archivo → Exportar como PNG.
- **Visor de Windows / IrfanView:** Abrir → Guardar como → PNG.
- **Navegador:** arrastrar un SVG al navegador no “convierte” a PNG; usa un editor o sitio de confianza para exportar SVG → PNG si necesitas bitmap.

---

### 2. Carpeta donde van todos los logos finales

**Ruta obligatoria (relativa al proyecto):**

```text
assets/logos/
```

**Ruta absoluta de ejemplo en Windows:**

```text
C:\Users\yulcr\Escritorio\gisela\assets\logos\
```

No subas logos con espacios raros en el nombre; usa minúsculas y guiones, por ejemplo:

- `minciencias.png`
- `efacticom-logo.png`
- `in3-iso.png` (ya existe en el repo como copia del PNG original)

---

### 3. Logo de Minciencias (descarga manual)

El sitio web y los enlaces de “descarga de marca” pueden cambiar; el proceso habitual es:

1. Abre el **portal oficial** del Ministerio (busca en tu navegador: “Minciencias Colombia” o “Ministerio de Ciencia Tecnología e Innovación Colombia”).
2. Busca secciones como **“Identidad institucional”**, **“Marca”**, **“Transparencia”** o **“Prensa / Recursos”**; a veces el logo está en el pie de página como imagen.
3. Si ofrecen **kit de prensa** o **ZIP de logos**, descárgalo y elige la variante **horizontal** o **vertical** según encaje en el footer (ancho ~180–240 px de alto razonable).
4. Si solo puedes **guardar imagen desde la web**: clic derecho sobre el logo (si la política del sitio lo permite) → “Guardar imagen como…” → guarda como PNG si es posible.
5. **Renombra** el archivo a algo claro, por ejemplo: `minciencias.png`.
6. **Copia** el archivo a:

   ```text
   assets/logos/minciencias.png
   ```

7. **Edita `index.html`**: localiza el bloque del footer con el texto “Minciencias” dentro de un `div` con clase `logo-placeholder` y **sustituye** ese `div` por una imagen, por ejemplo:

   ```html
   <img src="assets/logos/minciencias.png" alt="Ministerio de Ciencia, Tecnología e Innovación" width="200" height="80" />
   ```

   Ajusta `width` y `height` para que se vea proporcionado (mantén la relación de aspecto del logo original).

**Nota legal:** usa solo material que el Ministerio autorice para uso institucional o de proyecto vinculado; si la convocatoria lo exige, adjunta la versión aprobada por ellos.

---

### 4. Logos dentro del PowerPoint `Logos software (1).pptx`

Archivo de referencia en el proyecto (si lo conservas en `assets/`):

```text
assets/Logos software (1).pptx
```

**Opción A — Desde PowerPoint (recomendada si tienes Office instalado)**

1. Abre el archivo `.pptx` con PowerPoint.
2. Ve a la diapositiva donde esté el logo que quieras (EFACTICOM u otra marca).
3. Clic en la imagen del logo → clic derecho → **“Guardar como imagen…”** (o “Save as Picture…”).
4. Tipo de archivo: **PNG** si existe la opción; si no, PNG estándar.
5. Guarda primero en el Escritorio o en una carpeta temporal con nombre claro, p. ej. `efacticom-desde-ppt.png`.
6. **Copia** ese archivo a `assets/logos/` y renómbralo, p. ej. `efacticom-logo.png`.

**Opción B — Sin abrir PowerPoint (el PPT es un ZIP)**

1. Copia `Logos software (1).pptx` y renombra la copia a `Logos-software.zip` (o usa 7-Zip / “Extraer aquí” sobre el `.pptx`).
2. Dentro del ZIP, abre la carpeta `ppt/media/`.
3. Verás archivos `image1.png`, `image2.png`, etc. (en el proyecto ya hay copias en `assets/logos/` con esos nombres si las extrajiste antes).
4. **Abre cada PNG** en un visor de imágenes, identifica cuál corresponde a **EFACTICOM** o a la marca que necesitas.
5. Renombra el elegido a `efacticom-logo.png` y déjalo en `assets/logos/`.

**Qué hacer después en la web**

- El **hero** hoy muestra texto “EFACTICOM” sin imagen de marca. Para usar tu PNG/SVG:
  - Añade en `index.html` (junto al bloque `hero__brand-text`) un `<img src="assets/logos/efacticom-logo.png" alt="EFACTICOM" />` con tamaño razonable, o
  - Sustituye el párrafo `.hero__product` por el logo.
- El **footer** tiene un placeholder “EFACTICOM”: reemplázalo por:

  ```html
  <img src="assets/logos/efacticom-logo.png" alt="EFACTICOM" width="140" height="48" />
  ```

  (ajusta `width`/`height` según el diseño.)

---

### 5. Logo IN3 (ya referenciado en el proyecto)

Archivo esperado:

```text
assets/logos/in3-iso.png
```

Origen típico: el archivo original `assets/Logo ES 5x6 blue nfilled.png` copiado/renombrado. Si recibes otra versión oficial:

1. Guarda el archivo final como **`in3-iso.png`** (PNG) en `assets/logos/`.
2. No hace falta convertir a JPG si ya tienes PNG nítido.

Referencias en código:

- Hero: atributo `src` del `img` con `data-logo-in3`.
- Footer: segundo bloque de logos.

Si cambias el nombre del archivo, actualiza **`index.html`** en esas dos rutas `src`.

---

### 6. Checklist rápido (orden sugerido)

1. [ ] Descargar o exportar **Minciencias** → `assets/logos/minciencias.png`.
2. [ ] Elegir y exportar **EFACTICOM** desde el PPT → `assets/logos/efacticom-logo.png`.
3. [ ] Confirmar **IN3** → `assets/logos/in3-iso.png`.
4. [ ] Editar **`index.html`**: reemplazar los dos `div.logo-placeholder` (Minciencias y EFACTICOM) por etiquetas `<img>` apuntando a esas rutas.
5. [ ] (Opcional) Añadir logo EFACTICOM en el **hero** si lo deseas encima del titular.
6. [ ] Recargar la página en el navegador y revisar **Impresión / PDF** para ver que los logos no se corten.

---

### 7. Otros pendientes manuales (no son logos)

| Tarea | Dónde |
|--------|--------|
| Validar textos de la tabla de variables contra el PDF oficial | `scripts/data.js` → `variablesByCluster` y comentarios `TODO(content)` |
| Sustituir correo genérico del footer | `index.html` (bloque `contact-line`) |
| Revisar nombres `Var_01`…`Var_30` en estadística si tienes la nomenclatura oficial | `scripts/data.js` → `dashboards.statsRows` |

Los comentarios `TODO(asset)` y `TODO(content)` en el código marcan puntos de reemplazo adicionales.

## Exportar o imprimir a PDF

1. Usar el botón **“Descargar PDF”** (disparador de `window.print()`) o el menú del navegador → Imprimir.
2. Destino: **Guardar como PDF**.
3. Ajustes recomendados: márgenes normales o predeterminados; activar “Gráficos de fondo” si los fondos oscuros no se ven bien (en `print.css` se fuerza fondo claro en varias secciones).

## Uso en iframe

La interfaz es un **visor de documento** (fondo gris + hojas blancas). Cada bloque `.doc-page` crece con su contenido: **no hay scroll dentro de la hoja**; el scroll es el de la ventana. Al **Guardar PDF / Imprimir**, el navegador reparte el contenido en **páginas A4** (`@page` + reglas en `styles/print.css`: saltos naturales, bloques pequeños sin partir, tablas con cabecera repetida). Active **«Gráficos de fondo»** en el cuadro de impresión si quiere ver bordes y fondos de KPI/tablas con color.

Ejemplo:

```html
<iframe
  src="https://tu-dominio.com/ruta/index.html"
  title="Cartilla EFACTICOM"
  width="100%"
  height="90vh"
  style="border:0; max-width: 820px; margin: 0 auto; display: block;"
  loading="lazy"
></iframe>
```

- **`height`:** usa `90vh` o un valor fijo alto (p. ej. `2800px`) si prefieres barra de scroll solo en la página padre.
- **`max-width`:** ~`820px`–`900px` coincide con el ancho de la “hoja”; evita que el gris del visor se estire demasiado en monitores anchos.
- Opcional: `sandbox="allow-scripts allow-same-origin"` si tu política lo exige (puede afectar la impresión desde dentro del iframe).

## Dependencias externas

- **GSAP 3** y **ScrollTrigger** cargados por CDN (jsDelivr) en `index.html`.
- **Fuentes** (DM Sans, Instrument Serif) por Google Fonts.

Para despliegue offline, descarga GSAP y las fuentes e inclúyelos localmente.

## Referencias de proyecto en `assets/`

En la carpeta `assets/` del repositorio puedes conservar los archivos fuente (DOCX, PDF, XLSX, JPG, PPT). La cartilla **no** los lee en tiempo de ejecución; sirven como referencia para contenido y diseño.

---

**EFACTICOM** — cartilla digital corporativa. Contenido académico-institucional sujeto a actualización de marcas y datos oficiales.
