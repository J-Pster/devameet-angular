# Explicando e criando a página de login/home

Bem, lembra que eu tinha dito que a aplicação terá a página inicial (ou seja, a rota `/`) sendo a página de login e a página de home de verdade?

Poisé, mas por que disso?
Se liga, entre no https://www.facebook.com/ e veja, se você estiver logado a página inicial aparece, se não tiver, um form de login aparece, isso é um padrão de mercado, e faz até bastante sentido!

Então, como a gente pdoe fazer esse tipo de coisa aqui no Angular?
Bem, como nós já vimos, componentes podem ser reaproveitados em quantas páginas quisermos, a questão é que páginas também são componentes, então eu posso literalmente renderizar uma página dentro da outra, tranquilamente.

A ideia será a seguinte, vamos criar 3 páginas, a `login` a `meets` e a `home`, a página de `login` e `meets` serão páginas de verdade, uma com o login e a outra com a página inicial do projeto, agora, a página `home` é quem conterá a lógica de mostrar ou uma ou outra, e também será ela que estará configurada para a rota `/` da aplicação.

Então, dentro da `home` vamos ter literalmente isso aqui no HTML:

```html
<app-login *ngIf="pageToRender === 'login'"></app-login>
<app-meets *ngIf="pageToRender === 'meet'"></app-meets>
```

Como pode ver, é literalmente uma estrutura condicional, que ou renderiza `login` ou `meets`.

# Criando as páginas login, meets e home

## Criando a página meets

Primeiro, vamos até `src/app/pages` e vamos criar uma pasta chamada `meet`.

Dentro dela, vamos criar duas pastas, uma chamada `components` e outra chamada `pages`, a estrutura de pastas vai ficar assim:

```bash
├── meet
│   ├── components
│   └── pages
```

Agora vamos usar o CLI.

Clique com o botão direito em `meet/pages` e crie um módulo, com o nome de `meets`.

Clique com o botão direito em `meet/pages` e crie um componente, sim, um componente! Com o nome de `meets`.

A sua estrutura de pastas deve ficar assim:

```bash
├── meet
│   ├── components
│   └── pages
│       └── meets
│           ├── meets.component.scss
│           ├── meets.component.html
│           ├── meets.component.spec.ts
│           ├── meets.component.ts
│           └── meets.module.ts
```

**Ufa, esse era o mais chato de criar!**

## Criando a página login

Essa é simples, vá em `src/app/pages`, clique com o botão direito e crie um módulo com o nome de `login`, e depois, em `src/app/pages` crie um componente com o nome de `login`.

Sua estrutura de pastas deve ficar assim:

```bash
├── login
│   ├── login.component.scss
│   ├── login.component.html
│   ├── login.component.spec.ts
│   ├── login.component.ts
│   └── login.module.ts
```

**Por que a gente tá criando um módulo e um componente?** Porque, assim, a gente consegue importar o módulo login ou o módulo meets para aonde quisermos, se não criassemos um módulo, a página ia ser importada para dentro de `app.module.ts`, e isso não é o que queremos.

## Criando a página de home

Essa é a mais fácil, vá até `src/app/pages` e crie um módulo com nome de `home`, escolha `Lazy-loaded module of pages` e clique em `Confirm`.

A sua estrutura de pastas deve ficar assim:

```bash
├── home
│   ├── home-routing.module.ts
│   ├── home.component.html
│   ├── home.component.scss
│   ├── home.component.spec.ts
│   ├── home.component.ts
│   └── home.module.ts
```

**Finalmente! Nossas pastas estão criadas, agora vamos editar as páginas!**

# Modificando a página de home

A primeira coisa que precisamos fazer é exportar as páginas `login` e `meets`, lembrem, precisamos escolher o que vamos exportar de um módulo.

Vá até `src/app/pages/login/login.module.ts` e adicione o `LoginComponent` no `exports`:

