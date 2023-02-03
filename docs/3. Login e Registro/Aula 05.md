# Criando o componente de botão

Como já fizemos da última vez com o componente de `input`, vamos criar um componente de botão.

Vamos até a pasta `src/app/shared/components`, vamos clicar com o botão direito em cima da pasta `components` e vamos clicar em `Angular: Generate a component`, vai aparecer um input lá em cima no VSCode, vamos digitar o nome do nosso componente, que no caso é `button`, e vamos clicar em `Enter`.

Agora vamos selecionar a opção `Default component`, e depois `Confirm`.

**OBS: Essa primeira parte de criar o componente usando o CLI sempre será igual, então guarda ai na mente, é assim que se cria qualquer componente em Angular!**

## **Modificando o TS**

Para mantermos um padrão, nós sempre vamos começar pelo **TS**, depois vamos para o **HTML** e depois para o **SCSS**.

O nosso botão terá que receber algumas propriedades, como por exemplo, o texto que vai aparecer no botão, qual será a cor dele, o tipo, se está ou não desativado e entre outros, vamos abrir o arquivo `button.component.ts` e vamos começar a criar essas propriedades:

```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
})
export class ButtonComponent {
  @Input() public texto?: string;
  @Input() public cor: "primaria" | "outline" | "texto" = "primaria";
  @Input() public classeCss: string = "";
  @Input() public tipo: "button" | "submit" = "button";
  @Input() public desabilitar: boolean = false;
}
```

Quando criamos o componente `input` eu ensinei para vocês que o `@Input()` é um decorator que serve para dizer que aquela propriedade é uma propriedade que vai ser passada para o componente.

Quando usamos `?` no typescript, estamos dizendo que aquela propriedade é opcional, ou seja, não é obrigatório passar ela para o componente, por padrão ela vai ser `undefined`.

No typescript quando passamos `... variavel: string = ...`, essa parte `: string` é o tipo da variável, no caso `"primaria" | "outline" | "texto"` é um tipo que eu criei, que é um tipo que só pode receber esses três valores, se você tentar passar outro valor, vai dar erro.

Então `@Input() public cor: "primaria" | "outline" | "texto" = "primaria";` significa que a propriedade `cor` é uma propriedade que vai ser passada para o componente, ela tem que receber uma dessas strings: `"primaria" | "outline" | "texto"`, e por padrão ela vai ser `"primaria"`.

**Top! Aprendemos um pouco de tipagem em TypeScript!**

## **Modificando o HTML**

Agora vamos abrir o arquivo `button.component.html` e vamos começar a criar o HTML do nosso botão:

```html
<button
  [type]="tipo"
  [disabled]="desabilitar"
  [ngClass]="['btn', cor, classeCss]"
>
  {{ texto }}
</button>
```

E pronto, terminou, é simples assim!

Você pode ver que é somente uma tag Button, essa tag tem alguns atributos usando o `[]`, isso significa que é um atributo que vai receber uma variável, e não um valor fixo, assim como aprendemos no `input`, **repito isso aqui agora pois eu vou parar de explicar essas coisas que já te ensinei, então se você não entendeu, ou esquecer de algo, você pode voltar nos vídeos anteriores e ver novamente.**

Aqui nós temos um atributo novo, chamado `ngClass`, ele serve para adicionar classes no elemento, e ele recebe um array de classes, então ele vai adicionar todas as classes que estão dentro desse array no elemento.

## **Modificando o SCSS**

Agora vamos abrir o arquivo `button.component.scss` e vamos colocar o seguinte código:

```scss
@import "/src/styles.scss";

@mixin botaoPrimario {
  color: var(--branco);
  background-color: var(--primaria03);
  border: 1px solid transparent;
}

@mixin botaoOutline {
  background-color: var(--branco);
  color: var(--primaria03);
  border: 1px solid var(--primaria03);
}

@mixin botaoTexto {
  background-color: transparent;
  color: var(--primaria03);
  text-decoration: underline;
  border: none;
}

.btn {
  width: 100%;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &.primaria {
    @include botaoPrimario;

    &:hover {
      @include botaoOutline;
    }
  }

  &.outline {
    @include botaoOutline;

    &:hover {
      @include botaoPrimario;
    }
  }

  &.texto {
    @include botaoTexto;

    width: fit-content !important;
  }

  &.botaoPublico {
    margin-top: 40px;
    padding: 12px;
    font-size: 16px;
  }

  &.botaoModalAvatar {
    font-size: 14px;
    font-weight: 600;

    padding: 12px;
    border-radius: 8px;
    width: 100px;

    @media screen and (min-width: $desktopBreakpoint) {
      font-size: 16px;
      font-weight: 600;

      padding: 14px;
      border-radius: 8px;
      width: 150px;
    }
  }

  &.cinzaSoTexto {
    color: var(--cinza03);
    font-weight: 700;
    text-decoration: none;
  }

  &.soTexto {
    font-weight: 700;
    text-decoration: none;
  }

  &.join {
    margin-top: 40px;
    padding: 12px;
    font-size: 16px;
  }

  &:disabled {
    opacity: 0.5;
  }
}
```

Bem, assim como eu já havia dito, não vou me aprofundar no SCSS aqui na apostila, mas no vídeo eu vou explicar o que cada coisa faz, então não se preocupe.

**Outra coisa que você tem saber é existem várias e várias classes e modificações nesse e nos próximos `SCSS` que talvez nesse momento ainda não faça sentido, como, por exemplo `&.join`, `&.soTexto` que são classes que eu vou precisar quando tiver fazendo páginas específicas, mas não se preocupe, você vai entender tudo isso quando for fazendo as páginas.**

**ENTENDA: SCSS (No geral CSS) é algo que se aprende com repetição, muita coisa se repete, mas a base sempre é a mesma, por isso não vou gastar o nosso tempo, repetindo e repetindo CSS.**

Agora vamos pro próximo componente!

![Gif de Quase concluído](https://media.giphy.com/media/840zvMIuYv3ZwXanfN/giphy.gif)

# Criando o componente avatar

Vamos ver se você está craque, crie o componente avatar, assim como criamos das últimas vezes, quando criar, continue a leitura, mas se não lembra, aqui está como fazer:

Vamos até a pasta `src/app/shared/components`, vamos clicar com o botão direito em cima da pasta `components` e vamos clicar em `Angular: Generate a component`, vai aparecer um input lá em cima no VSCode, vamos digitar o nome do nosso componente, que no caso é `avatar`, e vamos clicar em `Enter`.

Agora vamos selecionar a opção `Default component`, e depois `Confirm`.

**OBS: Eu vou parar de repetir esse pedaço no futuro, para evitarmos repetição desnecessária :)**

## **Modificando o TS**

```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-avatar",
  templateUrl: "./avatar.component.html",
  styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent {
  @Input() public src?: string;
  @Input() public classeCss: string = "";

  constructor() {}

  public getAvatar(): string {
    if (this.src) {
      return `assets/images/objects/avatar/${this.src}.png`;
    }

    // Local futuro para o localStorage

    return "assets/images/objects/avatar/avatar_07_front.png";
  }
}
```

Irrull!! Aqui estamos, bem, vamos pular a parte sobre `@Input()` como eu já expliquei em outros componentes, então vamos direto para o método `getAvatar()`, esse método vai retornar a imagem do avatar, se o usuário tiver escolhido um avatar (ou seja, passado um valor em `src`), ele vai retornar o avatar que ele escolheu, se não, ele vai retornar o avatar padrão.

