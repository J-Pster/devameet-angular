# Criando a página de home (meets)

Bem, até agora nós tivemos uma maré de conteúdo, mas eles não são nada comparados a complexidade que vamos ver a seguir, mas não se preocupe, só é complexo aquilo que não entendemos por completo, e eu vou te explicar tudo, ao ponto de isso ficar fácil para você.

## **Analisando o que precisa ser feito**

A primeira coisa para construir uma aplicação com sucesso, é analisar o que o Design está propondo que seja feito, observe as imagens a seguir:

Página inicial, com as reuniões.
![Imagem 01](https://i.imgur.com/h2aqcx0.png)
Página inicial, sem as reuniões.
![Imagem 02](https://i.imgur.com/5scsCyS.png)
Página inicial, com e sem reuniões, versão mobile.
![Imagem 03](https://i.imgur.com/3diHQRr.png)

### Observando o cabeçalho e rodapé

A primeira coisa que notamos e vamos procurar são padrões, observe que existe um cabeçalho, chamaremos de `header`, esse cabeçalho está presente nessas duas páginas, mas se olharmos outras páginas do Figma vamos observar que elas se repetem em toda a aplicação.

Outra coisa, na versão mobile tem um rodapé, esse chamaremos de `footer`, e se você observar isso também se repete em toda a aplicação.

Essa repetição, nos chamaremos de padrões, esse padrão de ter um Cabeçalho e um Rodapé pode se tornar um componente, um componente que contém cabeçalho e rodapé, e que entre eles renderiza um `<ng-content>` com o conteúdo da página em sí.

### Observando a estrutura interna da página

Agora, observe o meio da página, você pode ver que na versão desktop ele é composto de uma barra lateral, e um conteúdo na direita, se você for no Figma e observar, por exemplo, a seguinte página:

Página de edição de sala
![Imagem 04](https://i.imgur.com/5iEmfsK.png)

Observe, aqui é outra página, e essa estrutura de ter uma barra na lateral e um conteúdo na direta se repete, dessa vez, com um conteúdo de fato sendo mostrado na direita.

Então pense, e observe, você vai perceber que podemos fazer dois componentes, um deles será o `header-n-footer`, que será um componente que integrará o `header` e o `footer` que também serão componentes, e que no meio dele terá um `<ng-content>` para renderizar o conteúdo da página.

E observe, como existem páginas que repetem esse padrão de barra lateral e conteúdo na direita, podemos fazer um componente `dashboard`, que implementa o componente `header-n-footer` e renderiza uma barra lateral e um conteúdo na direita, e para colocarmos coisas nessa barra e nessa área de conteúdo também usaremos `<ng-content>` (isso vai ficar mais claro quando criarmos esse componente).

**Uuuall!! Nós analisamos e descobrimos uma sequência de componentes que podemos criar, e que vão nos ajudar a construir a aplicação, observe:**

- `header-n-footer` um componente que contém:
  - `header` outro componente, para o cabeçalho.
  - `footer` outro componente, para o rodapé.
- `dashboard`
  - `header-n-footer` para renderizar o cabeçalho e rodapé.

### Analisando mais profundamente a página inicial

Página inicial, com as reuniões.
![Imagem 01](https://i.imgur.com/h2aqcx0.png)

Analisando mais profundamente a página inicial, percebemos que temos uma lista de reuniões, cada elemento dessa lista tem uma cor na esquerda, um nome e 3 botões, se você olhar na versão mobile, vai perceber que esses botões são diferentes, de uma olhada lá no Figma para ver.

Esse elemento que mostra um item (uma reunião) nessa lista, pode ser um `componente` que vai ser repetido por um `*ngFor`

## **Resumindo o que precisa ser feito**

Então, percebemos que teremos que criar os seguintes componentes:

- `header` outro componente, para o cabeçalho.
- `footer` outro componente, para o rodapé.
- `header-n-footer` o componente que acopla header e footer juntos.
- `dashboard` o componente que acopla header-n-footer e renderiza uma barra lateral e um conteúdo na direita.
- `meet-snackbar` o componente que renderiza um item da lista de reuniões.

Porém, desses, o `header-n-footer` e o `dashboard` não serão componentes comuns, eles podem ser chamados de **HIGH ORDER COMPONENTS** ou **HOC**, pois eles são componentes que acoplam outros componentes, e que renderizam um `<ng-content>` para que possamos colocar conteúdo dentro deles.

O termo **HOCs** é mais usado no React, mas o conceito é o mesmo, você pode ler mais sobre isso [aqui](https://pt-br.reactjs.org/docs/higher-order-components.html).

Nós vamos coloca-los em uma pasta especial dentro de `shared`, essa pasta se chamara `decorators` assim, esses componentes que "decoram", extendem a "funcionalidade" do site ficarão bem organizados.

## **Partindo para a ação**

Ufaa, agora que entendemos oque precisa ser feito, vamos partir para ação e de fato criar, a jornada a seguir vai ser longa, então pega um café, uma agua, relaxa a mente por 5 minutos, e vamos lá!

![Gif urso filme pixar se acalmando](https://media.giphy.com/media/QXrq8hpKE962x104Eo/giphy.gif)

# Criando o componente header

Primeiro, vamos até a pasta `src/app/shared/components`, aqui, você vai criar um componente comum com o nome de `header`.

## **Modificando o TS**

Para que a aula fique mais dinâmica, vamos dar uma acelerada, e colocar a sua cabeça para raciocinar em cima do código, isso é uma boa coisa, ler um código feito por outra pessoa e entender o que está acontecendo nele!

Então, vamos lá, abra o arquivo `header.component.ts` e vamos começar a entender oque está acontecendo nele.

```typescript
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Input() active: string = "";
  @Input() cssClass: string = "";

  constructor(private route: Router) {}

  navigate(page: string) {
    this.route.navigateByUrl(page);
  }

  getAvatarClass() {
    return this.active === "profile" ? "navActive" : "nav";
  }
}
```

Primeiramente, você vai perceber que temos um `@Input` chamado `active`, esse `@Input` é uma propriedade que vai ser passada para o componente, e que vai ser usada para definir qual botão do menu está ativo, e assim, mudar a cor dele.

Esse componente de botão do menu, você pode ver no Figma, e a cor do icone muda, de acordo com o que estiver ativo:

![Imagem Menu](https://i.imgur.com/uTYwRLS.png)

No constructor, estamos inicializando o `Router`, que é um serviço que vai nos ajudar a navegar entre as páginas da aplicação.

Agora, vamos entender oque está acontecendo no método `navigate`, ele é um método que recebe uma string, e que vai navegar para a rota que foi passada como parâmetro.

Por fim, o método `getAvatarClass` é um método que retorna uma string, e que vai ser usada para definir qual classe CSS vai ser aplicada no avatar, se ele estiver ativo ou não, isso é por que a borda do componente que mostrará o avatar do usuário, é controlada pelo componente `avatar` que criamos, por isso, temos essa função para definir se a página `profile` que vamos criar no futuro está ativa ou não. (Ou seja, ao clicar no avatar que está no header vamos ser direcionados para uma página chamada `profile`, e quando estivermos lá a borda do avatar no header vai ficar azul).

## **Modificando o HTML**

Agora, vamos entender oque está acontecendo no arquivo `header.component.html`, abra o arquivo e vamos lá!

```html
<header [ngClass]="[cssClass]">
  <section class="left">
    <img src="assets/images/logo.svg" alt="Logo Devaria" />
  </section>
  <section class="right">
    <img
      (click)="navigate('/')"
      id="home"
      [class.active]="active === 'meets'"
      src="assets/images/icons/home.svg"
    />
    <img
      id="door"
      src="assets/images/icons/door.svg"
      [class.active]="active === 'meet'"
    />
    <app-avatar
      (click)="navigate('/profile')"
      [classeCss]="getAvatarClass()"
    ></app-avatar>
  </section>
</header>
```

De cima para baixo, o `[ngClass]` é uma diretiva que vai aplicar uma classe CSS no elemento, e essa classe CSS vai ser passada como parâmetro, e vai ser definida no componente que for usar o `header`.

Dentro do `<header>` temos duas `<section>`, uma com a classe `left` e outra com a classe `right`, a `<section>` com a classe `left` é onde fica o logo da aplicação, e a `<section>` com a classe `right` é onde ficam os botões do menu.

Os botões na verdade são imagens, e estamos usando `[class.active]` para definir se a imagem está ativa ou não, e assim, mudar a cor do icone.

Por fim, o avatar, nós estamos usando o componente `avatar` que criamos, e passando a função `getAvatarClass` como parâmetro, para que a borda do avatar fique azul quando a página `profile` estiver ativa.

## **Modificando o SCSS**

Abra o arquivo `header.component.scss` e cole o seguinte:

```scss
@import "/src/styles.scss";

header {
  @include flex(row, space-between, center);
  padding: 12px;
  border-bottom: 1px solid var(--cinza01);

  .left {
    @include flex(column, center, center);
    flex: 1;

    img {
      width: 100%;
      max-width: 120px;
    }
  }

  .right {
    display: none;
    flex: 0;

    #door {
      cursor: auto;
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    min-height: 40px;
    max-height: 40px;

    .left {
      display: block;

      img {
        width: 100%;
        max-width: 180px;
      }

      margin-left: 40px;
    }

    .right {
      @include flex(row, center, center);
      min-width: 200px;
      gap: 30px;

      img {
        width: 30px;
        height: 30px;

        cursor: pointer;

        filter: brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(
            1024%
          ) hue-rotate(121deg) brightness(92%) contrast(80%);

        &.active {
          filter: brightness(0) saturate(100%) invert(79%) sepia(95%) saturate(
              2107%
            ) hue-rotate(118deg) brightness(90%) contrast(79%);
        }
      }

      margin-right: 20px;
    }
  }

  &.profile {
    @media screen and (max-width: $desktopBreakpoint) {
      display: none;
    }
  }
}
```

Vou explicar o SCSS na aula, como sempre!

# Criando o componente footer

Crie um componente com o nome de `footer` na pasta `src/app/shared/components`, assim como você fez com o `header`.

## **Modificando o TS**

Abra o arquivo `footer.component.ts` e cole o seguinte:

```ts
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
  @Input() active: string = "";

  constructor(private route: Router) {}

  navigate(page: string) {
    this.route.navigateByUrl(page);
  }

  getAvatarClass() {
    return this.active === "profile" ? "navActive" : "nav";
  }
}
```

Bem, eu vou deixar você mesmo entender o que está acontecendo aqui, mas básicamente é igualzinho ao que fizemos no `header`.

## **Modificando o HTML**

Abra o arquivo `footer.component.html` e cole o seguinte:

```html
<footer>
  <img
    (click)="navigate('/')"
    id="home"
    [class.active]="active === 'meets'"
    src="assets/images/icons/home.svg"
  />
  <img
    id="door"
    src="assets/images/icons/door.svg"
    [class.active]="active === 'meet'"
    (click)="navigate('/join')"
  />
  <app-avatar
    [classeCss]="getAvatarClass()"
    (click)="navigate('/profile')"
  ></app-avatar>
</footer>
```

Também, compare com o `header`, é básicamente a mesma coisa!

## **Modificando o SCSS**

Abra o arquivo `footer.component.scss` e cole o seguinte:

```scss
@import "/src/styles.scss";

footer {
  @include flex(row, space-evenly, center);
  padding: 8px;
  border-top: 1px solid var(--primaria03);
  background-color: rgba(37, 203, 211, 0.05);

  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  right: 0;

  img {
    width: 30px;
    height: 30px;

    cursor: pointer;

    filter: brightness(0) saturate(100%) invert(27%) sepia(0%) saturate(1024%) hue-rotate(
        121deg
      )
      brightness(92%) contrast(80%);

    &.active {
      filter: brightness(0) saturate(100%) invert(79%) sepia(95%) saturate(
          2107%
        ) hue-rotate(118deg) brightness(90%) contrast(79%);
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    display: none;
  }
}
```

Explicarei o SCSS no vídeo, como sempre!

# Criando o nosso primeiro decorator, o header-n-footer

Bem, agora que temos o `header` e `footer` criados, vamos criar nosso primeiro decorator, mas antes, vamos até o arquivo `src/app/shared/components/shared.module.ts` e vamos colocar os componentes `header` e `footer` no `exports`:

```ts
  exports: [
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    UploadAvatarComponent,
    CtaFooterComponent,
    HeaderComponent,
    FooterComponent,
  ],
```

## **Criando o módulo para os decorators**

Agora, vamos criar um módulo para os decorators, assim como temos um para os componentes, vá até `src/app/shared/decorators` e crie um módulo com o nome de `shared-decorators`, ele é um módulo de componentes comum, ou seja, `Module of components`.

Ao criar, ele vai criar uma pasta chamada `shared-decorators`, dentro da pasta decorators, você vai mover o `shared-decorators.module.ts` para a pasta `decorators` e apagar a pasta `shared-decorators` que foi criada.

Ficando assim:

```bash
├── shared
│   ├── decorators
│   │   └── shared-decorators.module.ts
```

## **Criando o nosso decorator**

Agora, clique com o botão direito em `src/app/shared/decorators` e crie um componente comum, com o nome de `header-n-footer`.

## **Modificando o TS**

Abra o arquivo `header-n-footer.component.ts` e cole o seguinte:

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-header-n-footer",
  templateUrl: "./header-n-footer.component.html",
  styleUrls: ["./header-n-footer.component.scss"],
})
export class HeaderNFooterComponent {
  @Input() active: string = "";
  @Input() cssClass: string = "";
}
```

O decorator vai receber o `active` e o `cssClass` para que possamos passar para o `header` e `footer` e eles possam saber qual página está ativa e qual classe CSS deve ser aplicada.

## **Modificando o HTML**

Abra o arquivo `header-n-footer.component.html` e cole o seguinte:

```html
<app-header [active]="active" [cssClass]="cssClass"></app-header>
<ng-content></ng-content>
<app-footer [active]="active"></app-footer>
```

Você vai ver um erro, isso é por que não importamos o módulo `SharedComponentsModule` em `SharedDecoratorsModule`, então vamos fazer isso, abra o arquivo `src/app/shared/decorators/shared-decorators.module.ts` e cole o seguinte:

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderNFooterComponent } from "./header-n-footer/header-n-footer.component";
import { SharedComponentsModule } from "../components/shared-components.module"; // Adicionamos essa importação

@NgModule({
  declarations: [HeaderNFooterComponent],
  imports: [CommonModule, SharedComponentsModule], // Adicionamos esse SharedComponentsModule
})
export class SharedDecoratorsModule {}
```

## **Modificando o SCSS**

Esse componente não tem estilização.

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif Breaking Bad soltando o microfone](https://media.giphy.com/media/105D9aefNvprfG/giphy.gif)
