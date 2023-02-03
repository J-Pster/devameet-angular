# Explicando e criando nossos guards

Bem, você já deve ter tentado acessar o GMail sem estar logado, ou o Facebook, ou o Instagram, e não conseguiu, isso é por que essas aplicações precisam que você tenha uma conta para serem usadas.

A questão é, para fazer com que uma rota seja protegida, ou seja, guardada, impeça de acessar sem um usuário válido, precisamos criar um guard.

Um guard é um serviço que pode ser injetado em uma rota, e que pode ser usado para verificar se o usuário pode acessar aquela rota ou não.

Nós vamos criar dois guards para a nossa aplicação, o `jwt` que fara a certificação do token, testando se ele é válido para continuar, e o `register` que será usado na página de registro para impedir que ela seja acessada por um usuário logado.

O motivo de ter só esses dois você vai entender melhor quando terminarmos de criar a aplicação.

# Criando o Guard JWT

Para criar um guard, vamos até `src/app/guards`, clique com o botão direito na pasta e escolha `Angular: Generate Another Schematic`, digite guard e clique em `guard`.

O nome será `jwt/jwt-auth`, e aperte `Enter`, agora vai aparecer uma lista de opções, a primeira será `implements` e ela vai estar marcada, clique em `OK`, agora, selecione `CanActive` e clique em `OK` novamente, por fim, clique em `Confirm` e pronto!

Primeiro, vamos importar algumas coisas que precisamos:

```typescript
// Outras importações padrão ...
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { UserService } from "src/app/services/user/user.service";
```

Agora, vamos criar um construtor para o nosso guard, e injetar os serviços que precisamos:

```typescript
@Injectable({
  providedIn: "root",
})
export class JwtAuthGuard implements CanActivate {
  constructor(
    private localStorage: LocalstorageService,
    private userService: UserService,
    private router: Router
  ) {}

  // Função que já veio com o guard, geralmente chamada de canActivate
}
```

O que estamos fazendo é instanciar dois services, o de usuários e o de localStorage, e também instanciamos o router que usado para redirecionar o usuário para outra rota.

Agora, vamos criar uma função auxiliar que será usada para testar o token, e ver se ele é válido:

```typescript
// Constructor ...

  private checkToken(): Promise<boolean | UrlTree> {
    return this.userService
      .getUser()
      .then((response) => {
        if (!response.id) {
          this.localStorage.setLogout();
          return this.router.parseUrl('/');
        }

        return true;
      })
      .catch((error) => {
        this.localStorage.setLogout();
        return this.router.parseUrl('/');
      });
  }

// Função canActivate ...
```

Observe que estamos usando o `userService.getUser()` para pegar os dados do usuário, e se ele não tiver um id, ou seja, se o token for inválido, vamos limpar o localStorage e redirecionar o usuário para a página de login.

Ah, se der um erro, no `catch` vamos fazer a mesma coisa.

Agora, vamos modificar a `canActivate` para isso aqui:

```typescript
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // ESSE AUTH GUARD NUNCA PODE SER USADO NA ROTA '/', SE FOR USADO, ELE CAUSARÁ UM LOOP QUE CONGELARÁ O CARREGAMENTO

    const token = this.localStorage.getToken();
    if (!token) {
      return this.router.parseUrl('/');
    }

    return this.checkToken();
  }
```

Observe que estamos pegando o token do localStorage, e se ele não existir, vamos redirecionar o usuário para a página de login.

Depois, usamos a função auxiliar que criamos para testar o token, e se ele for válido, vamos retornar `true`, se não, vamos redirecionar o usuário para a página de login, essa lógica está na função auxiliar.

Observe o comentário, eu digo para nunca usar esse guard na rota `/`, lembram que eu disse que a rota `/` é o "login e o home" ao mesmo tempo, poisé, imagine que implementemos isso na `/`, e o usuário está deslogado, ou seja, ele precisa ser redirecionado para `/` novamente de acordo com a `checkToken()`, isso vai gerar um loop infinito que vai travar a aplicação.

Por fim, seu guard deve ficar assim:

```typescript
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { UserService } from "src/app/services/user/user.service";

@Injectable({
  providedIn: "root",
})
export class JwtAuthGuard implements CanActivate {
  constructor(
    private localStorage: LocalstorageService,
    private userService: UserService,
    private router: Router
  ) {}

  private checkToken(): Promise<boolean | UrlTree> {
    return this.userService
      .getUser()
      .then((response) => {
        if (!response.id) {
          this.localStorage.setLogout();
          return this.router.parseUrl("/");
        }

        return true;
      })
      .catch((error) => {
        this.localStorage.setLogout();
        return this.router.parseUrl("/");
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // ESSE AUTH GUARD NUNCA PODE SER USADO NA ROTA '/', SE FOR USADO, ELE CAUSARÁ UM LOOP QUE CONGELARÁ O CARREGAMENTO

    const token = this.localStorage.getToken();
    if (!token) {
      return this.router.parseUrl("/");
    }

    return this.checkToken();
  }
}
```

# Criando o Guard Register

