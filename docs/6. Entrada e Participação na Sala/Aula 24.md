# Criando a página de entrada do mobile

Na versão de celular tem uma página especialpara facilitar a entrada de usuários desse tamanho de tela a entrarem na sala de reunião, de uma olhadinha:

![Entrada Mobile](https://i.imgur.com/OkUAMon.png)

Essa é a página mais fácil que vamos fazer no curso, será basicamente um reaproveitamento da `<app-dashboard>` que vamos colocar um texto, um input e um botão.

Vá até `src/app/pages/meet/pages` e crie um módulo chamado `link-meet` com o tipo `Lazy-loaded module of pages`.

## **Modificando o Módulo**

Vá até o arquivo `link-meet.module.ts` e adicione o seguinte código:

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LinkMeetRoutingModule } from "./link-meet-routing.module";
import { LinkMeetComponent } from "./link-meet.component";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";

@NgModule({
  declarations: [LinkMeetComponent],
  imports: [
    CommonModule,
    LinkMeetRoutingModule,
    SharedDecoratorsModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
})
export class LinkMeetModule {}
```

Nós só estamos importando alguns módulos que vamos precisar.

## **Modificando o TS**

Vá até o arquivo `link-meet.component.ts` e adicione o seguinte código:

```typescript
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/local/localstorage.service";

@Component({
  selector: "app-link-meet",
  templateUrl: "./link-meet.component.html",
  styleUrls: ["./link-meet.component.scss"],
})
export class LinkMeetComponent implements OnInit {
  nome: string = "";
  form: FormGroup;

  constructor(
    private localStorageService: LocalstorageService,
    private fb: FormBuilder,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      link: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.nome = this.localStorageService.getItem("name") || "Usuário";
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  joinMeet() {
    if (this.form.invalid) {
      this._snackBar.open("Link inválido!", "OK", {
        duration: 2000,
        verticalPosition: "top",
      });
      return;
    }

    const link = this.form.value.link;
    this.route.navigateByUrl(`/meet/${link}`);
  }
}
```

Observe, basicamente criamos um form só para controlar o link que o usuário vai digitar, um `ngOnInit` para pegar o nome do usuário que vamos exibir na tela, um `getFormRef` para controlar o input e por fim a função do botão, que é basicamente redirecionar o usuário para a sala de reunião.

## **Modificando o HTML**

Vá até o arquivo `link-meet.component.html` e adicione o seguinte código:

```html
<app-dashboard active="meet">
  <div class="userInfos" left>
    <h1>Reunião</h1>
    <h3>Olá, {{ nome }}!</h3>
  </div>
  <div class="form" left>
    <app-input
      tipo="text"
      placeholder="Id da Reunião (xxx-xxxx-xxx)"
      imagem="assets/images/icons/link.svg"
      [referenciaFormulario]="getFormRef('link')"
    ></app-input>
    <app-button
      texto="Entrar"
      cor="primaria"
      (click)="joinMeet()"
      classeCss="join"
    ></app-button>
  </div>
</app-dashboard>
```

Simples, não é? Estamos apenas usando o `<app-dashboard>` e colocando um texto, um input e um botão.

## **Modificando o SCSS**

Vá até o arquivo `link-meet.component.scss` e adicione o seguinte código:

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

.form {
  padding: 32px;
  width: calc(100% - 64px);
}
```

# Modificando as Rotas

Depois de criamos essa linda página, vamos configurar as rotas corretamente, vá até `src/app/app-routing.module.ts`, e procure por `routes`, dentro, procure por `link-meet` e altere para:

```typescript
const routes: Routes = [
  //..
  {
    path: "join",
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import("./pages/meet/pages/link-meet/link-meet.module").then(
        (m) => m.LinkMeetModule
      ),
  },
  //..
];
```

Pronntinho, se você for no modo mobile e clicar no icone de porta no rodapé você vai ser direcionado para essa página!
