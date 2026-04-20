# MOBILEUPDATE: Plano de Ação para Responsividade

Olá `@code`, siga este descritivo passo a passo meticulosamente para corrigir os diversos problemas de adaptação de layout (Mobile Responsiveness) verificados na auditoria. Você não precisa pedir autorização ao usuário, apenas vá codificando sequencialmente estes Passos.

## Passo 1: Correção do Paddding Global (A RAIZ DO PROBLEMA)
**Arquivo:** `src/index.css`
O grande vilão de nossos problemas no Layout Mobile está aqui. A variável `--padding-body` está em `10rem` fixos. Precisamos introduzir as responsões.

1. Navegue até o **final** do arquivo `src/index.css` (linha ~46).
2. Adicione Media Queries reescrevendo explicitamente o token no seletor `:root`:
```css
@media (max-width: 1024px) {
  :root {
    --padding-body: 5rem;
  }
}

@media (max-width: 768px) {
  :root {
    --padding-body: 1.5rem;
  }
}
@media (max-width: 480px) {
  :root {
    --padding-body: 1rem;
  }
}
```
*Isto automaticamente consertará 80% do esmagamento provocado no `NavBar`, no `Menu`, e nos containers principais de toda a aplicação (como `Content`, `Professor`, `Hero` e seções da Home).*

## Passo 2: Ajuste Frontal (Hero Section Margin)
**Arquivo:** `src/sections/Hero.css`
A seção da entrada tenta se sobrepor por design no Desktop, mas quebra visualmente textos no Mobile.

1. Localize o bloco de celular `@media (max-width: 768px)`.
2. Onde existir uma regra para a imagem (ex: `.hero-img`, ou `.hero img` ou se a classe margin for interna), se tiver configurações negativas do tipo `margin-top: -2rem` ou similar, resete elas com `margin-top: 0;`.
3. Verifique a classe `.hero` e `.hero-text`: caso ela esteja importando metragens absolutas desnecessárias dentro ou fora do mobile repletas de gap duro, dê `word-break: break-word` ao `h1`, para garantir que o título gigante como "esquizofrenia" quebre a palavra e não crie barra de script.

## Passo 3: Correção do Título na Sessão Sobre e Planejamento
**Arquivos:** `src/sections/Sobre.css` e `src/sections/Planejamento.css`
Os textos nestas páginas usam "Títulos/Parágrafos" (ex: `.sobre-paragraph` e `.planejamento-paragraph`) que utilizam exatos `2rem`.

1. Vá as propriedades media query em `@media (max-width: 768px)`.
2. Garanta que a alteração de redução na font-size existe para `1.2rem` (Ela já foi incluída por um programador anterior, mas certifique-se!).
3. Atribua um leve redutor de margem. Ajuste a área `width: 100%;` desses blocos com flexibilidade se faltar ou sobrar espaço lateral. Se achar prudente, nada se faz já que o passo 1 os afeta. Não perca muito tempo se tudo estiver correto e herdado.

## Passo 4: Listagens e Tags nas Tabelas Internas
**Arquivo:** `src/tools/aulas/AulasLista.css`

Os cards das "listas" esmagam as badgets dos filtros de grupos quando abertos de um celular.
1. Confirme se a classe `.durations-list` tem nativamente  `flex-wrap: wrap;`.
2. Adicione, dento do `@media (max-width: 768px)` já existente no fim de `AulasLista.css`, a ordem que diminui o tamanho das tags minúsculas e badges contínuas para não estourarem o card.
```css
@media (max-width: 768px) {
  /* (...código seu existente...) */
  .tag {
    font-size: 0.65rem; /* Diminui das antigas 0.75rem de Desktop */
    padding: 0.15rem 0.4rem;
  }
  
  .publico-title {
     word-break: break-word; 
  }
}
```

Ao completar estas metas em ordem, o layout deve se portar com estabilidade orgânica fluida no emulador. Execute e me reporte no final.
