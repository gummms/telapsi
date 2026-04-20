# FINALUPDATE: Instruções de Correção (Action Plan)

Olá `@code`, siga este descritivo passo a passo para corrigir as falhas identificadas na auditoria. Você não precisa pedir revisão para o usuário, apenas vá executando os passos um por um com calma e atenção.

## Passo 1: Correção do Gargalo de Performance (N+1 Query)
**Arquivo afetado:** `src/tools/aulas/PlanejadorAulas.jsx`
1. Encontre a função auxiliar `resolveCenas` dentro do `useEffect` responsável por tratar `editingData`.
2. Substitua o `for...of` que contém a chamada `await getDoc(...)` por uma execução síncrona/paralela usando `Promise.all`.
3. **Exemplo de código:**
```javascript
const cenaspromises = editingData.cenas.map((cRef) => 
  getDoc(doc(db, "filmes", cRef.filmeId, "cenas", cRef.cenaId))
    .then(cenaDoc => { ... })
    .catch(e => { ... })
);
const resolvidas = await Promise.all(cenaspromises);
const resolvidasFiltradas = resolvidas.filter(c => c !== null);
```

## Passo 2: Remoção de Componentes Órfãos de UI
1. **Exclua** completamente o arquivo `src/components/ButtonSec.jsx`. O projeto utiliza o componente padrão `ButtonMain.jsx` como a base de botões.

## Passo 3: Limpeza de Anti-Patterns do React (Key Props)
**Arquivos afetados:** 
- `src/tools/aulas/PlanejadorAulas.jsx`
- `src/tools/aulas/components/ObjetivosForm.jsx`
- `src/tools/aulas/components/MetodologiaForm.jsx`
- `src/tools/aulas/components/AtividadesExtrasForm.jsx`
- `src/tools/filmes/FichaFilme.jsx`

1. Sempre que você passar por um método `.map(...)` no JSX listado nesses arquivos, note que o aplicativo está usando `key={index}`.
2. Atualize isso. Se a entidade tiver um `id` (ex: em FichaFilme, a cena), utilize `key={cena.id}`. Se for um array de strings simples que podem mudar, mude a estrutura do array para conter um ID ou force a chave com `key={${item}-${index}}` (não é perfeito, mas é melhor).
3. Especialmente nos _forms_ do planejador (`ObjetivosForm.jsx`, `MetodologiaForm.jsx`, `AtividadesExtrasForm.jsx`), os itens podem estar vazios. Adicione IDs localmente no estado desses arrays (`crypto.randomUUID()` na criação do array inicial em `PlanejadorAulas.jsx`) ou garanta pelo menos uma chave estritamente atrelada a uma string/conteúdo previsível.

## Passo 4: Resolução de Acessibilidade Mobile
**Arquivo afetado:** `src/components/Buttons.css`
1. Localize a classe CSS `.dot-menu-btn`.
2. Altere a `width` e `height` de `2.5rem` para no mínimo `44px` (ou equivalente em `rem`, como `2.75rem`), visando o cumprimento do padrao WCAG Target Size.

## Passo 5: Internacionalização (i18n) de Placeholders
**Arquivos afetados:**
- `src/tools/filmes/CadastroFilme.jsx`
- `src/tools/aulas/components/MetodologiaForm.jsx`
- `src/tools/aulas/components/InfoGeraisForm.jsx`
- `src/tools/aulas/components/AtividadesExtrasForm.jsx`
- `src/i18n/locales/pt.json` e `src/i18n/locales/en.json`

1. As propriedades `placeholder` nestes arquivos estão escritas em hardcoded (string em aspas, como `placeholder="Título original"`).
2. Substitua todos esses hardcodes por funções `t()`. Exemplo: `placeholder={t("movie_registration.placeholders.original_title")}`.
3. Adicione estas chaves criadas nas chaves `pt.json` e `en.json` com suas traduções correspondentes.

## Passo 6: Proteção de Dados Sensíveis (Firebase Environment Variables)
**Arquivo afetado:** `src/services/firebaseConfig.jsx`, `/.env` e `/.gitignore`
1. Crie um arquivo chamado `.env` na raiz do repositório (`telapsi/`).
2. Adicione nele as chaves do Firebase seguindo o prefixo do seu builder (por padrão, Vite usa `VITE_`), como `VITE_FIREBASE_API_KEY=AIza...`.
3. Garanta que a string `.env` está inserida no `.gitignore`.
4. Modifique `firebaseConfig.jsx` para utilizar `import.meta.env.VITE_FIREBASE_API_KEY` (ou `process.env.REACT_APP_` dependendo de CRA vs Vite -> A julgar pelo ambiente e pastas padronizadas, utilize a que couber localmente - confira se é Vite antes!).
5. Crie também um `.env.example` "vazio" sem os dados secretos, apenas com o esqueleto.
