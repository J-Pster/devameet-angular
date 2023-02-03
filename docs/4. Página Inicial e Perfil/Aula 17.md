# Criando o decorator dashboard

Agora, vamos para o último decorator, crie um componente comum chamado de `dashboard` na pasta `src/app/shared/decorators`.

## **Modificando o TS**

Cole o seguinte código no `dashboard.component.ts`:

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {
  @Input() active: string = "";
}
```

Observe, ele é bem simples, só recebe o `active` e vai passar ele para o `header-n-footer` para que ele possa marcar o item ativo no menu.

## **Modificando o HTML**

Cole o seguinte código no `dashboard.component.html`:

```html
<app-header-n-footer [active]="active">
  <section>
    <div class="left">
      <ng-content select="[left]"></ng-content>
    </div>
    <div class="right">
      <ng-content select="[right]"></ng-content>
    </div>
  </section>
</app-header-n-footer>
```

Observe, que aqui, estamos usando o decorator que acabamos de criar, o `header-n-footer`, depois disso a gente cria uma `<section>` que conterá o estilo do fundo, aquele fundo azul com um desenho bonito, e por fim, temos `<div>`, que será a barra da esquerda e o conteúdo da direita.

Você vai ver a mágica acontecendo no SCSS!

## **Adicionando o background.svg**

Pode ser que você ainda não tenha o background na sua pasta de assets, então, crie um arquivo chamado `background.svg` em `src/assets/images` e cole o seguinte código:

```svg
<svg width="1440" height="788" viewBox="0 0 1440 788" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.05" width="1440" height="788" fill="#25CBD3"/>
<path d="M13.9962 540.043L-274.09 706.369C-325.393 735.989 -390.95 718.423 -420.569 667.12C-450.189 615.818 -432.623 550.261 -381.32 520.641L-93.234 354.314C-41.9314 324.695 23.6254 342.261 53.2449 393.563C82.8645 444.866 65.2988 510.423 13.9962 540.043Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M990.532 -23.7659L274.76 389.485C223.458 419.105 157.9 401.538 128.281 350.236C98.6613 298.933 116.228 233.376 167.53 203.757L883.302 -209.494C934.604 -239.114 1000.16 -221.548 1029.78 -170.245C1059.18 -118.818 1041.83 -53.3852 990.532 -23.7659Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M935.776 403.521L220.004 816.773C168.702 846.392 103.145 828.826 73.5255 777.524C43.9059 726.221 61.4719 660.664 112.774 631.045L828.546 217.794C879.849 188.174 945.406 205.74 975.025 257.042C1004.43 308.47 986.862 374.027 935.776 403.521Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M1473.44 486.749L757.672 900C706.37 929.619 640.813 912.053 611.193 860.75C581.573 809.448 599.139 743.891 650.442 714.272L1366.21 301.02C1417.52 271.401 1483.07 288.967 1512.69 340.269C1542.31 391.572 1524.75 457.129 1473.44 486.749Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M245.649 16.682L-164.911 253.719C-216.214 283.339 -281.771 265.773 -311.391 214.471C-341.01 163.168 -323.444 97.6107 -272.142 67.9911L138.419 -169.046C189.722 -198.666 255.279 -181.1 284.899 -129.797C314.518 -78.4945 296.952 -12.9375 245.649 16.682Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M1294.3 196.526L1206.51 247.212C1155.21 276.832 1089.65 259.266 1060.03 207.963C1030.41 156.661 1047.98 91.1038 1099.28 61.4843L1187.07 10.7978C1238.37 -18.8218 1303.93 -1.25607 1333.55 50.0465C1363.17 101.349 1345.6 166.906 1294.3 196.526Z" stroke="#25CBD3" stroke-width="0.3"/>
<path d="M1502.77 863.478L1375.96 936.691C1324.66 966.311 1259.1 948.745 1229.48 897.443C1199.86 846.14 1217.43 780.583 1268.73 750.963L1395.54 677.75C1446.84 648.13 1512.4 665.696 1542.02 716.998C1571.42 768.427 1554.07 833.859 1502.77 863.478Z" stroke="#25CBD3" stroke-width="0.3"/>
</svg>
```

## **Modificando o SCSS**

Cole o seguinte código no `dashboard.component.scss`:

```scss
@import "/src/styles.scss";

