# Criando página de criação de sala

Com a página de edição de sala feita, nós temos praticamente tudo que precisamos para fazer essa página, a página de criaçáo de sala é muito parecida, a questão é que ela só tem o formulário de nome e cor da sala, e esse form já foi criado por nós e é um componente.

![Figma - Criação de Sala](https://i.imgur.com/dBIgF4x.png)

A página de criação de sala não está contemplada no Figma, mas vamos lá, vamos fazer ela, é super simples!

Vá até `src/app/pages/meet/pages` e crie um módulo chamado `new-meet`, ele é do tipo `Lazy-loaded module of pages`.

## **Modificando o Módulo**

Primeiro, vamos deixar o módulo pronto para o que precisamos:

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NewMeetRoutingModule } from "./new-meet-routing.module";
import { NewMeetComponent } from "./new-meet.component";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MeetComponentsModule } from "../../components/meet-components.module";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";

@NgModule({
  declarations: [NewMeetComponent],
  imports: [
    CommonModule,
    NewMeetRoutingModule,
    SharedComponentsModule,
    SharedDecoratorsModule,
    MeetComponentsModule,
    MatSnackBarModule,
  ],
})
export class NewMeetModule {}
```

## **Modificando o TS**

A lógica desse componente é super simples, eu vou deixar ela aqui abaixo e você pode ler e entender o que está acontecendo, lembre-se de quando fizemos a página de edição de sala, ler um código feito por outra pessoa e entender é uma das coisas mais importantes que você pode fazer, então, leia e entenda o que está acontecendo:

```typescript
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MeetService } from "src/app/services/meet/meet.service";

@Component({
  selector: "app-new-meet",
  templateUrl: "./new-meet.component.html",
  styleUrls: ["./new-meet.component.scss"],
})
export class NewMeetComponent {
  form: FormGroup;
  selectedColor: string = "#8250C4";

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  onCancel() {
    this.route.navigateByUrl("/");
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this._snackBar.open("Preencha todos os campos corretamente!", "OK", {
        duration: 2000,
        verticalPosition: "top",
      });
      return;
    }

    const formValues = this.form.value;

