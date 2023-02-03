# Vamos criar a página de login

Agora vocês vão ver o quanto a modulariazação é incrível, e como isso pode ser útil para aplicações de grande escala e para manutenabilidade de um código.

Vá até `src/app/pages/login` e vamos modificar alguns arquivos!

## **Modificando o Módulo**

Vá até `src/app/pages/login/login.module.ts` e cole o seguinte código:

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoginComponent } from "./login.component";
import { SharedPagesModule } from "src/app/shared/pages/shared-pages.module";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
```

O que fizemos aqui é importar os módulos `SharedPagesModule` e `SharedComponentsModule` e também o `MatSnackBarModule` , que é um módulo do Angular Material que vamos usar para exibir mensagens em SnackBar na tela.

## **Modificando o TS**

Cole o seguinte código no `login.component.ts`:

```ts
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "src/app/services/auth/auth.service";
import { passwordValidator } from "src/app/shared/validators/pass.validator";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      login: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
    });
  }

  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
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

    this.authService
      .login({
        login: formValues.login,
        password: formValues.password,
      })
      .catch((err) => {
        const errorMsg = err.error.message || "Erro ao realizar login!";
        this._snackBar.open(errorMsg, "OK", {
          duration: 6000,
          verticalPosition: "top",
        });
      });
  }
}
```

Agora, vá até `src/app/pages/register/register.component.ts` e observe as semelhanças, eu vou deixar vocês compararem e pensarem, eles são extremamente parecidos, não é mesmo?

## **Modificando o HTML**

Vá até `src/app/pages/login/login.component.html` e cole o seguinte código:

```html
<app-publica textoBotaoSubmit="Login" (submiterFormulario)="onSubmit()">
  <app-input
    conteudoFormulario
    tipo="email"
    placeholder="E-mail"
    imagem="assets/images/icons/mail.svg"
    [referenciaFormulario]="getFormRef('login')"
  ></app-input>
  <app-input
    conteudoFormulario
    tipo="password"
    placeholder="Senha"
    imagem="assets/images/icons/key.svg"
    [referenciaFormulario]="getFormRef('password')"
  ></app-input>
  <app-cta-footer
    pergunta="Não possui uma conta?"
    textoDaAcao="Faça seu cadastro agora!"
    rota="/register"
    rodape
  ></app-cta-footer>
</app-publica>
```

Agora, vá até `src/app/pages/register/register.component.html` e observe as semelhanças, eu vou deixar vocês compararem e pensarem, eles são extremamente parecidos, não é mesmo? Hehehe :)

## **Modificando o SCSS**

Vá até `src/app/pages/login/login.component.scss` e cole o seguinte código:

```scss
app-publica {
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

Lembrando, SCSS eu sempre vou explicar somente em aula!

# Vamos testar isso de verdade?

Primeiro, vamos iniciar a API, se você não tem o repositório dela, pode acessar [aqui](https://github.com/Devaria-Oficial/devameet-nest-js), instale as dependências e rode `npm start` para iniciar o Back-End, lembrando que você precisa modificar a `.env` e vai precisar de um banco **Mongo DB**.

Se formos até `http://localhost:4200/` podemos ver a página de login, então clique em `Faça seu cadastro agora!` lá em baixo.

Agora, podemos fazer nosso primeiro cadastro, então, faça seu cadastro!

Depois de clicar em `Cadastrar`, se tudo der certo, você vai ser redirecionado para `http://localhost:4200/` e vai aparecer `meets works!`, e isso vai é incriiivel!

![Gif lobo escutando música](https://media.giphy.com/media/SQQ5VpVKhCM9O/giphy.gif)
