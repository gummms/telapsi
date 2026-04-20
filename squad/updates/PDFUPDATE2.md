# PDF Layout Adaptation (Movies/Guias Didáticos)

## Objective
The current print layout for `FichaFilme.jsx` reproduces the web interface (boxes, grids, pill shapes) on A4 paper, resulting in inefficient space usage and a non-document aesthetic. This update adapts the `FichaFilme.css` print styles to match the structured, formal document flow of `FichaAula`, maximizing page filling and readability.

## Instructions for @code

Update the `@media print` block within `c:\src\lit\telapsi\Telapsi\telapsi\src\tools\filmes\FichaFilme.css` to implement the following rules:

### 1. Clean Layout Workflow
* Ensure `.cena-slide`, `.slide-left`, and `.slide-right` are set to `display: block !important;` with `width: 100% !important;`.
* Remove all multi-column web flows.
* Increase `.cena-slide` density by reducing padding between scenes, using simple divider lines (`border-bottom: 2px dashed #ccc`) to separate scenes.

### 2. De-box Web Elements
Convert the colored web blocks (`.block-azul`, `.block-amarelo`, `.block-cinza`) and `.detail-box` into formal document sections.
* **Remove** `border: 1px solid #eee !important;` and any background colors.
* **Apply** a left-aligned reading line indicator to match `FichaAula`:
```css
  .block-azul,
  .block-amarelo,
  .block-cinza,
  .detail-box {
    background: none !important;
    border: none !important;
    border-left: 3px solid #000 !important;
    padding: 5px 0 5px 15px !important;
    margin-bottom: 20px !important;
    page-break-inside: avoid;
  }
```

### 3. Simplify Headings
* `.cena-header { display: flex; align-items: baseline; ... }`
* Add an underline to scene headers to separate them clearly:
```css
  .cena-header {
    border-bottom: 1px solid #000 !important;
    margin-bottom: 15px !important;
    padding-bottom: 5px !important;
  }
```

### 4. Flatten Tags and Pills 
Web pill UI (`.time-pill`, `.tema-pill`, `.keyword-pill`) looks awkward and wastes space in PDFs. Flatten them into bold inline text.
```css
  .time-pill {
    background: none !important;
    border: none !important;
    padding: 0 !important;
    font-weight: bold;
    font-size: 1.2rem !important;
    margin-left: 10px !important;
  }

  .tema-pill, 
  .keyword-pill {
    background: none !important;
    border: none !important;
    padding: 0 !important;
    margin-right: 8px !important;
    font-weight: bold;
  }
```

### 5. Font Metrics & Density
* Ensure `color: #000 !important;` is enforced on paragraphs inside slides to maximize ink contrast.
* Reduce default padding around text blocks inside `.slide-left` and `.slide-right` so text fills the A4 width more completely instead of retaining web margins. 
* Add `page-break-inside: avoid;` to `.cena-slide` where possible to prevent scenes from being awkwardly split across pages, while still allowing natural flow.
