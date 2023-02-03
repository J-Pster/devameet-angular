# Vamos criar o nossos componentes!

Componentes são partes da aplicação que podem ser reutilizadas em outras partes da aplicação. Por exemplo, podemos criar um componente para o cabeçalho da nossa aplicação, e reutilizar esse componente em outras páginas, assim como podemos criar botões, inputs, etc.

Primeiro vamos criar alguns componentes que vamos utilizar nas páginas de Login e Registro, são eles: `Input`, `Button`, `Cta Footer`, `Avatar` e `Upload Avatar`, depois disso vamos criar o nosso primeiro modal, mas isso é mais pra frente!

## Criando o nosso Input

---

## **Criando o módulo para os componentes compartilhados**

Antes de criar os componentes compartilhados (shared), vamos criar o módulo dos componentes compartilhados, assim, quando precisarmos de algum componente basta importar o modulo e não precisamos importar cada componente individualmente.

Vamos até a pasta `src/app/shared/components`, vamos clicar com o botão direito em cima da pasta `components` e vamos clicar em `Angular: Generate a module`, vai aparecer um input lá em cima no VSCode, não precisa digitar nada, só apertar `Enter`, selecione `Module of components` e depois `Nowhere` e por fim `Confirm`.

Pronto, agora vamos modificar o nome do arquivo criado de `components.module.ts` para `shared-components.module.ts`, e dentro dele, vamos trocar o nome da classe de `ComponentsModule` para `SharedComponentsModule`.

Agora, vamos adicionar algumas importações que iremos usar durante o projeto no nosso módulo, vamos o seguinte código na parte de `imports` do nosso módulo:

```typescript
  imports: [
    CommonModule, // É um módulo que contém diretivas comuns como ngIf e ngFor
    FormsModule, // É um módulo que contém diretivas de formulário como ngModel
    ReactiveFormsModule, // É um módulo que contém diretivas de formulário reativas como formControl
    RouterModule, // É um módulo que contém diretivas de roteamento como routerLink
    MatDialogModule, // É um módulo que contém diretivas de dialogos como MatDialog e MatDialogRef
    MatSnackBarModule, // É um módulo que contém diretivas de snackbars como MatSnackBar e MatSnackBarRef
  ],
```

Não se preocupe em entender tudo, você vai entender melhor quando formos usar.

Para que os módulos importados funcionem você precisa os importar:

```typescript
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
```

Ao final, o nosso `shared-components.module.ts` deve ficar assim:

```typescript
import { NgModule } from "@angular/core";
import { InputComponent } from "./input/input.component";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [InputComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
})
export class SharedComponentsModule {}
```

---

## **Criando o componente Input**

Vamos até a pasta `src/app/shared/components`, vamos clicar com o botão direito em cima da pasta `components` e vamos clicar em `Angular: Generate a component`, vai aparecer um input lá em cima no VSCode, vamos digitar o nome do nosso componente, que no caso é `input`, e vamos clicar em `Enter`.

Agora vamos selecionar a opção `Default component`, e depois `Confirm`

Pronto, se você fez tudo certo, uma pasta `input` foi criada e dentro dela temos o arquivo `input.component.ts`, `input.component.html` e `input.component.scss` (e também o `input.component.spec.ts`, mas não vamos mexer nesse arquivo).

Se você conferir no modulo que acabamos de criar, o `shared/components/components.module.ts`, vai ver que o componente `InputComponent` foi importado e adicionado no `declarations`.

### **Modificando o TS**

Vamos começar pelo TypeScript, o nosso componente de botão, para ser reaproveitável vai precisar receber algumas propriedades, vamos abrir o arquivo `input.component.ts` e vamos adicionar o seguinte código:

**OBS: As partes comentadas são as que vem por padrão!**

```typescript
  //import { Component } from '@angular/core';
  import { Component, Input, OnInit } from '@angular/core';

  //@Component({
  // selector: 'app-input',
  // templateUrl: './input.component.html',
  // styleUrls: ['./input.component.scss']
  //})
  //export class InputComponent {
    @Input() referenciaFormulario?: AbstractControl;
    @Input() imagem?: string;
    @Input() tipo?: string;
    @Input() placeholder?: string;
    @Input() cssClass: string = '';
    @Input() default?: string;
    @Input() disabled: boolean = false;
  //}
```

