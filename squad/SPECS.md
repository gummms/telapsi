# TELAPSI_SPECIFICATIONS

## 1. VISION
Telapsi is a website that store movies data and relates them to psichiatry insights. The movies can be used as a tool for psichiatry lessons.

## 2. DATA STRUCTURE
**2.1. Movies (educational guides) (`./src/tools/filmes`):** 
**2.1.1. Movie card (`./src/tools/filmes/FichaFilme.jsx`):** 
**2.1.1.1. Header:** title, number of scenes that contain psichiatry insights, year of release, genre, duration (min), country of origin, original title, direction, cast, sinopse.
**2.1.1.2. Scenes:** title, timestamp, description, lesson tips, related themes, key words, clinic correlation, questions for debate, comparison points.
**2.1.2. Movie list item (`./src/tools/filmes/CatalogoFilmes.jsx`):** title, year of release, genre, duration (min), country of origin, related themes, button to view movie card.
**2.1.3. Movies (educational guides) form (`./src/tools/filmes/CadastroFilme.jsx`):** form to create movies (educational guides), currently disabled.
**2.1.4. Scenes form (`./src/tools/filmes/CadastroCena.jsx`):** form to create scenes in movies, currently disabled.

**2.2. Lessons (`./src/tools/aulas`):**
**2.2.1. Lesson card (`./src/tools/aulas/FichaAula.jsx`):** title, target audience, duration, related media, print to PDF button, general objective, methodologic script, scenes for exibition, suggested activity, guiding questions, handout/technical brief
**2.2.1.1. Lesson card scenes:** list containing in each item: movie title, scene timestamp, scene title, scene description

**2.3. Lesson list item (`./src/tools/aulas/AulasLista.jsx`):** title, related movies, target audience 1, button to view lessons cards for target audience 1 (each target audience can have up to 3 lessons with different lesson duration), target audience 2, button to view lessons cards for target audience 2, target audience 3, button to view lessons cards for target audience 3

**2.4. Lessons planner (`./src/tools/aulas/PlanejadorAulas.jsx`):** form to create lessons, currently disabled.


## 3. SCREEN FLOW
- **Screen A**: Landpage,
- **Screen B**: Login (currently disabled),
- **Screen C**: Educational area,
- **Screen C.1.**: Administrator view,
- **Screen C.1.1.**: Lessons, create new lesson
- **Screen C.1.2.**: Movies (educational guides), create new movie (educational guide)
- **Screen C.2.**: Student view,
- **Screen C.2.1.**: Lessons,
- **Screen C.2.2.**: Movies (educational guides),

## 4. UI/UX STANDARDS
- **Styling**: Minimal elegant. Strictly use standard React and Tailwind layout widgets.
- **Responsiveness**: Use React's `LayoutBuilder` or `MediaQuery` to adapt the dashboard for smaller screens (phones) and medium screens (tablets).


## 5. LOGIN/REGISTER
- Google login only;
- Admin users specified by e-mail in Firebase console;


## 6. CODING LANGUAGE, TECHNOLOGIES AND TOOLS
- **Language**: Javascript
- **Framework**: React
- **Backend**: Firebase

## 7. LANGUAGE
- **Default**: Portuguese
- **Alternative**: English (not implemented yet)