section {
  @include flex(row, flex-start, flex-start);

  background-image: url("../../../../assets/images/background.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: calc(100vh - 100px);

  .left {
    background-color: #fff;
    border-right: 1px solid var(--cinza01);

    height: 100%;
    flex-grow: 1;

    @include flex(column, flex-start, flex-start);
  }

  .right {
    display: none;
  }

  @media screen and (min-width: $desktopBreakpoint) {
    height: calc(100vh - 65px);

    .left {
      flex-grow: 0;
      width: 360px;
    }

    .right {
      @include flex(column, center, center);
      flex-grow: 1;

      height: 100%;
    }
  }
}
```

Vou explicar o SCSS no vídeo viu!

## **Modificando o módulo**

Com nossos dois decorators criados, vamos modificar o módulo `shared-decorators.module.ts` que está na pasta de `shared/decorators`, para exportar os decorators que criamos.

Cole o seguinte código no `shared-decorators.module.ts`:

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderNFooterComponent } from "./header-n-footer/header-n-footer.component";
import { SharedComponentsModule } from "../components/shared-components.module";
import { DashboardComponent } from "./dashboard/dashboard.component";

@NgModule({
  declarations: [HeaderNFooterComponent, DashboardComponent],
  imports: [CommonModule, SharedComponentsModule],
  exports: [HeaderNFooterComponent, DashboardComponent],
})
export class SharedDecoratorsModule {}
```

# Finalmente, vamos criar a nossa página de home

Agora, que temos quase tudo (só falta o componente `meet-snackbar`), vamos editar a página `meets` que nós criamos, para podermos ver como está ficando.

Vá até `src/app/pages/meet/pages/meets`

## **Modificando o Módulo**

Primeiro, vamos até o módulo `meets.module.ts` e vamos importar o `SharedDecoratorsModule` e o `SharedComponentsModule`:

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeetsComponent } from "./meets.component";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";

