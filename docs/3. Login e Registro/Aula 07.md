# Criando a página de Login e Registro

Não sei se vocês perceberam, mas agora já temos tudo que é necesário para fazer as páginas de Login e Registro, basta dar uma olhadinha no Figma.

Temos os componentes de Input, Button, Avatar, UploadAvatar e o Cta Footer, agora vamos observar no figma o seguinte:

![Registro](https://i.imgur.com/jUEjf5v.png)
![Login](https://i.imgur.com/7RpdXDL.png)

Tanto a página de registro, como a página de Login, tem essa mesma estrutura, o que muda, na verdade, é somente a parte da direita, que hora é o formulário de registro, e hora é o formulário de login.

Então, nós podemos criar um componente reaproveitável, para utiliza-lo nessas duas páginas, nós vamos o chamar de `publica` e ele ficará dentro da pasta de `pages` que por sua vez fica dentro da pasta de `shared`, ou seja, será uma págian compartilhada!

# Criado a página publica

A primeira coisa, como nós não criamos nenhuma página compartilhada ainda, é criar um módulo, o módulo das páginas compartilhadas, dentro de `shared/pages`, crie o módulo `shared-pages.module.ts`, você pode fazer da mesma forma como fizemos com o `shared-components.module.ts`, se não se lembra, volte lá atrás e veja novamente.

Agora, vamos criar o componente `publica`, dentro da pasta de `shared/pages`, isso você já sabe fazer, então vamos lá.

## **Modificando o TS**

Agora, vamos modificar o `publica.component.ts`:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-publica",
  templateUrl: "./publica.component.html",
  styleUrls: ["./publica.component.scss"],
})
export class PublicaComponent {
  @Input() classeCssCustomizada: string = "";
  @Input() classeCssLogo: string = "";
  @Input() textoBotaoSubmit?: string;
  @Output() submiterFormulario: EventEmitter<any> = new EventEmitter();

  public aoSubmeter() {
    this.submiterFormulario.emit();
  }
}
```

Aqui nós vemos pela primeira vez o `@Output()` com um `EventEmitter`, o EventEmitter é um objeto que nos permite emitir eventos, e o `@Output()` é um decorator que nos permite receber esse evento, e o `submiterFormulario` é o nome do evento, que nós vamos emitir quando o usuário clicar no botão de submit do formulário.

A função `aoSubmeter()` é a função que nós vamos chamar quando o usuário clicar no botão de submit do formulário, e ela vai emitir o evento `submiterFormulario`, através do `this.submiterFormulario.emit()`.

## **Modificando o HTML**

Agora, vamos modificar o `publica.component.html`:

```html
<section [ngClass]="['containerPaginaPublica', classeCssCustomizada]">
  <div [ngClass]="['containerLogo', classeCssLogo]">
    <img src="assets/images/logo.svg" alt="Logo Devaria" class="logo" />
  </div>

  <div class="containerConteudo">
    <form>
      <ng-content select="[conteudoFormulario]"></ng-content>

      <app-button
        [texto]="textoBotaoSubmit"
        type="submit"
        classeCss="botaoPublico"
        (click)="aoSubmeter()"
      ></app-button>
    </form>

    <ng-content select="[rodape]"></ng-content>
  </div>
</section>
```

Nós já vimos o `ng-content` em outros componentes, e aqui nós vamos usar ele para receber o conteúdo que nós vamos passar para o componente `publica`, a questão é que aqui temos dois `mg-content` e para diferenciar para qual deles nós vamos passar o conteúdo, nós vamos usar o `select`, que é um atributo do `ng-content`, e nós vamos passar o nome do seletor que nós vamos usar, e o seletor é o nome que nós vamos dar para o conteúdo que nós vamos passar para o componente, vocês vão entender isso quando usarmos o componente `publica`.

E agora vocês devem se reparar com um erro ao tentar usar `app-button`, e isso acontece porque nós não importamos o `SharedComponentsModule` no `SharedPagesModule`, então vamos fazer isso agora.

`shared-pages.module.ts`:

```typescript
// Outras importações
import { SharedComponentsModule } from "../components/shared-components.module";

@NgModule({
  declarations: [PublicaComponent],
  imports: [CommonModule, SharedComponentsModule],
})
export class SharedPagesModule {}
```

## **Modificando o SCSS**

Agora, vamos modificar o `publica.component.scss`:

```scss
@import "/src/styles.scss";

.containerPaginaPublica {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0px 32px;
  background-color: var(--branco);

  .containerConteudo {
    width: 100%;
  }

  .containerLogo {
    display: flex;
    justify-content: center;

    .logo {
      width: 100%;
      max-width: 320px;
    }

    margin-bottom: 40px;

    &.cadastro {
      display: none;
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    flex-direction: row;
    padding: 0px 140px;
    gap: 40px;

    .containerLogo {
      flex: 2;
      height: 40%;

      margin-bottom: 0;

      .logo {
        width: 100%;
        max-width: 450px;
      }

      &.cadastro {
        display: flex;
      }
    }

    .containerConteudo {
      flex: 1;
      border: 1px solid var(--primaria03);
      border-radius: 26px;
      padding: 55px;
    }
  }
}
```

Pronto! Agora nós já temos o componente `publica` pronto, e agora vamos preparar as rotas na nossa aplicação.

# Criando a rota para a página de registro

Agora vamos entender uma coisa, nossa aplicação terá muitas páginas, e para isso vamos separar elas por rotas, `/login`, `/registro`, `/meet` e por ai vai.

A primeira coisa para se criar uma rota, é criar a página que será exibida, no caso, o que vamos fazer será criar um módulo de páginas lazy-load.

Dentro de `src/pages`, observação, não estamos mais em `shared`, clique com o botão direito em `src/pages` e selecione `Angular: Generate Module`, coloque o nome de `register` e aperte `Enter`, agora, terão algumas opções, selecione `Lazy-loaded module of pages`, agora escolha `Confirm`.

Se deu tudo certo, uma pasta chamada `register` deve ter sido criada dentro de `src/pages`, e dentro dessa pasta deve ter vários arquivos, como `register-routing`, `register.module`, `register.component`, `register.component.html`, `register.component.scss` e `register.component.spec`.

Agora, vamos até `shared-pages.module.ts` e vamos exportar o `RegisterModule`:

```typescript
// Importações...

@NgModule({
  declarations: [PublicaComponent],
  imports: [CommonModule, SharedComponentsModule],
  exports: [PublicaComponent],
})
export class SharedPagesModule {}
```

## **Modificando o App para aceitar rotas**

Se você observar em `src/app-routing.module.ts` vai ver que dentro da constante routes foi criada uma nova rota, deve ser algo como isto:

```typescript
const routes: Routes = [
  {
    path: "register",
    loadChildren: () =>
      import("./pages/register/register.module").then((m) => m.RegisterModule),
  },
];
```

Agora, vamos para `app-component.html` e vamos adicionar um `router-outlet`:

```html
<router-outlet></router-outlet>
```

Deixe somente o `router-outlet` no `app.component.html`.

Agora, se navegarmos para `localhost:4200/register`, deve aparecer uma página em branco, escrito `register works!`.

Essa parte de modificar o app para aceitar rotas só será feita uma vez, das próximas vezes vamos mecher somente em `src/app-routing.module.ts` para ajustar as rotas, e adicionar coisas chamadas `guards`, que são coisas que vão proteger as rotas, e vamos ver isso mais pra frente.