Aqui nós estamos usando o decorator `@Input()` para dizer que essas propriedades são propriedades que podem ser passadas para o componente, `referenciaFormulario` é uma referência para o campo do formulário que o input está vinculado, `imagem` é a imagem que vai aparecer no input, `tipo` é o tipo do input, `placeholder` é o texto que vai aparecer quando o input não estiver preenchido, `cssClass` é uma classe CSS que vai ser adicionada ao input, `default` é o valor padrão do input, `disabled` é uma propriedade que diz se o input está desabilitado ou não.

Abaixo do código que acabamos de adicionar, vamos adicionar o seguinte código:

```typescript
  constructor() {}

  ngOnInit(): void {
    if (this.default) {
      this.referenciaFormulario?.setValue(this.default);
    }
  }
```

Constructor é uma função que é executada quando o componente é criado, e o ngOnInit é uma função que é executada quando o componente é inicializado, no nosso caso, vamos usar o ngOnInit para definir o valor padrão do input, se o valor padrão for passado.

Abaixo do código que acabamos de adicionar, vamos adicionar o seguinte código:

```typescript
  public aoModificarCampo(event: any): void {
    this.referenciaFormulario?.setValue(event);
    this.referenciaFormulario?.markAsDirty();
  }
```

Essa função é executada quando o valor do input é modificado, ela vai pegar o valor do input e vai passar para o campo do formulário que o input está vinculado.

Por fim, mas não menos importante, vamos adicionar o seguinte código:

```typescript
  public obterMensagemErro(): string {
    if (!this.referenciaFormulario?.errors) {
      return '';
    }

    if (this.referenciaFormulario?.errors['required']) {
      return 'Campo obrigatorio!';
    }

    if (this.referenciaFormulario?.errors['email']) {
      return 'Insira um e-mail válido!';
    }

    if (this.referenciaFormulario?.errors['minlength']) {
      return `Deve ter no mínino ${this.referenciaFormulario.errors['minlength'].requiredLength} caracteres!`;
    }

    if (this.referenciaFormulario?.errors['confirmPass']) {
      return 'As senhas não conferem!';
    }

    if (this.referenciaFormulario?.errors['password']) {
      return 'Senha inválida!';
    }

    return '';
  }
```

Essa função é responsável por retornar a mensagem de erro que vai aparecer no input, ela vai verificar se o campo do formulário que o input está vinculado tem algum erro, se tiver, ela vai retornar a mensagem de erro correspondente, se não tiver, ela vai retornar uma string vazia.

O código final ficará assim:

```typescript
import { AbstractControl } from "@angular/forms";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent implements OnInit {
  @Input() referenciaFormulario?: AbstractControl;
  @Input() imagem?: string;
  @Input() tipo?: string;
  @Input() placeholder?: string;
  @Input() cssClass: string = "";
  @Input() default?: string;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.default) {
      this.referenciaFormulario?.setValue(this.default);
    }
  }

  public aoModificarCampo(event: any): void {
    this.referenciaFormulario?.setValue(event);
    this.referenciaFormulario?.markAsDirty();
  }

  public obterMensagemErro(): string {
    if (!this.referenciaFormulario?.errors) {
      return "";
    }

    if (this.referenciaFormulario?.errors["required"]) {
      return "Campo obrigatorio!";
    }

    if (this.referenciaFormulario?.errors["email"]) {
      return "Insira um e-mail válido!";
    }

    if (this.referenciaFormulario?.errors["minlength"]) {
      return `Deve ter no mínino ${this.referenciaFormulario.errors["minlength"].requiredLength} caracteres!`;
    }

    if (this.referenciaFormulario?.errors["confirmPass"]) {
      return "As senhas não conferem!";
    }

    if (this.referenciaFormulario?.errors["password"]) {
      return "Senha inválida!";
    }

    return "";
  }
}
```

### **Modificando o HTML**

Agora, vamos ao HTML, vamos abrir o arquivo `input.component.html` e vamos adicionar o seguinte código:

```html
<div class="containerInputPublico"></div>
```

Dessa forma nós criamos a nossa div que vai conter o input e a mensagem de erro.

