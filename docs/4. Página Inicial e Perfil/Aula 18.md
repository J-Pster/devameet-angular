# Recapitulando

Vamos recapitular, até agora nós temos as seguintes páginas prontas:

- Login
- Register
- Meets (página de listagem de meetings)

Bacana, ainda faltam muitas, por enquanto, mas nós vamos acelerar as coisas agora, tudo bem?

Até então, você aprendeu muitas coisas sobre o Angular 15+, nesse ponto você já deve estar se sentindo um pouco mais confortável com o framework, certo?

As únicas coisas a seguir que talvez você não vai estar familiarizado será com a questão do WebSocket que é algo que vamos ver só lá na última página que vamos criar, daqui até lá serão simples `@Input`, `@Output`, Componentes, Módulos, Rotas, `NgClass`, Refs de formulário, instanciamento de serviços, e coisas que você já viu.

# Fazendo a página de profile

A próxima página que vamos fazer será bem, bem simples, é a página de perfil, dê uma olhada nas imagens do Figma abaixo:

Desktop:

![Perfil Desk 01](https://i.imgur.com/zCg7Gci.png)
![Perfil Desk 02](https://i.imgur.com/5P5tBvF.png)

Mobile:

![Perfil Mob 01](https://i.imgur.com/mPMwea3.png)
![Perfil Mob 02](https://i.imgur.com/57COjJz.png)

Perceba que elas são bem parecidas, as únicas diferenças são a posição do botão de sair.

**ALERTA! Na parte de alterar o avatar, será diferente, será igual a página de registro.**

Observando mais profundamente podemos ver algumas coisas, mas antes de ler a lista, tente observar e analisar você mesmo as imagens do Figma em busca de componentes!

Os componentes que eu vejo nessa página são os seguintes:

- Header n Footer, para colocar o cabeçalho o rodapé.
- Button para fazer os botões
- Input para colocar o input de nome.
- Avatar e Upload Avatar para fazer alteração de avatar.
- Modal de Avatares

Todos os componentes que eu citei acima já existem, ou seja, essa página será uma mescla desses componentes com algumas coisas só dela, como esse card centralizado que contem o form, e ai, bora fazer?

## **Criando a página com rota**

Primeiro, vá até `src/app/pages`, clique com o botão direito, escolha `Angular: Generate a Module`, coloque o nome de `profile`, aperte enter, e escolha `Lazy-loaded module of pages` e depois `Confirm`.

Lembre-se, é assim que se cria uma página com rota e módulo para ela.

## **Modificando o Módulo**

Primeiro, vamos importar algumas coisas que vamos precisar para criar essa página, como você pode ver na analise de quais componentes serão usados, já deve imaginar que `SharedDecoratorsModule`, `SharedComponentsModule` vão ser importados.

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileRoutingModule } from "./profile-routing.module";
import { ProfileComponent } from "./profile.component";
import { SharedComponentsModule } from "src/app/shared/components/shared-components.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedDecoratorsModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
})
export class ProfileModule {}
```

Esse será o nosso módulo.

## **Modificando o TS**

A primeira coisa será importar o que vamos precisar para essa página funcionar:

```typescript
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { AvatarModalComponent } from "src/app/shared/components/avatar-modal/avatar-modal.component";
import { UserService } from "src/app/services/user/user.service";
import { AuthService } from "src/app/services/auth/auth.service";

// ...
```

Agora, vamos criar nossas variáveis e nosso constructor:

```typescript
// Importações ...

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  avatarSrc: string = "avatar_07_front";
  name: string = "Usuário";

  form: FormGroup;
  disabledName: boolean = true;

  constructor(
    private localStorageService: LocalstorageService,
    private authService: AuthService,
    private userService: UserService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
    });
  }
}
```

Aqui, temos algumas variáveis, elas servem para o seguinte:

- `avatarSrc`: Essa variável é a que vai guardar o avatar do usuário, ela é iniciada com o avatar padrão.
- `name`: Essa variável é a que vai guardar o nome do usuário, ela é iniciada com o nome padrão.
- `form`: Essa variável é o form, ela é iniciada com o formBuilder.
- `disabledName`: Essa variável é a que vai dizer se o input de nome está desabilitado ou não, ela é iniciada como `true`.

No nosso construtor a gente instancia algumas services e criamos o nosso formulário que só conterá o nome.

Agora, vamos para mais algumas funções:

```typescript
// Constructor ...
  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  togleName() {
    this.disabledName = !this.disabledName;

    if (!this.disabledName) {
      this.getFormRef('name').setValue('');
    }
  }
