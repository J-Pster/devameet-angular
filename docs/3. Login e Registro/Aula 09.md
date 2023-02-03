# Criando o modal de avatares

Nossa página de registro está pronta, mas não completa e nem funcionando 100%, agora, vamos criar o modal de avatares.

Você pode ver esse modal lá no Figma, na parte Avatar_Modal, lá no canto direito.

O Avatar Modal é um componente compartilhado comum, então, crie um componente compartilhado na pasta `shared/components` com o nome de `avatar-modal`.

## **Modificando o TS**

Primeiro, vamos importar algumas coisas e criar nossas variáveis:

```typescript
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
  avatarSrc: string;
}

@Component({
  selector: "app-avatar-modal",
  templateUrl: "./avatar-modal.component.html",
  styleUrls: ["./avatar-modal.component.scss"],
})
export class AvatarModalComponent {
  avatars = [
    "avatar_01_front",
    "avatar_02_front",
    "avatar_03_front",
    "avatar_04_front",
    "avatar_05_front",
    "avatar_06_front",
    "avatar_07_front",
    "avatar_08_front",
    "avatar_09_front",
  ];
}
```

Primeiro, nós importamos o `MAT_DIALOG_DATA` e o `MatDialogRef`, o `MAT_DIALOG_DATA` é um objeto que nós vamos usar para receber os dados que nós vamos passar para o modal, e o `MatDialogRef` é um objeto que nós vamos usar para fechar o modal, no caso, é uma referencia ao objeto do modal.

