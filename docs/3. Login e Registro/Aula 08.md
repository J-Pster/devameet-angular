# Criando a página de registro de fato

Antes de colocarmos a mão na massa, vou lembra-los de algumas coisas, primeiro, é que a página de registro tem alguns critérios de aceite:

- O usuário deve poder selecionar seu avatar através de um modal.
- Mensagens de erro deverão aparecer em uma `snackBar` na parte superior.
- A senha tem validadores, para se manter nos padrões.
- Ao clicar em `Registrar`, uma service deve ser chamada para registrar o usuário.

Alguns desses critérios não serão atendidos de primeira, primeiro vou mostrar a vocês como montar a página, em seguida vou partir para criar as coisas que faltam, inclusive, vamos criar nossos primeiros services.

## **Criando a página de registro**

## **Modificando o TS**

Vamos modificar o arquivo `src/pages/register/register.component.ts`, e vamos colocar o seguinte código:

```typescript
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {}
```

Até agora, nós somente importamos algumas coisas que vamos precisar por agora, agora, dentro de `RegisterComponent`, vamos criar algumas variáveis:

```typescript
  public form: FormGroup;
  public avatarSrc: string = 'avatar_07_front';
```

A FormGroup é a classe que vai nos ajudar a criar o formulário, e a variável `avatarSrc` vai guardar o nome do avatar que o usuário selecionou.

Agora vamos fazer o `constructor` dessa classe, aonde inicializaremos o formulário e instanciaremos algumas classes, como a FormBuilder e a MatSnackBar

```typescript
  // Variaveis que criamos...

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPass: ['', [Validators.required]],
    });
  }
```

Podemos observar que criamos um FormGroup, e dentro dele, criamos 4 campos, sendo eles: nome, email, password e confirmPass, e cada um deles tem uma validação, validação são criterios para que o campo seja válido.

Agora, vamos criar a função que pega a `Ref` do formulário, e passa para os inputs:

```typescript
  // Constructor ...

  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }
```

Usando `this.form.controls[nomeCampo]`, nós pegamos a referência do campo que queremos, e passamos para o input, para que ele possa fazer a validação e ser alterado.

Agora, vamos fazer a função que envia o formulário, mas ela ainda não estará completa, pois ainda não temos o service de registro:

```typescript
  // getFormRef ...

  public async aoSubmeter() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const formValues = this.form.value;

    // Local para o service de autenticação
    console.log(formValues);
  }
```

Nessa função temos uma coisa super interessante, estamos usando o Angular Material para criar uma `snackBar`, esse é um nome comum dado a um componente que tem o formato de uma barra, geralmente usado para dar notificações rápidas.

Usando `this._snackBar.open` nós conseguimos instanciar uma `snackBar`, e passamos algumas configurações, como a duração, texto, e a posição vertical, você vai conseguir ver melhor quando rodar o projeto.

Agora vamos criar uma função que abre o modal de avatares:

```typescript
  // aoSubmeter ...

  openDialog(): void {
    // Local para o dialog de avatar
    console.log('Abriu!')
  }
```

Essa função ficará vazia até criarmos o modal, mas por enquanto, vamos apenas mostrar no console que o modal foi aberto.

O seu código deve ter ficado assim:

```typescript
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  public form: FormGroup;
  public avatarSrc: string = "avatar_07_front";

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.form = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]],
      confirmPass: ["", [Validators.required]],
    });
  }

  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  public async aoSubmeter() {
    if (this.form.invalid) {
      this._snackBar.open("Preencha todos os campos corretamente!", "OK", {
        duration: 2000,
        verticalPosition: "top",
      });
      return;
    }

    const formValues = this.form.value;

    // Local para o service de autenticação
    console.log(formValues);
  }

  openDialog(): void {
    // Local para o dialog de avatar
    console.log("Abriu!");
  }
}
```

## **Modificando o HTML**

A primeira coisa que vamos fazer é adicionar o `app-publica`, que é aquele componente reaproveitável que criamos, ao adicionar ficará assim:

```html
<app-publica
  classeCssLogo="cadastro"
  textoBotaoSubmit="Cadastrar"
  (submiterFormulario)="aoSubmeter()"
>
</app-publica>
```

Ao tentar rodar você vai se deparar com um erro, isso é por que não importamos o `app-publica` no nosso `register.module.ts`, então vamos importar o `SharedPagesModule` e o `SharedComponentsModule`.

Mas também vamos adicionar o `RegisterComponent` para ser exportado, e vamos importar o `MatSnackBarModule` que é um módulo do Angular Material que usamos para criar a `snackBar`.