@NgModule({
  declarations: [MeetsComponent],
  imports: [CommonModule, SharedDecoratorsModule, SharedComponentsModule],
  exports: [MeetsComponent],
})
export class MeetsModule {}
```

## **Modificando o TS**

Agora, vamos para o `meets.component.ts` e vamos importar o que vamos usar:

```ts
import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { MeetService } from "src/app/services/meet/meet.service";
import { Meet } from "src/app/types/meet.type";
```

Perceba que importamos o `Router`, alguns services e o tipo `Meet` que criamos lá no começo desse curso.

Agora, vamos criar o nosso `constructor`:

```ts
  nome = 'Usuário';
  meetings: Meet[] = [];

  selectedMeet: Meet = {} as Meet;
  // objectsFromMeet: any = [];

  constructor(
    private localStorageService: LocalstorageService,
    private meetService: MeetService,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {}
```

Perceba que também criamos algumas variáveis, a `nome` vai guardar o nome do usuário que será exibido na tela, a `meetings` vai guardar as reuniões do usuário, a `selectedMeet` vai guardar qual reunião está selecionada, vamos usar isso de verdade mais pra frente, e a `objectsFromMeet` está comentada pois vamos usar mais pra frente.

Vamos implementar alguns métodos agora:

```ts
// Constructor ...
  notLoaded(): void {
    this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  selectMeet(meet: Meet) {
    this.selectedMeet = meet;

    // Local para implementar o meet service e usar o objectsFromMeet
  }
```

Aqui, o método `notLoaded` é usado somente para abrir uma Snack Bar, o método `selectMeet` seleciona uma meet, e mais pra frente vamos implementar mais algumas coisas aqui.

Mais pra frente será implementado a pré-visualização da sala, que vai aparecer no lado direito, mas não vamos fazer isso agora.

Agora, vamos implementar mais algumas coisas:

```ts
  // selectMeet ...

  ngOnInit() {
    this.nome = this.localStorageService.getItem('name') || 'Usuário';
    this.getMeets();
  }

  createMeet() {
    this.route.navigateByUrl('/new');
  }

  joinMeet() {
    this.route.navigate(['meet', this.selectedMeet.link]);
  }

  private getMeets() {
    this.meetService.getMeets().then((res) => {
      this.meetings = res;
    });
  }
```

O que temos aqui é o seguinte.

- A `ngOnInit` pega o nome do usuário do localStorage e executa a função `getMeets` que vai pegar as reuniões do usuário.
- O `createMeet` redireciona o usuário para a página de criação de reunião.
- O `joinMeet` redireciona o usuário para a reunião selecionada.
- O `getMeets` pega as reuniões do usuário e coloca na variável `meetings`.

Percebam que `createMeet` e `joinMeet` são parecidas, ambas usam router, mas usam funções diferentes do Router, a `createMeet` usa `navigateByUrl` e a `joinMeet` usa `navigate`.

A `navigateByUrl` recebe uma string com o caminho que você quer ir, e a `navigate` recebe um array com o caminho que você quer ir, cada posição desse array é um pedaço, que no final é montado assim: `[0]/[1]/[2]/...`, e o segundo parâmetro é um objeto com os parâmetros que você quer passar para a página.

## **Modificando o HTML**

Agora, vamos para o `meets.component.html` e vamos começar a mexer nele:

```html
<app-dashboard active="meets">
  <div class="userInfos" left>
    <h1>Minhas Reuniões</h1>
    <h3>Olá, {{ nome }}!</h3>
    <img
      id="new"
      src="assets/images/icons/plus-square.svg"
      (click)="createMeet()"
    />
  </div>
  <div left *ngIf="meetings.length > 0; else noMetings" class="meetings">
    <-- Local para colocar o componente meet-snackbar -->
  </div>
  <ng-template #noMetings left>
    <div class="noMeetings">
      <img src="assets/images/carinha.svg" />
      <p>Você ainda não possui reuniões criadas :(</p>
    </div>
  </ng-template>
  <-- Local para colocar o componente de exibir a reunião na direita -->
</app-dashboard>
```

Perceba que a primeira coisa que temos é uma `<div>` sendo passada para a `left`, lembre-se, `left` é uma referência, para que o `<app-dashboard>` saiba que ele tem que renderizar isso no `<ng-content>` da esquerda.

Temos 3 divs sendo passadas para `left`, a primeira, com classe `userInfos` são as informações do usuário e o botão para criar uma nova reunião.

A com clase `meetings` é onde vai ficar as reuniões, a lista de reuniões, e observe que essa tem um `*ngIf`, essa condição é para verificar se o usuário tem reuniões, se tiver, ele renderiza a lista de reuniões, se não tiver, ele renderiza o `ng-template` com o `#noMetings`, que é o que temos abaixo.

O `ng-template` é um jeito de renderizar algo sem que ele fique no DOM, ou seja, ele não fica no HTML, ele fica no TypeScript, e só é renderizado quando é chamado.

Abaixo do `ng-template` temos um espaço que só será usado mais para frente.

## **Modificando o SCSS**

Agora, vamos para o `meets.component.scss` e vamos começar a mexer nele:

```scss
@import "/src/styles.scss";

.userInfos {
  @include flex(column, center, flex-start);

  width: calc(100% - 40px);
  padding: 20px;
  border-bottom: 1px solid var(--cinza01);
  position: relative;

  h1,
  h3 {
    margin: 0;
  }

  h1 {
    font-size: 12px;
    font-weight: 600;
    color: var(--cinza02);
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: var(--primaria03);
  }

  #new {
    display: none;
  }

  @media screen and (min-width: $desktopBreakpoint) {
    #new {
      display: block;
      position: absolute;
      right: 18px;
      bottom: 18px;

      user-select: none;

      cursor: pointer;
    }
  }
}

.meetings {
  @include flex(column, center, center);
  width: 100%;

  app-meet-snackbar {
    width: 100%;
  }
}

.noMeetings {
  @include flex(column, center, center);
  margin-top: 70px;

  width: 100%;

  p {
    font-size: 14px;
    font-weight: 600;
    color: var(--cinza02);
  }

  img {
    user-select: none;
    pointer-events: none;
  }
}

.preview-container {
  @include flex(column, center, center);
  position: relative;

  .preview {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 30;
    background-color: rgba(0, 0, 0, 0.5);

    position: absolute;

    img {
      width: 70px;
      position: relative;
      margin-bottom: 28px;
      cursor: pointer;

      filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%)
        hue-rotate(288deg) brightness(102%) contrast(102%);
    }

    button {
      width: 50%;
      padding: 16px;
      border: 2px solid white;
      border-radius: 8px;
      background-color: transparent;

      font-size: 16px;
      font-weight: 600;
      color: white;

      cursor: pointer;
    }
  }
}
```

Esse é um dos maiores SCSS de todo o projeto, não se preocupe, vou explicar na aula!

# Criando o componente meet-snackbar

Nossa página de home está quase pronta, e inclusive já pode ser usada, o único problema é que não conseguimos listar as reuniões do usuário, por enquanto, já que falta um componente, é o que vamos criar agora.

## **Criando o componente**

Dentro de `src/app/pages/meets/components` crie um módulo com o nome de `meet-components`, ele é um módulo comum.

Então, ele vai criar uma pasta `meet-components` e dentro dela um arquivo `meet-components.module.ts`, mova esse arquivo para `src/app/pages/meets/components`, e apague a pasta `meet-components`.

A estrutura vai ficar assim:

```bash
src
└── app
    └── pages
        └── meets
            └── components
                └── meet-components.module.ts
```

Agora, crie um componente com o nome de `meet-snackbar` na pasta `meet/components`, ele vai ser um componente comum.

O motivo desses componentes estarem separados, é que eles pertencem somente as reuniões.

## **Modificando o TS**

Agora, vamos para o `meet-snackbar.component.ts` e vamos começar importando uma coisa que precisamos:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Meet } from "src/app/types/meet.type";

import { MatDialog } from "@angular/material/dialog";
import { MeetService } from "src/app/services/meet/meet.service";

// ...
```

Agora, vamos criar o componente e seu construtor:

```typescript
@Component({
  selector: "app-meet-snackbar",
  templateUrl: "./meet-snackbar.component.html",
  styleUrls: ["./meet-snackbar.component.scss"],
})
export class MeetSnackbarComponent {
  @Input() meet!: Meet;
  @Input() selected: boolean = false;

  @Output() onSelectMeet: EventEmitter<Meet> = new EventEmitter<Meet>();

  mobile = window.innerWidth < 992;

  constructor(
    private route: Router,
    // private meetService: MeetService,
    private _snackBar: MatSnackBar // private dialog: MatDialog
  ) {}
}
```

Perceba, aqui estamos recebendo a reunião (`meet`), e se ela está selecionada ou não (`selected`), e também estamos emitindo um evento, que é o `onSelectMeet`, que vai ser usado mais para frente.

Além disso, criamos uma variável chamada `mobile`, que vai ser usada para verificar se o usuário está usando um dispositivo móvel, se ele estiver, vamos desabilitar uma certa função, a de selecionar a reunião.

Vamos implementar mais alguns métodos;

```typescript
  selectMeet() {
    if (this.mobile) return;

    this.onSelectMeet.emit(this.meet);
  }

  copyLink() {
    const domain = document.location.hostname;
    const link = `https://${domain}/meet/${this.meet.link}`;

    navigator.clipboard.writeText(link);
    this._snackBar.open('Link copiado!', 'Fechar', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
```

Observe, implementamos a `selectMeet` que vai selecionar a reunião a ser previsualizada, isso vai ser implementado de verdade mais pra frente.

E também implementamos a `copyLink`, que vai copiar o link da reunião para o clipboard do usuário, e vai mostrar uma snackbar dizendo que o link foi copiado.

Agora, mais algumas funções:

```ts
  editMeet() {
    this.route.navigate(['edit', this.meet.id]);
  }

  deleteMeet() {
    // Local para implementar o modal de confirmar deleção
  }

  joinMeet() {
    this.route.navigate(['meet', this.meet.link]);
  }
```

Agora, implementamos `editMeet` e `joinMeet` que simplesmente redirecionam o usuário, já a `deleteMeet` será implementada em breve, e vai funcionar abrindo um modal que vai perguntar se o usuário quer mesmo deletar a reunião.

Por fim, seu arquivo `meet-snackbar.component.ts` deve ficar assim:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Meet } from "src/app/types/meet.type";

import { MatDialog } from "@angular/material/dialog";
import { MeetService } from "src/app/services/meet/meet.service";

@Component({
  selector: "app-meet-snackbar",
  templateUrl: "./meet-snackbar.component.html",
  styleUrls: ["./meet-snackbar.component.scss"],
})
export class MeetSnackbarComponent {
  @Input() meet!: Meet;
  @Input() selected: boolean = false;

  @Output() onSelectMeet: EventEmitter<Meet> = new EventEmitter<Meet>();

  mobile = window.innerWidth < 992;

  constructor(
    private route: Router,
    // private meetService: MeetService,
    private _snackBar: MatSnackBar // private dialog: MatDialog
  ) {}

  selectMeet() {
    if (this.mobile) return;

    this.onSelectMeet.emit(this.meet);
  }

  copyLink() {
    const domain = document.location.hostname;
    const link = `https://${domain}/meet/${this.meet.link}`;

    navigator.clipboard.writeText(link);
    this._snackBar.open("Link copiado!", "Fechar", {
      duration: 2000,
      verticalPosition: "top",
    });
  }

  editMeet() {
    this.route.navigate(["edit", this.meet.id]);
  }

  deleteMeet() {
    // Local para implementar o modal de confirmar deleção
  }

  joinMeet() {
    this.route.navigate(["meet", this.meet.link]);
  }
}
```

## **Modificando o HTML**

Agora, vamos para o `meet-snackbar.component.html` e vamos colocar o seguinte:

```html
<div class="meet">
  <div class="left">
    <div class="colorBar" [style.color]="meet.color"></div>
    <h2 (click)="selectMeet()" [style.color]="selected ? meet.color : ''">
      {{ meet.name }}
    </h2>
  </div>
  <div class="right">
    <img
      id="door"
      src="assets/images/meeting-icons/door.svg"
      (click)="joinMeet()"
    />
    <img
      id="copy"
      src="assets/images/meeting-icons/copy.svg"
      (click)="copyLink()"
    />
    <img
      id="edit"
      src="assets/images/meeting-icons/edit.svg"
      (click)="editMeet()"
    />
    <img
      id="trash"
      src="assets/images/meeting-icons/trashcan.svg"
      (click)="deleteMeet()"
    />
  </div>
</div>
```

Tire um tempo, e analize por você mesmo o que está acontecendo aqui, eu já te expliquei o que cada coisa funciona, tente lembrar, e entender.

## **Modificando o SCSS**

Agora, vamos para o `meet-snackbar.component.scss` e vamos colocar o seguinte:

```scss
@import "/src/styles.scss";

.meet {
  @include flex(row, space-between, center);
  padding: 8px 0;
  margin: 0 8px;

  border-bottom: 0.5px solid #dadada;

  .left {
    @include flex(row, flex-start, center);

    h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: var(--cinza03);

      margin-left: 8px;

      @media screen and (min-width: $desktopBreakpoint) {
        cursor: pointer;
      }
    }

    .colorBar {
      background-color: currentColor;
      width: 6px;
      height: 32px;
      border-radius: 500px;

      &:before {
        display: inline-block;
      }
    }
  }

  .right {
    @include flex(row, flex-end, center);
    gap: 10px;

    img {
      cursor: pointer;
    }

    #edit {
      display: none;
    }

    @media screen and (min-width: $desktopBreakpoint) {
      #door {
        display: none;
      }

      #edit {
        display: block;
      }
    }
  }
}
```

Vou explicar melhor no vídeo!

# Usando o meet-snackbar na página home

Agora que finalmente temos esse nosso componente, vamos implementar ele no lugar dele.

## **Modificando o Módulo**

Primeiro, vá até `src/app/pages/meet/components` e certifique-se que o `MeetSnackbarComponent` está no `exports` do `MeetComponentsModule`.

Se não tiver, adicione:

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeetSnackbarComponent } from "./meet-snackbar/meet-snackbar.component";

@NgModule({
  declarations: [MeetSnackbarComponent],
  imports: [CommonModule],
  exports: [MeetSnackbarComponent],
})
export class MeetComponentsModule {}
```