Você pode ler mais sobre esses objetos [aqui](https://material.angular.io/components/dialog/overview).

Já o array `avatars` é um array com os nomes dos avatares que nós vamos usar, e vamos usar ele para renderizar os avatares no modal.

Por fim, a interface `DialogData` é uma interface que nós vamos usar para definir o tipo dos dados que nós vamos passar para o modal.

Vamos então, criar o construtor do nosso componente:

```typescript
// Variáveis
  constructor(
    public dialogRef: MatDialogRef<AvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}
```

Observe, `dialogRef`, isso está instanciando o `MatDialogRef`, para que possamos usar ele no nosso componente.

Agora, `@Inject(MAT_DIALOG_DATA) public data: DialogData`, aqui nós estamos injetando o `MAT_DIALOG_DATA` no nosso componente, e definindo o tipo dele como `DialogData`.

O `@Inject` é um decorator que nós usamos para injetar um objeto em um componente (ou seja, injetar informações, vamos usar isso de novo lá na frente), e o `MAT_DIALOG_DATA` é o objeto que nós vamos usar para receber os dados que nós vamos passar para o modal.

Vamos adicionar agora algumas funções:

```typescript
  // Constructor...

  selectAvatar(avatar: string): void {
    this.data.avatarSrc = avatar;
  }

  getAvatar(avatar: string): string {
    return `assets/images/objects/avatar/${avatar}.png`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
```

Vocês já são feras na programação, aliás, esse curso já é de nível intermediável, então, vamos direto ao ponto.

**OBS: Como esse é um curso intermediário, coisas básicas demais deixarão de ser explicadas.**

A função `selectAvatar` é uma função que nós vamos usar para selecionar o avatar, ela recebe um avatar como parâmetro, e então, ela seta o avatarSrc do `data` para o avatar que foi passado como parâmetro.

A função `getAvatar` é uma função que nós vamos usar para pegar o avatar, ela recebe um avatar como parâmetro, e então, ela retorna o caminho do avatar.

A função `onNoClick` é uma função que nós vamos usar para fechar o modal, ela simplesmente chama o `dialogRef.close()`.

O seu componente TS deve ficar assim:

```typescript
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
  avatarSrc: string;
}

@Component({
  selector: "app-avatar-modal",
  templateUrl: "./avatar-modal.component.html",
  styleUrls: ["./avatar-modal.component.scss"],
})
export class AvatarModalComponent {
  avatars = [
    "avatar_01_front",
    "avatar_02_front",
    "avatar_03_front",
    "avatar_04_front",
    "avatar_05_front",
    "avatar_06_front",
    "avatar_07_front",
    "avatar_08_front",
    "avatar_09_front",
  ];

  constructor(
    public dialogRef: MatDialogRef<AvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  selectAvatar(avatar: string): void {
    this.data.avatarSrc = avatar;
  }

  getAvatar(avatar: string): string {
    return `assets/images/avatars/${avatar}.png`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
```

## **Modificando o HTML**

Agora, vamos modificar o HTML do nosso componente:

```html
<div class="body">
  <header>
    <h3>Avatar</h3>
    <h2>Selecione seu avatar</h2>
  </header>
  <section>
    <div
      class="avatar-item"
      *ngFor="let avatar of avatars"
      (click)="selectAvatar(avatar)"
      [class.selected]="avatar === data.avatarSrc"
    >
      <img [src]="getAvatar(avatar)" />
    </div>
  </section>
  <footer>
    <app-button
      classeCss="botaoModalAvatar"
      texto="Voltar"
      cor="texto"
      (click)="onNoClick()"
    ></app-button>
    <app-button
      classeCss="botaoModalAvatar"
      texto="Salvar"
      [mat-dialog-close]="data.avatarSrc"
    ></app-button>
  </footer>
</div>
```

Como vocês já são intermediários ou mais que isso, o que realmente interessa explicar aqui é a `<section>`, observe:

```html
<section>
  <div
    class="avatar-item"
    *ngFor="let avatar of avatars"
    (click)="selectAvatar(avatar)"
    [class.selected]="avatar === data.avatarSrc"
  >
    <img [src]="getAvatar(avatar)" />
  </div>
</section>
```

Aqui, nós temos um `div` com a classe `avatar-item`, e nós estamos usando o `*ngFor` para iterar sobre os avatares, e então, nós estamos usando o `click` para chamar a função `selectAvatar`, e nós estamos usando o `[class.selected]` para adicionar a classe `selected` no `div` caso o avatar seja igual ao `data.avatarSrc`.

O `[class.X]` é como se fosse um `if`, se o que está dentro do colchetes for verdadeiro, então, a classe `X` será adicionada no elemento, caso contrário, a classe `X` será removida do elemento.

Já o `*ngFor` é um `for` que nós usamos para iterar sobre um array, o que será repetido, será o componente que o `*ngFor` está dentro, no caso, o `div` e seus filhos.

## **Modificando o SCSS**

Primeiro, vamos até `src/asyles.scss` e adicionar o seguinte código:

```scss
// Breakpoints...

// Mixins

@mixin flex($direction: row, $justify: flex-start, $align: flex-start) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $align;
}
```

Em `SCSS` nós podemos criar mixins, que são como funções, só que, ao invés de retornar um valor, elas adicionam um código css no lugar que elas foram chamadas.

Agora, vamos modificar o `avatar-modal.component.scss`:

```scss
@import "/src/styles.scss";

.body {
  width: 100%;
  max-width: 328px;

  height: 463px;

  @media screen and (min-width: $desktopBreakpoint) {
    width: 640px;
    max-width: 640px;

    height: 640px;
  }
}

header {
  @include flex(column, center, flex-start);
  padding: 16px;

  border-bottom: 1px solid var(--cinza01);

  h3 {
    font-size: 12px;
    font-weight: 600;
    color: var(--cinza02);

    margin: 0;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--primaria03);

    margin: 0;
  }

  max-height: 71px;

  @media screen and (min-width: $desktopBreakpoint) {
    max-height: 72px;
  }
}

section {
  @include flex(row, center, center);
  flex-wrap: wrap;
  gap: 6px;

  height: 296px;
  overflow-y: auto;

  padding: 6px;

  .avatar-item {
    @include flex(column, center, center);

    flex: 0 0 30%;
    aspect-ratio: 1/1;
    border-radius: 4px;

    cursor: pointer;
    background-color: #f0f5ff;

    img {
      height: 100%;
      border-radius: 4px;

      user-select: none;
      pointer-events: none;
    }

    border: 2px solid transparent;

    &:hover {
      border: 2px solid var(--cinza01);
    }

    &.selected {
      border: 2px solid var(--primaria03);
    }

    @media screen and (min-width: $desktopBreakpoint) {
      flex: 0 0 30.6%;

      border: 4px solid transparent;

      &:hover {
        border: 4px solid var(--cinza01);
      }

      &.selected {
        border: 4px solid var(--primaria03);
      }
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    gap: 12px;
    padding: 10px;

    height: 468px;
  }
}

footer {
  @include flex(row, center, center);
  gap: 16px;

  height: 80px;

  @media screen and (min-width: $desktopBreakpoint) {
    height: 80px;
  }
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: rgba(37, 203, 211, 0.25);
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: var(--primaria03);
  border-radius: 8px;
}
```

## **Vamos usar o nosso modal**

A primeira coisa é ir até `src/pages/register/register.component.ts` e importar o modal e o `MatDialog`:

```typescript
// Outras importações...

import { AvatarModalComponent } from "src/app/shared/components/avatar-modal/avatar-modal.component";
import { MatDialog } from "@angular/material/dialog";

// ...
```

Agora, no construtor, vamos instanciar o `MatDialog`:

```typescript
// Outras variáveis...
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog // Adicionamos essa linha
  ) {
    // ...
  }

// ...
```

Agora, vamos reescrever a função `openDialog`:

```typescript
// ...
  openDialog(): void {
    const dialogRef = this.dialog.open(AvatarModalComponent, {
      data: { avatarSrc: this.avatarSrc },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.avatarSrc = result;
      }
    });
  }
// ...
```

Prontido! Pode ir até `http://localhost:4200/register` e testar o modal clicando na imagem do avatar.
