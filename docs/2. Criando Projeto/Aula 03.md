# Colocando a mão na massa, ou melhor, no código!

## Criando o Projeto

Parar criar nosso primeiro projeto em Angular, vamos utilizar o Angular CLI, que é uma ferramenta que nos ajuda a criar projetos Angular de forma mais rápida e fácil.

1. Crie uma pasta aonde você vai guardar seus projetos, se você já tiver uma, entre nela, eu, no caso, vou criar uma pasta chamada `Aula` usando o comando `mkdir Aula` e depois vou entrar nela usando o comando `cd Aula`.

2. Com o Angular CLI instalado, vamos criar nosso projeto usando o comando `ng new nome-do-projeto`, no meu caso, vou criar um projeto chamado `devameet-angular`, então vou usar o comando `ng new devameet-angular`.

3. O Angular CLI vai começar a fazer algumas perguntas, a primeira delas é se você quer usar o `routing`, que é um sistema de rotas do Angular, que é muito útil para criar Single Page Applications, ou seja, aplicações que não precisam recarregar a página para mudar de rota, como por exemplo, uma aplicação de e-commerce, onde você pode navegar entre as páginas de produtos, carrinho, checkout, etc, sem precisar recarregar a página, para isso, vamos usar o `routing`, então vamos responder `Y` para sim.

4. A próxima pergunta é se queremos usar o `CSS`, `SCSS` ou `SASS`, como vamos usar o `SCSS`, vamos apertar seta para baixo para selecionar o `SCSS` e apertar `Enter`. (Agora vamos aguardar, demora um tiquinho...)

5. Agora que o projeto foi criado, vamos abrir ele no nosso editor de código, no meu caso, vou usar o VSCode, então vou usar o comando `code devameet-angular` para abrir o projeto no VSCode.

## Configurando e limpando o projeto

Antes de tudo, vamos usar o comando `ng serve` para rodar o projeto, para isso, vamos abrir o terminal do VSCode, que é o terminal integrado, e vamos usar o comando `ng serve`, o Angular CLI vai compilar o projeto e vai abrir uma aba no navegador com o endereço `http://localhost:4200/`, que é a página inicial do nosso projeto.

Agora você deve estar vendo a página padrão do Angular, que é a página de boas vindas, e se você olhar o código fonte da página, vai ver que o conteúdo da página está no arquivo `src/app/app.component.html`, que é o arquivo que contém o template do componente `AppComponent`, que é o componente principal da nossa aplicação, que é o que vai ser renderizado no `index.html`.

**Na aula em vídeo, irei apresentar um pouco sobre o que é cada coisa que foi criada para nós, não esqueça de assistir!**

### Agora vamos limpar o projeto par começarmos de verdade!

1. Vamos começar limpando o projeto, vamos apagar o conteúdo do arquivo `src/app/app.component.html`, que é o arquivo que contém o template do componente `AppComponent`, que é o componente principal da nossa aplicação, que é o que vai ser renderizado no `index.html`.

2. Vamos apagar qualquer variável ou função não necessária que esteja dentro da Classe `AppComponent` em `src/app/app.component.ts`, que é o arquivo que contém a classe do componente `AppComponent`, que é o componente principal da nossa aplicação, que é o que vai ser renderizado no `index.html`.

3. Vamos criar um `<h1>` em `src/app/app.component.html` com o texto `Olá Mundo!`, esse passo é uma velha história da tecnologia, que diz que se não escrevermos `Olá mundo!` quando estamos aprendendo uma nova tecnologia nós não vamos aprender ela, então só por garantia é melhor escrever! Hahaha.

4. Prontinho!

### Agora vamos criar nossa estrutura padrão de pastas para o projeto

Se você instalou a extensão `Material Icon Theme` as pastas e arquivos já devem estar com icones coloridos e bonitos, se não instalou, recomendo que instale, ela é muito útil para identificar os arquivos e pastas.