E você deve estar vendo um comentário no meio do código `// Local futuro para o localStorage`, isso é porque eu vou precisar pegar o avatar que o usuário escolheu e salvar no `localStorage`, e quando ele entrar na página, eu vou pegar o avatar que ele escolheu e colocar no `src` do componente, mas isso é algo que eu vou fazer no futuro, então não se preocupe, não precisa entender agora, quando for a hora, nós vamos implementar!

## **Modificando o HTML**

Agora vamos abrir o arquivo `avatar.component.html` e vamos colocar o seguinte código:

```html
<div [ngClass]="['avatar', classeCss]">
  <img [src]="getAvatar()" alt="Imagem do Avatar" class="avatarImg" />
</div>
```

Super simples, bem, vamos entender o que está acontecendo aqui, primeiro, temos uma div com a classe `avatar`, e a classe `classeCss`, a classe `classeCss` é uma classe que eu vou passar quando eu for usar o componente, por exemplo, quando eu for usar o componente no `header`, eu vou passar a classe `avatarHeader`, e quando eu for usar no `modal`, eu vou passar a classe `avatarModal`, e assim por diante, assim eu consigo estilizar o componente de acordo com o lugar que ele está sendo usado.

E dentro da div, temos uma imagem, que recebe o valor que o método `getAvatar()` retorna, ou seja, usando a `[]` podemos passar constantes, funções, qualquer coisa que o Angular entenda e que retorne um valor válido.

## **Modificando o SCSS**

Agora vamos abrir o arquivo `avatar.component.scss` e vamos colocar o seguinte código:

```scss
.avatar {
  position: relative;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid var(--cinza03);
  overflow: hidden;

  background-color: #f0f5ff;

  .avatarImg {
    width: 90%;

    position: absolute;
    top: 5%;
    right: 5%;

    pointer-events: none;
    user-select: none;
  }

  &.avatarCadastro {
    height: 120px;
    width: 120px;
    border: 4px solid var(--primaria03);

    .avatarImg {
      width: 70%;

      position: absolute;
      top: 5%;
      right: 15%;

      pointer-events: none;
    }
  }

  &.nav {
    cursor: pointer;
  }

  &.navActive {
    cursor: pointer;
    border: 2px solid var(--primaria03);
  }
}
```

# Criado o componente cta footer

Esse componente é responsável por mostrar o botão de redirecionamento para a página de login, se tivermos no cadastro, e para página de cadastro, se tivermos no login.

![Imagem do componente cta footer](https://i.imgur.com/EFll1Fq.png)

Primeiro, crie um componente chamado `cta-footer` na pasta de components compartilhados.

## **Modificando o TS**

```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-cta-footer",
  templateUrl: "./cta-footer.component.html",
  styleUrls: ["./cta-footer.component.scss"],
})
export class CtaFooterComponent {
  @Input() pergunta?: string;
  @Input() textoDaAcao?: string;
  @Input() rota?: string;
}
```

## **Modificando o HTML**

```html
<div class="rodapePaginaPublica">
  <p>{{ pergunta }}</p>
  <a [routerLink]="rota">{{ textoDaAcao }}</a>
</div>
```

Aqui temos uma nova propriedade chamada `routerLink`, ela é responsável por fazer o redirecionamento de página, e ela recebe o valor que a propriedade `rota` recebe, e assim, quando clicarmos no link, ele vai redirecionar para a página que a propriedade `rota` diz.

## **Modificando o SCSS**

```scss
.rodapePaginaPublica {
  text-align: center;
  margin-top: 24px;

  p {
    color: var(--cinza3);
    margin: 0px 0px 2px;
  }

  a {
    color: var(--primaria03);
    font-family: var(--fontBold);
  }
}
```

Prontinho, agora basta a gente ir em `shared-components.module.ts` e adicionar ele no array de `exports`:

```typescript
  exports: [
    // Outros...
    CtaFooterComponent,
  ],
```

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif tudo feito fechando o PC](https://media.giphy.com/media/MAzkuVTtXuCsqtDiFM/giphy.gif)