```ts
@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule],
  exports: [LoginComponent],
})
export class LoginModule {}
```

Agora, vá até `src/app/pages/meet/pages/meets/meets.module.ts` e adicione o `MeetsComponent` no `exports`:

```ts
@NgModule({
  declarations: [MeetsComponent],
  imports: [CommonModule],
  exports: [MeetsComponent],
})
export class MeetsModule {}
```

Agora, vamos voltar para `src/app/pages/home` e vamos modificar algumas coisinhas.

## **Modificando o Módulo**

Primeiro, vamos importar os módulos `LoginModule` e `MeetsModule`:

```ts
import { LoginModule } from "../login/login.module";
import { MeetsModule } from "../meet/pages/meets/meets.module";
```

Agora, vamos adicionar eles no `imports`:

```ts
@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, LoginModule, MeetsModule],
})
export class HomeModule {}
```

## **Modificando o TS**

Vamos até `home.component.ts` , e vamos substituir as importações por essas aqui:

```ts
import { Component, OnInit } from "@angular/core";
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { UserService } from "src/app/services/user/user.service";

// ...
```

Agora, vamos criar uma variável chamada `pageToRender`, e vamos montrar nosso constructor:

```ts
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  pageToRender: "login" | "meet" = "meet";

  constructor(
    private localStorage: LocalstorageService,
    private userService: UserService
  ) {}
}
```

O que fazemos aqui é dizer que a variável `pageToRender` pode ser `login` ou `meet`, e vamos inicializar ela com `meet`.

E no constructor, estamos instanciando nossos services, os que vamos usar no caso.

Ah, e também implementamos o `OnInit`, que é uma interface do Angular.

Agora, vamos fazer uma função auxiliar para checar o token:

```ts
  private async checkToken(): Promise<void> {
    const response = await this.userService.getUser();

    if (!response.id) {
      this.pageToRender = 'login';
      this.localStorage.setLogout();
      return;
    }

    this.pageToRender = 'meet';
  }
```

O que essa função faz, é basicamente, pegar o usuário usando o service de `user`, depois, chegar se veio um ID, se não tiver vindo significa que não tem usuário no `localStorage`, e se não tiver ele vai fazer logout e vai mostrar a página de login, se tiver, ele vai mostrar a página de meet.

Agora, vamos implementar a função `ngOnInit`:

```ts
  ngOnInit(): void {
    const token = this.localStorage.getToken();

    if (!token) {
      this.pageToRender = 'login';
      this.localStorage.setLogout();
      return;
    }

    this.checkToken();
  }
```

Você deve estar se perguntando, poxa joão, isso é repetitivo, e de fato, é mesmo, o que eu faço aqui é a mesma coisa que `checkToken()` faz, mas dessa vez usando o service de `localStorage`.

## **Modificando o HTML**

Ele é bem simples, adicione a condicional e pronto:

```html
<app-login *ngIf="pageToRender === 'login'"></app-login>
<app-meets *ngIf="pageToRender === 'meet'"></app-meets>
```

## **Modificando o SCSS**

Esse componente não tem estilização.

## **Modificando o App Routing**

Bem, agora vamos até `src/app/app-routing.module.ts`, e você pode observar o que aconteceu:

```ts
const routes: Routes = [
  {
    path: "register",
    canActivate: [RegisterGuard],
    loadChildren: () =>
      import("./pages/register/register.module").then((m) => m.RegisterModule),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomeModule),
  },
];
```

O Angular criou a rota `home` para nós, e agora, vamos modificar ela, para `''`.

```ts
const routes: Routes = [
  {
    path: "register",
    canActivate: [RegisterGuard],
    loadChildren: () =>
      import("./pages/register/register.module").then((m) => m.RegisterModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/home/home.module").then((m) => m.HomeModule),
  },
];
```

Se você iniciar a aplicação agora, e ir para `http://localhost:4200/`, você vai ver que a página de login vai aparecer, escrito `login works!`.