Nós vamos usar um modelo de pastas muito utilizado no mercado, que é o modelo de pastas do [Angular Style Guide](https://angular.io/guide/styleguide), para manter o projeto bem organizado.

1. Crie uma pasta chamada `environment` em `src`, e dentro dela crie um arquivo chamado `environment.ts`, que vai conter as variáveis de ambiente do nosso projeto, e um arquivo chamado `environment.prod.ts`, que vai conter as variáveis de ambiente do nosso projeto em produção.

2. Dentro da pasta `src/assets` vamos criar as seguintes pastas:

   - `fonts`
   - `images`
   - `styles`

3. Criem as seguintes pastas dentro de `src/app`:

   - `guards`
   - `pages`
   - `services`
   - `shared`
   - `types`

4. Dentro da pasta `shared`, que é a pasta que guardará os componentes compartilhados (você vai entender melhor quando começarmos a criar os componentes), vamos criar as seguintes pastas:
   - `components`
   - `decorators`
   - `pages`
   - `validators`

Pronto!

![Gif tudo feito](https://media.giphy.com/media/l0Iyl55kTeh71nTXy/giphy.gif)

# Configurando o SCSS

Agora que limpamos nosso ambiente, vamos configurar o **SCSS**, o SCSS é uma extensão do CSS, que nos permite usar variáveis, funções, mixins, entre outras coisas, que nos ajudam a escrever o CSS de uma forma mais organizada e fácil de manter.

## Configurando as fontes

1. Vamos para a pasta `src/assets/fonts`, e vamos adicionar 3 arquivos de fonte, a que vamos usar será a **Biennale**, e você pode baixar [clicando aqui](https://ifonts.xyz/biennale-font.html), depois que você baixar, abra o arquivo `.rar` que foi baixado, e copie as fontes `Biennale Bold`, `Biennale Light` e `Biennale Regular` para a pasta `src/assets/fonts`.

2. Agora para ficar fácil a importação, vamos renomear as fontes removendo os espaços, e vamos colocar o nome da fonte em minúsculo, então vamos renomear as fontes para `biennale-bold`, `biennale-light` e `biennale-regular`.

3. Feito isso, vamos criar um arquivo `fonts.scss` nesta mesma pasta, e vamos colar o seguinte código:

   ```scss
   @font-face {
     font-family: "Biennale Regular";
     src: url("biennale-regular.otf") format("opentype");
   }
   @font-face {
     font-family: "Biennale Bold";
     src: url("biennale-bold.otf") format("opentype");
   }

   @font-face {
     font-family: "Biennale Light";
     src: url("biennale-light.otf") format("opentype");
   }
   ```

## Configurando os estilos globais e SCSS

Dentro da pasta `src` existe um arquivo chamado `styles.scss` que é o arquivo que contém os estilos globais da nossa aplicação, e que é importado no `angular.json` para ser usado em toda a aplicação.

Este é um ótimo local para colocarmos variáveis, mixins, funções, entre outras coisas que vamos usar em toda a aplicação, inclusive, um ótimo lugar para configurarmos o padrão de cor do Angular Material, que vamos utilizar no projeto.

### **Vamos instalar e configurar o Angular Material**

1. Vamos instalar o Angular Material com o comando `ng add @angular/material`, após digitar o comando, ele vai perguntar `The package @angular/material@x.x.x will be installed and executed. Would you like to proceed?`, digite `y` e aperte enter.

2. Depois de instalar, ele vai perguntar se queremos usar um teme pré-feito por eles, ou se queremos criar o nosso próprio com a opção `custom`, aperte seta para baixo até chegar em `custom`, e aperte enter.

3. Então ele vai perguntar `Set up global Angular Material typography styles?` digite `n` e aperte enter.

4. Agora ele vai perguntar `Include the Angular animations module?`, use as setas para selecionar `Include and enable animations` e aperte enter.

Prontinho, agora ele deve ter criado alguns estilos no arquivo `styles.scss` na pasta `src`, nós vamos apagar esses estilos que ele criou e vamos colar o seguinte código:

`src/styles.scss`

```scss
// Configurando o tema do Angular Material

@use "@angular/material" as mat;
@include mat.core();

$primary-palette: mat.define-palette(
  (
    50: #e5f9fa,
    100: #beeff2,
    200: #92e5e9,
    300: #66dbe0,
    400: #46d3da,
    500: #25cbd3,
    600: #21c6ce,
    700: #1bbec8,
    800: #16b8c2,
    900: #0dacb7,
    A100: #e5fdff,
    A200: #b2f9ff,
    A400: #7ff5ff,
    A700: #65f3ff,
    contrast: (
      50: #000000,
      100: #000000,
      200: #000000,
      300: #000000,
      400: #000000,
      500: #000000,
      600: #000000,
      700: #000000,
      800: #000000,
      900: #ffffff,
      A100: #000000,
      A200: #000000,
      A400: #000000,
      A700: #000000,
    ),
  )
);

$devameet-angular-primary: mat.define-palette($primary-palette);
$devameet-angular-accent: mat.define-palette($primary-palette);
$devameet-angular-warn: mat.define-palette(mat.$red-palette);

$devameet-angular-theme: mat.define-light-theme(
  (
    color: (
      primary: $devameet-angular-primary,
      accent: $devameet-angular-accent,
      warn: $devameet-angular-warn,
    ),
  )
);

@include mat.all-component-themes($devameet-angular-theme);
```

Prontinho!

### **Configurando estilos globais com SCSS**

Agora chegou a hora de definirmos alguns padrões de estilo, abaixo do código que acabamos de adicionar, vamos adicionar o seguinte código:

`src/styles.scss`

```scss
// ... Código que acabamos de adicionar do tema do Angular Material

// Adicionando outros estilos globais na aplicação

@import "./assets/fonts/fonts.scss";
:root {
  --fontRegular: "Biennale Regular", sans-serif;
  --fontBold: "Biennale Bold", sans-serif;
  --fontLight: "Biennale Light", sans-serif;

  --primaria01: #3bd42d;
  --primaria02: #5e49ff;
  --primaria03: #25cbd3;
  --primaria04: #f0f5ff;

  --branco: #ffffff;
  --cinza01: #dadada;
  --cinza02: #7c7786;
  --cinza03: #4d4c4d;
  --cinza04: #333333;
  --cinza00: #f4f4f4;

  --selecao: #fd4343;
  --vermelho: #ff0000;
  --muted: #ff3049;
}

* {
  font-family: var(--fontRegular);
  font-size: 14px;
}

html,
body {
  height: 100%;
  margin: 0;
}
```

#### **Mas o que é isso que acabamos de adicionar?**

Bem, o que acabamos de fazer foram adicionar algumas variáveis globais, primeiramente, adicionamos as fontes que acabamos de importar, depois adicionamos as variáveis de cores, e por fim, adicionamos alguns estilos globais, como por exemplo, o tamanho da fonte padrão da aplicação, a altura padrão do corpo (`body`) e a margem padrão do corpo.

Uma das coisas foram variáveis de cor, certo? Para utilizalas basta colocar `var(--nome-da-variavel)`, por exemplo, se quisermos utilizar a cor primária 01, basta colocar `var(--primaria01)`.

O mesmo serve para as fontes, se quisermos utilizar a fonte regular, basta colocar `var(--fontRegular)`.

Por fim, mas não menos importante, vamos criar uma variável SCSS para o Breakpoint (Breakpoint significa o ponto de quebra, ou seja, o ponto em que a aplicação vai mudar de layout) usamos Breakpoint para mudar o layout de uma aplicação entre o modo Mobile vs Desktop, por exemplo.

`src/styles.scss`

```scss
// ... Código que acabamos de adicionar do tema do Angular Material
// ... Código que acabamos de adicionar dos estilos globais

// Breakpoints

$desktopBreakpoint: 992px;
```

Agora sim, estamos prontos para começar a criar o layout da nossa aplicação!

![Ross fazendo arte](https://media.giphy.com/media/d31vTpVi1LAcDvdm/giphy.gif)

# Copiando os Assets do Figma

Para finalizar, vamos copiar cada um dos Assets disponibilizados no Figma do projeto, e vamos colocar dentro da pasta `src/assets/images` de forma organizada, e também vamos adicionar alguns outros assets que vamos utilizar no projeto.

Para isso, assista a aula para entender como funciona.

[Link do Figma](<https://www.figma.com/file/mIXcu8SJWqi0ylVHtZn89a/Devameet-(Projeto-2023)>)

[Link dos Assets, essa é a pasta assets inteira pronta pra você](https://drive.google.com/file/d/18Qlu4kl4shW_sjkKf2LDFV7u4QaPBTh4/view?usp=sharing)

**ATENÇÃO:**
Caso prefira, e eu recomendo que faça isso, baixe a pasta `images` que ficará dentro de `assets`, [clicando bem aqui](https://drive.google.com/file/d/1LpdnXsXjSKTsjEsx44wOxOIVY52-2has/view?usp=sharing), assim você evita de copiar cada um dos assets um por um, ou de esquecer alguma coisa durante esse processo.

# Clonando o repositório de Back-End

Durante o projeto vamos precisar consumir dados de uma API, você vai aprender a fazer ela com outro professor aqui na Devaria, mas, você pode usar essa API, ela já esta feita, e pode ser acessada.

Para ter acesso a essa API, clone e rode o repositório, clicando bem aqui: [Link do repositório](https://github.com/Devaria-Oficial/devameet-nest-js).

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif você fez isso](https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif)