Agora, vá até `src/app/pages/meet/pages/meets`, abra o `meets.module.ts` e adicione o `MeetComponentsModule` no `imports`:

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MeetsComponent } from "./meets.component";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MeetComponentsModule } from "../../components/meet-components.module";

@NgModule({
  declarations: [MeetsComponent],
  imports: [
    CommonModule,
    SharedDecoratorsModule,
    SharedComponentsModule,
    MeetComponentsModule,
  ],
  exports: [MeetsComponent],
})
export class MeetsModule {}
```

## **Modificando o HTML**

Primeiro, vamos adicionar o `meet-snackbar` no HTML, para de fato começar a funcionar, mesmo que as funções que ele usa não estão 100% completas.

Vá até `src/app/pages/meet/pages/meets/meets.component.html` e adicione o seguinte, dentro da `<div>` de classe `meetings`:

```html
<div left *ngIf="meetings.length > 0; else noMetings" class="meetings">
  <app-meet-snackbar
    *ngFor="let meet of meetings"
    [selected]="selectedMeet.id === meet.id"
    (onSelectMeet)="selectMeet($event)"
    [meet]="meet"
  ></app-meet-snackbar>
</div>
```

Perceba que o comentário que estava ai no lugar de `<app-meet-snackbar>` foi removido, e agora temos o nosso componente.

## **Testando o meet-snackbar**

Não existe uma forma prática da gente testar isso ainda, já que a página de criação de reuniões ainda não foi feita, ou seja, vamos ter que manualmente fazer uma requisição para API, no caso, um `POST`, usando alguma ferramenta como o [Postman](https://www.postman.com/).

Abra o Postman -> Crie uma nova requisição post -> Aponte para http://localhost:porta/api/meet -> Em `Body` selecione `raw` e `JSON` -> Coloque o seguinte:

```json
{
  "name": "Reunião de Alinhamento",
  "color": "FF00AC"
}
```

E clique em `Send`.

Agora, se voltarmos para a página, considerando que você usou um token de autenticação igual ao da sua conta, você deve ver a reunião que você acabou de criar.

Se não entendeu bem o que acabei de fazer, eu vou fazer mais detalhadamente no vídeo.