```typescript
// Outras importações...
import { SharedPagesModule } from "src/app/shared/pages/shared-pages.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
  exports: [RegisterComponent],
})
export class RegisterModule {}
```

Agora, se você entrar em `http://localhost:4200/register`, você vai ver que o `app-publica` está funcionando.

Agora, vamos adicionar o `app-upload-avatar` e o `app-cta-footer` no nosso `register.component.html`, e vamos passar a função `openDialog` para o evento `click` do botão, ficando assim:

```html
<app-publica
  classeCssLogo="cadastro"
  textoBotaoSubmit="Cadastrar"
  (submiterFormulario)="aoSubmeter()"
>
  <app-upload-avatar conteudoFormulario (click)="openDialog()">
    <app-avatar [src]="avatarSrc" classeCss="avatarCadastro"></app-avatar>
  </app-upload-avatar>

  <app-cta-footer
    pergunta="Já possui uma conta?"
    textoDaAcao="Faça seu login agora!"
    rota="/"
    rodape
  ></app-cta-footer>
</app-publica>
```

Observe que passamos `conteudoFormulario` para o `app-upload-avatar`, isso é para que o `app-upload-avatar` possa saber que ele está dentro de um formulário, na parte principal do conteúdo.

E passamos `rodape` para o `app-cta-footer`, isso é para que o `app-cta-footer` possa saber que ele está no rodapé do formulário, abaixo do botão.

**OBS: Se algo não funcionar, talvez você tenha esquecido de exportar ou importar alguma coisa em algum módulo!**

Pronto, agora nós podemos entrar em `http://localhost:4200/register` e ver o nosso formulário de cadastro.

Agora, falta os `inputs`, então, adicionamos eles:

```html
<app-publica
  classeCssLogo="cadastro"
  textoBotaoSubmit="Cadastrar"
  (submiterFormulario)="aoSubmeter()"
>
  <app-upload-avatar conteudoFormulario (aoAtualizarImagem)="openDialog()">
    <app-avatar [src]="avatarSrc" classeCss="avatarCadastro"></app-avatar>
  </app-upload-avatar>
  <app-input
    conteudoFormulario
    tipo="text"
    placeholder="Nome Completo"
    imagem="assets/images/icons/user.svg"
    [referenciaFormulario]="getFormRef('nome')"
  ></app-input>
  <app-input
    conteudoFormulario
    tipo="email"
    placeholder="E-mail"
    imagem="assets/images/icons/mail.svg"
    [referenciaFormulario]="getFormRef('email')"
  ></app-input>
  <app-input
    conteudoFormulario
    tipo="password"
    placeholder="Senha"
    imagem="assets/images/icons/key.svg"
    [referenciaFormulario]="getFormRef('password')"
  ></app-input>
  <app-input
    conteudoFormulario
    tipo="password"
    placeholder="Confirmar Senha"
    imagem="assets/images/icons/key.svg"
    [referenciaFormulario]="getFormRef('confirmPass')"
  ></app-input>
  <app-cta-footer
    pergunta="Já possui uma conta?"
    textoDaAcao="Faça seu login agora!"
    rota="/"
    rodape
  ></app-cta-footer>
</app-publica>
```

Observem que os inputs recebem `conteudoFormulario`, isso é para que o `app-input` saiba que ele está dentro de um formulário, na parte principal do conteúdo.

E também, temos o `getFormRef`, que é uma função que retorna uma referência para o formulário, e passamos essa referência para o `app-input`, isso é para que o `app-input` possa saber qual é o input que ele está de fato atuando.

**Que lindo o mundo dos compoentes, não é mesmo?! :)**

## **Modificando o SCSS**

Agora, vamos modificar o SCSS do `app-register`, para que ele fique com o estilo que queremos.

Abra o arquivo `register.component.scss` e adicione o seguinte código:

```scss
app-publica {
  app-upload-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  app-input {
    display: block;
    margin-bottom: 24px;

    &:last-of-type {
      margin-bottom: 0px;
    }

    &:first-of-type {
      margin-top: 40px;
    }
  }
}
```

Observe que colocamos estilos em `app-publica`, `app-upload-avatar` e `app-input` como se fossem elementos comuns do html, isso é por que de fato, eles se comportam e são tratados como elementos nativos html.

Agora, se você entrar em `http://localhost:4200/register`, você vai ver que o `app-register` está funcionando (não completamente) e com o estilo que queremos.