    this.meetService
      .createMeet({
        name: formValues.name,
        color: this.selectedColor,
      })
      .then(() => {
        this._snackBar.open("Reunião criada com Sucesso!", "OK", {
          duration: 2000,
          verticalPosition: "top",
        });

        setTimeout(() => {
          this.route.navigateByUrl("/");
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || "Erro ao criar reunião!";
        this._snackBar.open(errorMsg, "OK", {
          duration: 6000,
          verticalPosition: "top",
        });
      });
  }
}
```

## **Modificando o HTML**

Agora, vamos deixar o HTML pronto para o que precisamos:

```html
<app-dashboard active="new">
  <app-meet-name-n-color
    left
    title="Nova reunião"
    [nameControl]="getFormRef('name')"
    [selectedColor]="selectedColor"
    (changeColor)="changeColor($event)"
  ></app-meet-name-n-color>
  <div class="buttons" left>
    <app-button
      (click)="onCancel()"
      classeCss="botaoModalAvatar"
      texto="Voltar"
      cor="texto"
    ></app-button>
    <app-button
      (click)="onSubmit()"
      cor="primaria"
      classeCss="botaoModalAvatar"
      texto="Salvar"
    ></app-button>
  </div>
</app-dashboard>
```

Aqui é muito simples, nós já usamos o `app-meet-name-n-color` lá na página de edição, e por ser um componente reaproveitável, olha que maravilha, usamos ele aqui agora, além disso tem dois botões, um para cancelar e outro para salvar, simples assim.

## **Modificando o SCSS**

Agora, vamos deixar o SCSS pronto para o que precisamos:

```scss
@import "/src/styles.scss";

app-meet-name-n-color {
  width: 100%;
}

.buttons {
  @include flex(row, center, center);
  width: 100%;
  padding: 20px 0;

  align-self: flex-end;
}
```

# Modificando as Rotas

Depois de criamos essa linda página, vamos configurar as rotas corretamente, vá até `src/app/app-routing.module.ts`, e procure por `routes`, dentro, procure por `new-meet` e altere para:

```typescript
const routes: Routes = [
  //..
  {
    path: "new",
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import("./pages/meet/pages/new-meet/new-meet.module").then(
        (m) => m.NewMeetModule
      ),
  },
  //..
];
```

Prontiiinho, agora se formos até `http://localhost:4200/` e clicar no `+`, você vai ir direto para a página de criar, se você escolher um nome e uma cor vai ver que uma nova reunião aparece!

E se você clicar no botão de edição, vai ver que a página de edição abre!!

![Gif felicidade](https://media.giphy.com/media/13hxeOYjoTWtK8/giphy.gif)

# Criando o botão de deletar sala

Agora, vamos voltar a nossa página home, lembra que nós não criamos o modal de deleção de reuniões? Poisé, pode tentar clicar na lixeira e nada vai acontecer, mas vamos fazer isso agora mesmo!

Vá até `src/app/pages/meet/components/meet-snackbar/meet-snackbar.component.ts`, poisé, esse é o componente de snackbar que exibe as reuniões, é ele que vamos editar!

## **Modificando o TS**

Procure o `constructor`, e descomente o metService e o dialog.

```typescript
  constructor(
    private route: Router,
    private meetService: MeetService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
```

# `meet-snackbar` -> Criando o modal `confirm-modal`

Antes de continuar fazendo o botão de deleção, precisamos criar o modal que ele vai abrir, então, vamos até `src/app/shared/components` e crie um novo componente comum chamado `confirm-modal`, e deixe ele assim:

```typescript
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

interface DialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: "app-confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"],
})
export class ConfirmModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  cancelClick() {
    this.dialogRef.close();
  }
}
```

Ele é parecido com o nosso modal de seleção de avatar, mas bem mais simples, vamos lembrar algumas coisas.

No constructor, o `dialogRef` é uma referência a ele mesmo, como modal, para que possamos fechar ele usando `dialogRef.close()`, além disso, usamos um `@Inject`, esse é um decorator que serve para injetar coisas, no caso, ele injeta o `MAT_DIALOG_DATA`, que é o dado que passamos para o modal, nós passamos esse dado lááá aonde invocamos o modal, você vai ver, vamos invocar ele na função `deleteMeet()` lá em `meet-snackbar.component.ts` e vamos passar um objeto `data`, esse objeto é esse tal `MAT_DIALOG_DATA`.

Leia mais sobre Modais do Angular Material [aqui](https://material.angular.io/components/dialog/overview).

## **Modificando o HTML**

Agora, vamos modificar o HTML, deixe ele assim:

```html
<section class="modal">
  <h2>{{ data.title }}</h2>
  <p>{{ data.message }}</p>
  <div class="buttons">
    <app-button
      classeCss="botaoModalAvatar"
      [texto]="data.cancelText"
      cor="texto"
      (click)="cancelClick()"
    ></app-button>
    <app-button
      classeCss="botaoModalAvatar"
      [texto]="data.confirmText"
      [mat-dialog-close]="true"
    ></app-button>
  </div>
</section>
```

Super simples, né? Temos um título, uma mensagem, e dois botões, um de cancelar e outro de confirmar, o botão de cancelar chama a função `cancelClick()` que fecha o modal, e o botão de confirmar usa `[mat-dialog-close]="true"` isso informa ao Material que ele deve fechar e enviar `data` de volta para quem chamou, e no caso, vamos enviar `true` como parâmetro, pode parecer estranho, mas é assim que o Material envia uma resposta quando fecha o modal.

## **Modificando o SCSS**

Agora, vamos modificar o SCSS, deixe ele assim:

```scss
@import "/src/styles.scss";

.modal {
  @include flex(column, center, center);
  padding: 24px;

  border-radius: 8px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    margin-bottom: 16px;

    color: var(--primaria03);
  }

  p {
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    margin-bottom: 24px;

    max-width: 275px;
    text-align: center;

    color: var(--cinza02);
  }
}
```

## **Modificando o Módulo**

Agora, vamos até `src/app/shared/components/shared-components.module.ts`.

Adicione `ConfirmModalComponent` em `exports`:

```typescript
@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
  ],
  exports: [
    // ...
    ConfirmModalComponent
  ],
})
```

# Voltando a `meet-snackbar` <- `confirm-modal`

Voltando ao nosso `meet-snackbar`, primeiro, vamos importar o `ConfirmModalComponent`:

```typescript
// Outras importações ...
import { ConfirmModalComponent } from "src/app/shared/components/confirm-modal/confirm-modal.component";
// ...
```

Vamos agora editar a função `deleteMeet()`:

```typescript
  deleteMeet() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Deletar reunião',
        message: 'Deseja deletar a reunião? Essa ação não pode ser desfeita.',
        cancelText: 'Cancelar',
        confirmText: 'Confirmar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.meetService.deleteMeet(this.meet.id).then(() => {
          this._snackBar.open('Reunião deletada!', 'Fechar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        });
      }
    });
  }
```

O que está acontecendo aqui é o seguinte, para abrir o modal a gente usa `dialogRef`, e passa qual modal queremos abrir, no caso `ConfirmModalComponent`, e passa um objeto `data`, esse objeto é o `MAT_DIALOG_DATA` que falamos lá em cima, ele será usado lá, depois disso, usamos `dialogRef.afterClosed().subscribe((result) => {})`, esse subscribe é um observador, ele fica observando se o modal foi fechado, e quando ele é fechado, ele recebe um parâmetro, que é o `result`, que é o que foi passado no `mat-dialog-close`, no caso, `true`, então, se o `result` for `true`, a gente deleta a reunião, se não, a gente não faz nada.

Se você fez tudo certo, agora pode ir em `http://localhost:4200/` e clicar na lixeira em alguma reuniao, e ver o modal funcionando!

![Gif felicidade](https://media.giphy.com/media/MT5UUV1d4CXE2A37Dg/giphy.gif)

# Implementando previsualização de sala

Lembram que quando criamos a página home que é a `meets` a gente não implementou nem o deletar reunião e nem a previsualização da sala?

Então, acabamos de implementar a deleção, agora, vamos implementar a previsualização, vai ser super fácil, você vai ver!

Vá até `src/app/pages/meet/pages/meets/meets.component.ts`, procure por `// objectsFromMeet: any = [];` e descomente!

```typescript
objectsFromMeet: any = [];
```

Agora, procure a `selectMeet()`, e altere para isso aqui:

```typescript
  selectMeet(meet: Meet) {
    this.selectedMeet = meet;

    this.meetService
      .getMeetObjects(meet.id)
      .then((res) => {
        this.objectsFromMeet = res.map((e: any) => {
          return { ...e, type: e.name.split('_')[0] };
        });
      })
      .catch((err) => {
        console.error(err);
        this.notLoaded();
      });
  }
```

O que estamos fazendo aqui, é, ao clicar em uma sala nós vamos chamar o `getMeetObjects`, que vai pegar os objetos daquela reunião, e salvar em `objectsFromMeet`.

Agora, em `src/app/pages/meet/pages/meets/meets.component.html`, ou seja, no HTML, procure por `<-- Local para colocar o componente de exibir a reunião na direita -->`, e coloque isso no lugar:

```html
<div *ngIf="selectedMeet.id" class="preview-container" right>
  <app-meet-canvas
    [onlyView]="true"
    [objects]="objectsFromMeet"
  ></app-meet-canvas>
  <div class="preview">
    <img src="assets/images/icons/meet/meet-door.svg" alt="Entrar na sala" />
    <button (click)="joinMeet()">Entrar na sala</button>
  </div>
</div>
```

O seu HTML deve ficar assim:

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
    <app-meet-snackbar
      *ngFor="let meet of meetings"
      [selected]="selectedMeet.id === meet.id"
      (onSelectMeet)="selectMeet($event)"
      [meet]="meet"
    ></app-meet-snackbar>
  </div>
  <ng-template #noMetings left>
    <div class="noMeetings">
      <img src="assets/images/carinha.svg" />
      <p>Você ainda não possui reuniões criadas :(</p>
    </div>
  </ng-template>
  <div *ngIf="selectedMeet.id" class="preview-container" right>
    <app-meet-canvas
      [onlyView]="true"
      [objects]="objectsFromMeet"
    ></app-meet-canvas>
    <div class="preview">
      <img src="assets/images/icons/meet/meet-door.svg" alt="Entrar na sala" />
      <button (click)="joinMeet()">Entrar na sala</button>
    </div>
  </div>
</app-dashboard>
```

Prrooontinho, agora se clicar em alguma reunião no `Desktop`, vai ver que aparece a previsualização na direita!!

![Mostrando a previsualização](https://i.imgur.com/Z1bB5sO.png)

# Meuus parabéns, estamos quase terminando!

Nós já fizemos quase tudo, a nossa aplicação já está super fantástica, a única coisa que realmente falta é criar duas páginas, a `link-meet` que só existe no mobile, e é usada para colarmos o ID da reunião para entrar, e a `join-meet` que é de fato estar dentro da reunião conversando com outros integrantes!!

![Gif cara de sigma](https://media.tenor.com/lPcexeCDyZ8AAAAM/gentleman-giga-chad.gif)
