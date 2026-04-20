# Auditoria da Aplicação (App Audit)

Abaixo estão os resultados detalhados da auditoria realizada no sistema Telapsi, classificados de acordo com as categorias solicitadas:

## 1. Conteúdo Inutilizado, Cargas Pesadas e Gargalos (Bottlenecks)
*   **Gargalo de Consulta em Banco de Dados (N+1 Query):** Em `PlanejadorAulas.jsx` (especificamente no `useEffect` de edição), o sistema realiza um *loop* sequencial (`for...of`) chamando `await getDoc(...)` para cada cena associada à aula. Isso cria uma "cascata" (waterfall) de requisições que bloqueia a renderização e sobrecarrega a rede. O correto seria o uso de requisições paralelas via `Promise.all()`.
*  **Componente Órfão:** Foi encontrado o arquivo `src/components/ButtonSec.jsx`, um componente definido na codebase que nunca é importado ou efetivamente utilizado no projeto, gerando acúmulo desnecessário de código.
*   **Otimização de Mídia (Imagens):** O projeto utiliza formatos de imagem tradicionais sem compressão de nova geração (`heroimg.jpg` com ~134KB) em `src/assets`. Idealmente, eles deveriam ser convertidos para `.webp` ou similar para economia de largura de banda e carregamento mais rápido.

## 2. Inconsistências de UI/UX e Más Práticas (Bad Practices)
*   **Má Prática no React (Uso de Index como Key):** Existem múltiplas ocorrências na aplicação onde componentes renderizados em iteradores (`.map`) utilizam o índice do array como atributo `key` no React. Isso pode causar problemas severos de performance, bugs no mapeamento de estado e inconsistências ao editar, adicionar ou deletar campos dinâmicos durante o uso de formulários das áreas de registro. Exemplos identificados em:
    *   `src/tools/aulas/PlanejadorAulas.jsx`
    *   `src/tools/aulas/components/ObjetivosForm.jsx`
    *   `src/tools/aulas/components/MetodologiaForm.jsx`
    *   `src/tools/aulas/components/AtividadesExtrasForm.jsx`
    *   `src/tools/filmes/FichaFilme.jsx`

## 3. Erros de Responsividade Mobile
*   **Touch Targets (Alvos de Toque) Inadequados:** Os recentes botões de dropdown para administrador (os de 3 pontinhos — `.dot-menu-btn`) possuem largura/altura fixadas em `2.5rem`. De acordo com as diretrizes de acessibilidade e WCAG para interface móvel, o requisito mínimo ideal de toque e clique sem erros é de `44x44px` ou `48x48px` para evitar cliques acidentais em outras áreas.

## 4. Textos Não Traduzidos (Hardcoded strings)
*   **Falta de Localização nos Placeholders dos Formulários:** Encontrou-se uma falha global nos arquivos relacionados ao painel de gerenciamento, onde a biblioteca de internacionalização (`useTranslation() / t()`) foi desconsiderada nas tags `placeholder` das entradas de texto (`inputs`). Eles estão permanentemente exibidos apenas em PT-BR:
    *   **Em `CadastroFilme.jsx`:** Contém aspas duplas com textos estáticos, tais como `"Título do filme (português)"`, `"Título original"`, `"Ex: Brasil"`, `"aaaa"`, `"000"`, `"Diretor ou diretora"`, `"Principais atores"`, `"Um pequeno resumo do filme"` e `"https://exemplo.com/imagem.jpg"`.
    *   **Em `MetodologiaForm.jsx`:** `"Ex: Introdução / Exibição / Discussão"`, `"Ex: 20"`
    *   **Em `InfoGeraisForm.jsx`:** `"Ex: Pródromos e início da esquizofrenia"`
    *   **Em `AtividadesExtrasForm.jsx`:** `"Descrição da dinâmica (ex: Grupo A entrevista, Grupo B observa)..."`

## 5. Vulnerabilidades de Segurança e Dados Sensíveis Expostos
*   **Credenciais de Acesso a Banco de Dados na Codebase (Hardcoded):** O arquivo `src/services/firebaseConfig.jsx` injeta diretamente as chaves de API da aplicação em um formato exposto (comitado em ferramenta de versionamento, caso haja versionamento online). Os dados sensíveis localizados incluem o `apiKey`, `authDomain`, `projectId` e outros `IDs` confidenciais.
    *   *Falha de Segurança:* Isso expõe integralmente o back-end (Firebase) publicamente do lado do cliente/repositório, possibilitando roubo de limite, interceptação e modificação de banco de dados por atacantes. (Nota: Embora algumas chaves precisem estar no client-side em um Build estático, elas nunca devem ser "comitadas" publicamente em texto pleno num arquivo JS).
    *   *Padrão Exigido:* Essas chaves deveriam estar presentes exclusivamente dentro de um arquivo `.env` seguro, chamado sob a convenção da build tool (ex: Vite) através de algo como `import.meta.env.VITE_FIREBASE_API_KEY`, garantindo que o `.env` esteja corretamente mascarado pelo `.gitignore`.