Esse guard é mais simples, o uso dele será simplesmente para evitar que alguem logado (ou seja que tenha um token no localStorage) entre na rota de registro, pois se ele estiver logado, ele não precisa se registrar novamente.

Crie o guard, assim como você criou o `jwt-auth.guard.ts`, na pasta `src/app/guards` mas dessa vez com o nome de `register/register`.

O guard tem que ficar assim:

```typescript
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { LocalstorageService } from "src/app/services/local/localstorage.service";

@Injectable({
  providedIn: "root",
})
export class RegisterGuard implements CanActivate {
  constructor(
    private localStorage: LocalstorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.localStorage.getToken();
    if (token) {
      return this.router.parseUrl("/");
    }

    return true;
  }
}
```

Como eu disse, bem simples, leia a `canActivate` e tente entender.

# E agora, o que vamos fazer?

Muito bem, criamos nossos `services`, criamos nossos `guards`, o que precisamos para criar quase toda a aplicação está pronta, agora vamos atacar de verdade, e criar as páginas e componentes que vamos precisar.

Agora, nós vamos implementar o service de localStorage no componente de `avatar` e vamos implementar o service de auth no componente de `register`, mas antes, vamos implementar nosso `guard` Register na rota de registro.

![Gif carinha dando okay](https://media.giphy.com/media/JQQwgVUMDIyAM/giphy.gif)

# Implementando o Guard Register

Vá até `src/app/app-routing.module.ts` e importe o guard de registro, assim:

```typescript
// Outras importações ...
import { RegisterGuard } from "./guards/register/register.guard";
// ...
```

Agora, vá até a rota de registro `register` que está no objeto `routes` e adicione o guard, assim:

```typescript
  {
    path: 'register',
    canActivate: [RegisterGuard],
    loadChildren: () =>
      import('./pages/register/register.module').then((m) => m.RegisterModule),
  },
```

Pronto, agora a rota de registro só pode ser acessada se o usuário não estiver logado.

Se caso por algum motivo você caia nessa regra, isso seria bem estranho, mas significa que você tem uma chave de acesso no localStorage, então, limpe o localStorage e tente novamente.

# Implementando localStorage no componente de avatar

Agora que finalmente temos o nosso service de localStorage pronto, vamos usar ele.

Vá até `src/app/shared/components/avatar/avatar.component.ts` e importe o service de localStorage, assim:

```typescript
// Outras Importações ...
import { LocalstorageService } from "src/app/services/local/localstorage.service";

// ...
```

Agora, vamos criar um constructor, com o que precisamos, assim:

```typescript
  constructor(private localStorageService: LocalstorageService) {}
```

Agora, vamos alterar o `getAvatar()` para que ele pegue o avatar do localStorage, assim:

```typescript
  public getAvatar(): string {
    if (this.src) {
      return `assets/images/objects/avatar/${this.src}.png`;
    }

    const fromLocal = this.localStorageService.getItem('avatar');
    if(!fromLocal) return 'assets/images/objects/avatar/avatar_07_front.png';

    return `assets/images/objects/avatar/${fromLocal}.png`;
  }
```

Top demais, agora sim hein!

# Implementando auth no componente de register

Vamos até `src/app/pages/register/register.component.ts` e vamos importar o service de auth, assim:

```typescript
// Outras importações ...
import { AuthService } from "src/app/services/auth/auth.service";
// ...
```

Agora, vamos instanciar isso no constructor, assim:

```typescript
  constructor(
    // Outras coisas no construtor ...
    private authService: AuthService,
  ) {
    // Resto do construtor ...
  }
```

Agora, vamos modificar a função `aoSubmeter()`, assim:

```typescript
  public async aoSubmeter() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const formValues = this.form.value;

    this.authService
      .register({
        name: formValues.nome,
        email: formValues.email,
        password: formValues.password,
        avatar: this.avatarSrc,
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        const errorMsg = err.error.message || 'Erro ao registrar usuário!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }
```

Perceba que simplesmente usamos o `authService` para registrar o usuário, e caso dê erro, ele cai no `catch` e mostra uma mensagem de erro usando novamente a `snackBar`.

O seu componente de `register` deve ficar assim:

```typescript
import { Component } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AvatarModalComponent } from "src/app/shared/components/avatar-modal/avatar-modal.component";
import { MatDialog } from "@angular/material/dialog";

import { passwordValidator } from "src/app/shared/validators/pass.validator";
import { confirmPassVal } from "src/app/shared/validators/confirm-pass.validator";

import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  public form: FormGroup;
  public avatarSrc: string = "avatar_07_front";

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nome: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
      confirmPass: ["", [Validators.required, confirmPassVal()]],
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

    this.authService
      .register({
        name: formValues.nome,
        email: formValues.email,
        password: formValues.password,
        avatar: this.avatarSrc,
      })
      .catch((err) => {
        console.error("ERROR: ", err);
        const errorMsg = err.error.message || "Erro ao registrar usuário!";
        this._snackBar.open(errorMsg, "OK", {
          duration: 6000,
          verticalPosition: "top",
        });
      });
  }

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
}
```

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif guaxinim batendo palmas](https://media.giphy.com/media/Hc8PMCBjo9BXa/giphy.gif)