Dentro dessa div, vamos criar mais uma, aonde colocaremos o input junto com o icone que quisermos adicionar nele, vamos adicionar o seguinte código:

```html
<div [ngClass]="['inputPublico', cssClass]">
  <img
    class="iconeInput"
    alt="imagem do input"
    [src]="imagem"
    width="20"
    height="20"
  />

  <input
    [disabled]="disabled"
    [type]="tipo"
    [placeholder]="placeholder"
    [ngModel]="referenciaFormulario?.value"
    (ngModelChange)="aoModificarCampo($event)"
  />
</div>
```

Como vocês podem ver, uma tag `img` e uma tag `input` foram adicionadas, a tag `img` é responsável por exibir o icone que quisermos adicionar no input, e a tag `input` é responsável por exibir o input em si.

Dentro da tag `img` nós temos um atributo escrito de uma forma diferente, usando colchetes, isso é chamado de `property binding`, ele é usado para passar valores para propriedades de elementos HTML, no nosso caso, estamos passando o valor da variável `imagem` para a propriedade `src` da tag `img`.

A mesma coisa se repete para a tag `input`, estamos passando o valor da variável `tipo` para a propriedade `type` da tag `input`, o valor da variável `placeholder` para a propriedade `placeholder` da tag `input`, o valor da variável `referenciaFormulario?.value` para a propriedade `ngModel` da tag `input`.

Porém, no input nós temos um evento chamado `ngModelChange`, você pode ver que é um evento pois está envolto de `()`, esse evento é responsável por disparar uma função toda vez que o valor do input for alterado, no nosso caso, a função que vai ser disparada é a `aoModificarCampo`, que vai receber o valor do input como parâmetro.

Por fim, abaixo da div que acabamos de criar, vamos criar uma pag que vai exibir a mensagem de erro, vamos adicionar o seguinte código:

```html
<p
  *ngIf="referenciaFormulario?.invalid && referenciaFormulario?.dirty"
  class="mensagemErro"
>
  {{ obterMensagemErro() }}
</p>
```

A tag `p` é responsável por exibir o texto, e o atributo `*ngIf` é responsável por exibir o texto apenas se a condição que está dentro dele for verdadeira, no nosso caso, a condição é: se o campo do formulário que o input está vinculado for inválido e se o campo do formulário que o input está vinculado for sujo, ou seja, se o campo do formulário que o input está vinculado foi alterado pelo usuário.

Para mostrar a mensagem de erro, nós usamos a função `obterMensagemErro`, que vai retornar a mensagem de erro que queremos exibir, porém, ela está dentro de um `{{ }}`, isso é chamado de `interpolation`, ele é usado para exibir valores de variáveis dentro do HTML no Angular.

### **Modificando o CSS**

Agora, vamos ao CSS, vamos abrir o arquivo `input.component.scss` e vamos adicionar o seguinte código:

```css
.containerInputPublico {
  .inputPublico {
    border-bottom: 1px solid var(--primaria03);
    display: flex;
    padding-bottom: 8px;

    input {
      border: none;
      outline: none;
      color: var(--primaria03);
      margin-left: 12px;
      flex: 1;
    }

    &.profile {
      border: none;
      margin: 0;
      padding: 0;

      img {
        display: none;
      }

      input {
        border: none;
        outline: none;
        font-size: 14px;
        font-weight: 600;
        color: var(--cinza04);
        margin-left: 6px;
        flex: 1;

        &:disabled {
          background-color: transparent;
        }
      }
    }

    &.newMeet {
      border: none;
      margin: 0;
      padding: 0;

      img {
        display: none;
      }

      input {
        border: none;
        outline: none;
        font-size: 16px;
        font-weight: 700;
        color: var(--primaria03);

        margin: 0;
        flex: 1;
      }

      ::placeholder {
        color: var(--primaria03);
      }
    }
  }
}
```

Toda a parte de SCSS eu vou abranger mais durante o vídeo, pois fica mais dinâmico de aprender, e muitas coisas no SCSS (CSS) se repetem várias e várias vezes, então, não vou me aprofundar muito nisso aqui, mas, basicamente, o que estamos fazendo é estilizando o input, e o icone que está dentro dele.

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif Missão Comprida](https://media.giphy.com/media/fwi2qY9VmH33uukTXr/giphy.gif)
