# Auditoria de Design Responsivo (Mobile View Analysis)

Foi realizada uma análise profunda no front-end do projeto (especialmente focada nos arquivos e comportamentos CSS e nas variáveis globais) em busca das raízes que estão "quebrando" o layout para dispositivos móveis. Abaixo estão as conclusões, desde o principal gargalo arquitetural até inconsistências modulares.

## 1. O Problema Central (O Causador das "Quebras"): `--padding-body`
A maior parte da percepção de "layout totalmente quebrado" e "elementos fora do lugar" se deve à declaração constante das variáveis CSS em `.root` no arquivo `src/index.css`.

*   **Problema:** A variável global `--padding-body` está rigidamente fixada em `10rem` (aproximadamente 160 pixels de largura a depender da configuração inicial do navegador). Esta variável é utilizada indiscriminadamente para ditar o preenchimento (padding/margins) das laterais em dezenas de componentes (`NavBar`, `Hero`, `Menu`, `.professor-container`, seções `Sobre`, etc.).
*   **Consequência:** Em uma tela de celular padrão (ex: iPhone SE com 375px, ou iPhone 14 com 390px), usar `10rem` nas duas extremidades (esquerda e direita) consome **320px garantidos apenas de "espaço em branco"**. O layout real tem míseros `50px` de largura para desenhar textos, botões e imagens, esmagando os componentes vertiginalmente e forçando scrolls acidentais se tiverem largura mínima.
*   **Sugestão de Resolução:** É **crítico** aplicar Media Queries na raiz do arquivo `index.css` que readaptem esta variável de modo dinâmico:
    ```css
    /* No index.css */
    @media (max-width: 1024px) {
      :root { --padding-body: 5rem; }
    }
    @media (max-width: 768px) {
      :root { --padding-body: 1.5rem; }
    }
    ```

## 2. Inconsistências de Navegação (NavBars e Menus)
Os menus de navegação (`NavBar.css` e `Menu.css`) receberam esforços no desenvolvimento para possuir menus retráteis (Hamburguer menus via propriedades de *Transform* e classes como `.open`).

*   **Problema:** Ambos herdam padding problemático como `.menu-navbar-container { padding: 0 var(--padding-body); }` mas não o anulam dentro dos blocos `@media (max-width: 768px)`.
*   **Sugestão de Resolução:** Uma vez que o passo 1 (correção do root) for feito, 80% do problema das barras sumirá. Ainda assim, deve-se verificar o posicionamento interno (`padding: 2rem`) da aba `.nav-links` (fixed overlay), trocando medições rígidas por porcentagens marginais. 

## 3. Comportamento da Seção Hero (Página Inicial)
A página inicial (`Hero.css`) herda bem a passagem do Flexbox de `.hero` para `flex-direction: column`. Contudo, algumas escolhas forçam erro:

*   **Problema:** A imagem que decora o Hero ganha a propriedade `margin-top: -2rem` em contexto mobile. Isso pode acavalá-la por cima do fundo ou de botões/textos. Ademais, o título de 2.5rem pode continuar grande dependendo da string "esquizofrenia" (podendo estourar o container em viewports de 320px).
*   **Sugestão de Resolução:** Remover margens negativas de design e utilizar a propriedade `gap` do flexbox-pai, que calcula precisamente a proteção entre imagem e texto. Aplicar `word-break: break-word` aos títulos dinâmicos.

## 4. Grids das Seções "Catálogo" e "Aulas Prontas"
O mapeamento em `AulasLista.css` e `CatalogoFilmes.css` é competente para rebaixar os Grids paramétricos para 1 coluna (`grid-template-columns: 1fr`).

*   **Problema:** Elementos flexíveis internos nos Cards (como pilhas de Tags, categorias e duração agrupadas) não possuíam `flex-wrap: wrap` nativo até bem recentemente na refatoração, forçando itens fora da linha limite do Card.
*   **Sugestão de Continuidade:** O `.group-variations-container` (responsável pelo layout de variações da mesma aula) consome muito padding. As fontes deveriam escalar. Reduzir as etiquetas ("tags") da fonte de `0.75rem` em desktop para `0.65rem` em mobile, além de permitir o encadeamento das `.durations-list`.

## Conclusão: "Por que as coisas parecem não adaptar nada?"
A aplicação como um todo carece de um esqueleto flexível unificado porque sofre do padrão de *Desktop-first Rigid Sizing* (onde coisas como paddings de 160px existem nativamente, e as media-queries agem apenas como "band-aids" em certas cores ou tamanhos de fonte, esquecendo de reescrever o esqueleto).

Aplicar os fixes no Root (`:root`) e remover metragens absolutas não flexíveis eliminarão drasticamente essa sensação estragada no modo Mobile sem muito esforço para a equipe de código.