```

Aqui, temos duas funções:

- `getFormRef`: Essa função é a que vai pegar o form, ela recebe o nome do campo e retorna o campo.
- `togleName`: Essa função é a que vai alternar o input de nome, ela vai alternar entre desabilitado e habilitado.

Agora, a função `ngOnInit` que é tipo o `componentDidMount` do React por Classe, ou `useEffect` do React por Função:

```typescript
  ngOnInit(): void {
    const avatarLocal = this.localStorageService.getItem('avatar');
    if (avatarLocal) this.avatarSrc = avatarLocal;

    const nameLocal = this.localStorageService.getItem('name');
    if (nameLocal) this.name = nameLocal;
  }
```

Aqui, temos duas coisas:

- `avatarLocal`: Essa variável é a que vai pegar o avatar do localStorage, se tiver um avatar no localStorage, ela vai pegar e colocar na variável `avatarSrc`.
- `nameLocal`: Essa variável é a que vai pegar o nome do localStorage, se tiver um nome no localStorage, ela vai pegar e colocar na variável `name`.

Agora, vamos para a função `openDialog`:

```typescript
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
```

Essa função é sempre muito parecida, nós usamos uma muito semelhante lá no `register`, para abrir o mesmo modal inclusive.

Agora, vamos para as funções `on`:

```typescript
  onLogout() {
    this.authService.logout();
  }

  onCancel() {
    this.route.navigateByUrl('/');
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const formValues = this.form.value;

    this.userService
      .updateUser({
        name: formValues.name,
        avatar: this.avatarSrc,
      })
      .then(() => {
        this.localStorageService.setItem('name', formValues.name);
        this.localStorageService.setItem('avatar', this.avatarSrc);

        this._snackBar.open('Perfil atualizado com sucesso!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.route.navigateByUrl('/');
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao atualizar perfil!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }
```

Aqui, temos três funções:

- `onLogout`: Essa função é a que vai fazer o logout do usuário através de uma função que fizemos lá no authService, vá lá e leia ela.
- `onCancel`: Essa função é a que vai cancelar a edição do perfil e voltar para a página inicial.
- `onSubmit`: Essa função é a que vai fazer a edição do perfil, ela vai pegar o nome e o avatar do usuário e vai fazer uma requisição para a API para atualizar o perfil do usuário.

Pronto, esse é o TS!

## **Modificando o HTML**

A primeira coisa que precisamos fazer é usar o nosso `app-header-n-footer` para adicionar cabeçalho e rodapé.

```html
<app-header-n-footer active="profile" cssClass="profile"> </app-header-n-footer>
```

Nós passamos o `active` como profile para que nosso header e footer saibam de que página se trata, e passamos o `cssClass` como `profile`, lá no header tem uma classe CSS especial que vai fazer o header desaparecer no mobile quando a gente estiver na página de perfil, de uma olhada no Figma na versão mobile.

Agora, vamos criar uma `<section>`, se você observar no Figma o fundo tem aquele desenho bonito, esse desenho vai ficar nessa `<section>`.

```html
<app-header-n-footer active="profile" cssClass="profile">
  <section></section>
</app-header-n-footer>
```

Agora, finalmente vamos criar o nosso `<div class="container">`, essa div vai ser aquele quadrado no meio da tela, que conterá o formulário, eu vou colar a `<div>` inteira aqui, de uma olhada nela e analise cada parte:

```html
<app-header-n-footer active="profile" cssClass="profile">
  <section>
    <div class="container">
      <div class="header">
        <app-button
          classeCss="cinzaSoTexto"
          texto="Cancelar"
          cor="texto"
          (click)="onCancel()"
        ></app-button>
        <h1>Editar perfil</h1>
        <app-button
          classeCss="soTexto"
          texto="Concluir"
          cor="texto"
          (click)="onSubmit()"
        ></app-button>
      </div>

      <app-upload-avatar (aoAtualizarImagem)="openDialog()">
        <app-avatar [src]="avatarSrc" classeCss="avatarCadastro"></app-avatar>
      </app-upload-avatar>

      <div class="name">
        <div class="nameInput">
          <p>Nome</p>
          <app-input
            [disabled]="disabledName"
            [default]="name"
            cssClass="profile"
            tipo="text"
            placeholder="Nome"
            [referenciaFormulario]="getFormRef('name')"
          ></app-input>
        </div>
        <img (click)="togleName()" src="assets/images/icons/x-circle.svg" />
      </div>
      <div id="exit" (click)="onLogout()">
        <img src="assets/images/icons/leave.svg" />
        <p>Sair</p>
      </div>
    </div>
  </section>
</app-header-n-footer>
```

## **Modificando o SCSS**

Agora, vamos para o SCSS:

```scss
@import "/src/styles.scss";

section {
  background-image: url("../../../assets/images/background.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: calc(100vh - 55px);

  @media screen and (min-width: $desktopBreakpoint) {
    height: calc(100vh - 65px);

    @include flex(column, center, center);
  }
}

.container {
  @include flex(column, flex-start, center);
  background-color: #fff;
  position: relative;

  height: 100%;
  width: 100%;

  @media screen and (min-width: $desktopBreakpoint) {
    width: 620px;
    height: 620px;

    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14);
    padding: 20px;
  }

  #exit {
    @include flex(row, flex-start, center);
    position: absolute;

    bottom: 16px;
    left: 0;
    right: 0;
    margin: 0 auto;
    width: 60px; /* Need a specific value to work */

    cursor: pointer;

    img {
      width: 24px;
      height: 24px;

      margin-right: 10px;
    }

    p {
      margin: 0;
      color: var(--primaria03);
      font-size: 14px;
      font-weight: 500;
    }

    @media screen and (min-width: $desktopBreakpoint) {
      bottom: 16px;
      left: 16px;
      margin: 0;
    }
  }
}

.header {
  @include flex(row, space-between, center);
  padding: 12px 16px;
  width: calc(100% - 32px);
  border-bottom: 1px solid var(--cinza01);

  h1 {
    font-size: 16px;
    font-weight: 600;
    font-family: var(--fontBold);
    color: var(--cinza04);

    margin: 0;
  }

  @media screen and (min-width: $desktopBreakpoint) {
  }
}

app-upload-avatar {
  padding: 20px;
}

.name {
  @include flex(row, space-between, center);
  padding: 16px;
  width: calc(100% - 32px);

  border-bottom: 1px solid var(--cinza01);
  border-top: 1px solid var(--cinza01);

  img {
    width: 20px;
    height: 20px;

    cursor: pointer;
  }

  .nameInput {
    @include flex(row, flex-start, center);
    p {
      font-size: 14px;
      font-weight: 400;
      color: var(--cinza03);

      margin: 0;
    }
  }
}
```

## **Modificando o Routes**

Proontinho, se você for até `http://localhost:4200/profile` você vai ver a página de perfil funcionando perfeitamente, mas ela não está protegida, qualquer um pode entrar, então vamos arrumar isso!

Vá até `src/app/app-routing.module.ts`, procure pelo `path: 'profile'` e adicione o `canActivate: [JwtAuthGuard]`:

```typescript
// Outras importações ...
import { JwtAuthGuard } from "./guards/jwt/jwt-auth.guard";
// ...

const routes: Routes = [
  // ...
  {
    path: "profile",
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import("./pages/profile/profile.module").then((m) => m.ProfileModule),
  },
  // ...
];
```

Agora sim!
