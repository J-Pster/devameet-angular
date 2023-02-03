# Criando o componente upload avatar

Primeira coisa é criar um componente chamado `upload-avatar`, esse será o componente que vai "envelopar" o avatar na parte de cadastro, isso é para que quando cliquemos em cima dele, ele abra um modal, que vai conter os avatares para selerem selecionados.

O motivo de estarmos criando esse componente, é para que possamos reaproveitar o componente avatar, mas dessa vez com um tipo de "Decorator" em cima dele, (decorator é um padrão de projeto, que é usado para adicionar funcionalidades a um componente, sem precisar alterar o componente original).

## **Modificando o TS**

Cole o seguinte no arquivo `upload-avatar.component.ts`:

```typescript
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-upload-avatar",
  templateUrl: "./upload-avatar.component.html",
  styleUrls: ["./upload-avatar.component.scss"],
})
export class UploadAvatarComponent {
  @Input() public referenciaFormulario?: AbstractControl;
  @Input() public classeCssContainer: string = "";
  @Input() public imagemPrevisualizacao?: string;
  @Input() public classeCssImagemPrevisualizacao: string = "";
}
```

O `@Input()` nos já vimos, aqui ele é usado para receber novamente um `AbstractControl`, uma classe CSS customizada, uma imagem de previsualização, vocês vão entender isso em breve e uma classe CSS customizada para a imagem de previsualização.

## **Modificando o HTML**

Cole o seguinte no arquivo `upload-avatar.component.html`:

```html
<div [ngClass]="['containerUploadImagem', classeCssContainer]">
  <ng-content></ng-content>
</div>
```

Aqui temos uma coisa nova e bem interessante, o `ng-content`, o `ng-content` é um elemento que vai renderizar o conteúdo que estiver dentro do componente, ou seja, se você criar um componente assim:

```html
<app-upload-avatar>
  <div>Olá mundo!</div>
</app-upload-avatar>
```

O `ng-content` vai renderizar o `<div>Olá mundo!</div>`.

## **Modificando o SCSS**

Cole o seguinte no arquivo `upload-avatar.component.scss`:

```scss
.containerUploadImagem {
  text-align: center;
  cursor: pointer;
  object-fit: cover;
  position: relative;

  width: fit-content;

  user-select: none;

  &::after {
    content: url("/assets/images/edicao.svg");
    width: 40px;
    height: 40px;
    display: flex;
    right: 0;
    left: 90px;
    margin: auto;
    position: absolute;
    bottom: 5px;
  }
}
```

# Vamos testar tudo isso?

Com tudo isso criado, podemos finalmente testar, e aqui vou te ensinar mais uma coisa, se você entrar no arquivo `shared-components.module.ts` e olhar na chave `declarations`, vai ver algo como isso:

```typescript
  declarations: [
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
```

Em declarations, são todos os componentes que criamos e que pertencem a esse módulo, o `imports` é onde importamos outros módulos, e talvez no seu tenha, ou não tenha, mas existe uma terceira chave, chamada `exports`.

A chave exports é onde você vai colocar todos os componentes que você quer que sejam exportados para outros módulos, ou seja, se você criar um componente, e quiser que ele seja usado em outros módulos, você precisa colocar ele na chave `exports`.

Como esse é um modulo compartilhado, adicione todos os componentes na chave `exports`, assim:

```typescript
  exports: [
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
```

Se você fizer tudo certo, o modulo no arquivo `shared-components.module.ts` vai ficar assim:

```typescript
// Suas importações...

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
})
export class SharedComponentsModule {}
```

## **Testando os componentes**

Agora, vamos até o `app.module.ts` e vamos importar o `SharedComponentsModule`:

```typescript
import { SharedComponentsModule } from "./shared-components/shared-components.module";
```

E adicionar no `imports`:

```typescript
  imports: [
    // Outros imports ...
    SharedComponentsModule,
  ],
```

Agora, vamos até o `app.component.html` e vamos adicionar o componente `app-button`:

```html
<h1>Olá Mundo!</h1>

<app-button texto="Clique aqui" cor="primaria"></app-button>
```

Você deve ver um botão bem grande ocupando toda a tela, azul e quando passa o mouse por cima, ele fica com fundo branco, borda e texto azul.

Podemos testar outros componentes também, vamos adicionar os seguintes abaixo do botão:

```html
<app-input
  label="Nome"
  placeholder="Digite seu nome"
  tipo="text"
  imagem="assets/images/icons/key.svg"
></app-input>

<app-avatar></app-avatar>

<app-upload-avatar (click)="onAvatarChange($event)">
  <app-avatar [src]="avatarSrc" classeCss="avatarCadastro"></app-avatar>
</app-upload-avatar>
```

E para isso funcionar, vamos modificar o `app.component.ts`:

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  avatarSrc = "avatar_06_front";

  constructor() {}

  onAvatarChange(event: any) {
    console.log(event);
  }
}
```

Aqui você pode observar os componentes que criamos funcionando, e também o `app-upload-avatar`, que é um componente que renderiza o `app-avatar` dentro dele, e também tem um evento de click, que é o que vamos usar para ativar um modal que vamos fazer em seguida.

Você pode ver que no componente `app-upload-avatar` temos um `(click)="onAvatarChange($event)"`, e no `app.component.ts` temos o método `onAvatarChange(event: any)`, esse método é chamado quando clicamos no `app-upload-avatar`, e o `$event` é o evento que aconteceu, no caso, o click.

Se observar o console, vai ver que o `$event` é um objeto com a propriedade `target`, que é o elemento que foi clicado, e a propriedade `type`, que é o tipo do evento, no caso, `click`.

## **Limpando nossos testes**

Agora que já vimos como funciona, vamos limpar o que fizemos no `app.component.html` e no `app.component.ts`, para que não fique nada no projeto, e vamos seguir para o próximo passo.

No `app.component.html`:

```html
<h1>Olá Mundo!</h1>
```

No `app.component.ts`:

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {}
```

No `app.module.ts` remova a importação do `SharedComponentsModule` e remova ele do `imports`.
