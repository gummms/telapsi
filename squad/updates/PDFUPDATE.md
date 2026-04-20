# PDF & Print Updates

## 1. Fix Blank PDFs (FichaAula & FichaFilme)
**Context:** When attempting to print either a movie or a lesson, the PDF is blank. This happens because `FichaAula.css` defines a global `@media print` rule that applies `height: 0` and `overflow: hidden` to `body *`. Since modern React places the `.ficha-overlay` inside `#root` (a child of `body`), `#root` gets collapsed to 0px height and clips the entire overlay, making it invisible when printing.

**Action:**
In `c:\src\lit\telapsi\Telapsi\telapsi\src\tools\aulas\FichaAula.css`:
* Locate the `@media print` block and find the `body *` rule.
* Remove `height: 0;` and `overflow: hidden;` so it only contains `visibility: hidden;`.
* Ensure that `.ficha-overlay` rule has `position: absolute; left: 0; top: 0; width: 100%;`. This allows the overlay to break out of the hidden parent's layout flow and position itself correctly at the top of the printed page.

Example Update in `FichaAula.css`:
```css
  /* 2. Ocultar TUDO por padrão */
  body * {
    visibility: hidden;
  }

  /* 3. Tornar visível APENAS a Ficha e seus filhos */
  .ficha-overlay,
  .ficha-overlay * {
    visibility: visible;
    color: #000 !important;
  }

  /* 4. Reposicionar a Ficha para ocupar a folha inteira */
  .ficha-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    background: white !important;
    backdrop-filter: none;
    display: block;
    z-index: 9999;
  }
```

In `c:\src\lit\telapsi\Telapsi\telapsi\src\tools\filmes\FichaFilme.css`:
* Apply the same absolute positioning logic for `.ficha-overlay` during print. Locate `.ficha-overlay` within `@media print`.
* Remove `position: static !important;` and replace it with `position: absolute !important; left: 0; top: 0; width: 100% !important; margin: 0 !important; padding: 0 !important;`.

## 2. Fix Print Button Overlap in Movie Cards (FichaFilme)
**Context:** The "Print/PDF" button and the "X" (close) button are overlapping in the movie cards. The `.btn-close` class has `position: absolute` globally, but it is placed inside a `.ficha-header-btns` container which is *also* `position: absolute` and sets `display: flex`. Since `.btn-close` is absolute, it ignores the flex layout and maps directly over the container's coordinates.

**Action:**
In `c:\src\lit\telapsi\Telapsi\telapsi\src\tools\filmes\FichaFilme.css`:
* Target the `.btn-close` inside `.ficha-header-btns` to reset its positioning back to static, allowing it to line up beautifully next to the print button.

Example Update in `FichaFilme.css`:
```css
.ficha-header-btns {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 100;
}

/* Fix overlapping by resetting absolute position */
.ficha-header-btns .btn-close {
  position: static;
}
```
