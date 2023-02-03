# Criando todos os nossos services

Para evitarmos ter que ficar parando uma explicação e voltando para criar mais um service, nós vamos fazer diferente.

Geralmente, quando você vai criar uma aplicação real você não tem noção de tudo que precisa fazer exatamente, mas aqui, é uma aula, então nós temos controle disso, vamos fazer assim para melhorar a dinâmica da nossa aula, para que você possa aprender mais rápido.

**O que eu recomendo você fazer é seguir os passos a seguir fazendo junto comigo no seu projeto local, e não copie e cole, escreva, assim você vai repetir como fazer vários services, isso vai ser gravado na sua mente, pode parecer bobo, mas funciona.**

É o seguinte, nós já criamos os seguintes services:

- Api
- Interceptor

Mas, falta alguns, são eles:

- User (Vai editar dados do usuário)
- Local (Vai facilitar o acesso ao localStorage)
- Auth (Vai fazer login e registro)
- Meet (Vai editar e criar reuniões, e salas)
- **Socket** (Vai fazer o conexão de voz na sala de reunião)

Então, vamos, de cima para baixo, criando cada um deles, o **Socket** vai ser bem diferente, e eu vou explicar ele com mais detalhes em outra aula, então não se preocupe com ele agora.

Mas aguueenta aii!
Vou te explicar mais uma coisa.

## **Types**

**Types**, ou também chamados de **Interfaces**, são como se fossem um modelo de dados, que você pode usar em qualquer lugar do seu projeto, e você pode criar quantos quiser, e usar quantos quiser.

Usamos isso para facilitar a criação de dados, e para facilitar a leitura de dados, e também para facilitar a edição de dados.

Como usamos o **Typescript**, isso o ajuda a entender que tipo de dado está lidando, e o VSCode até da dicas de como usar, e até mesmo te avisa se você está usando errado.

**A primeira coisa que vamos fazer, é criar todos os tipos!**

![Gif cara tirando o óculos](https://media.giphy.com/media/3o752a4k3F2yd19QeA/giphy.gif)

# Criando os nossos types

Dentro da pasta `src/app/types` crie um arquivo chamado `login-credentials.type.ts`:

```typescript
export type LoginCredentials = {
  login: string;
  password: string;
};

export type LoginReturnCredentials = {
  email: string;
  name: string;
  token: string;
};
```

Arquivos de tipos são bem simples, você pode ler mais sobre eles [aqui](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces).
E também pode ler a documentação oficial sobre [Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces).

Agora, vamos criar os arquivos seguintes:

`meet.type.ts`:

```typescript
export type Meet = {
  id: string;
  name: string;
  color: string;
  link: string;
};

export type MeetObject = {
  name: string;
  x: number;
  y: number;
  zindex: number;
  orientation: string;
};

export type MeetCompleteObject = {
  _id: string;
  name: string;
  x: number;
  y: number;
  zindex: number;
  orientation: string;
  selectMultiple: boolean;
  type: string;
  flexStart: boolean;
  canRotate: boolean;
};

export type MeetPut = {
  name: string;
  color: string;
  objects: MeetObject[];
};

export type MeetPost = {
  name: string;
  color: string;
};

export type MeetRoom = {
  link: string;
  name: string;
  color: string;
  objects: RoomObject[];
};

export type RoomObject = {
  walkable: boolean;
  _id: string;
  meet: string;
  name: string;
  x: number;
  y: number;
  zindex: number;
  orientation: string;
  __v: number;
};
```

`user.type.ts`:

```typescript
export type UserReturn = {
  name: string;
  email: string;
  avatar: string;
  id: string;
};

export type UserPut = {
  name: string;
  avatar: string;
};

export type UserLogged = {
  name: string;
  email: string;
  avatar: string;
  id: string;
};
```

`register-credentials.type.ts`:

```typescript
export type RegisterCredentials = {
  email: string;
  password: string;
  name: string;
  avatar: string;
};

export type RegisterReturnCredentials = {
  name: string;
  email: string;
  password: string;
  avatar: string;
  _id: string;
  __v: number;
};
```

# Criando a User Service

Agora, vamos criar o service de usuário, para isso, acesse `src/app/services` e crie um service com o nome de `user/user`.

Agora, vamos importar algumas coisas:

```typescript
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { UserPut, UserReturn } from "src/app/types/user.type";
```

Aqui, o `HttpClient` é o que faz a requisição para a API, o `Injectable` é o que faz o service ser injetável, o `ApiService` é o que faz a requisição para a API, e o `UserPut` e `UserReturn` são os tipos que criamos.

Agora, ao service:

```typescript
@Injectable({
  providedIn: "root",
})
export class UserService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject("DEVAMEET_URL_API") private _apiUrl: string
  ) {
    super(_http, _apiUrl);
  }

  getUser(): Promise<UserReturn> {
    return this.get("user");
  }

  updateUser(newUser: UserPut): Promise<any> {
    return this.put("user", newUser);
  }
}
```

Observe que usamos `extends` para extender a classe `ApiService`, e também usamos o `@Inject` para injetar a URL da API.

O que está acontecendo é que no constructor estamos criando as variáveis `_http` e `_apiUrl`, e passando para o constructor da classe pai através do `super`, usamos `_` para não ficar igual a classe pai, precisamos fazer isso para não dar erro, já que extendemos a `ApiService`.

Agora, vamos criar os métodos `getUser` e `updateUser`, o `getUser` é para pegar os dados do usuário, e o `updateUser` é para atualizar os dados do usuário.

Eles literalmente estão usando a classe pai, só que escolhendo o endpoint `user`, e no caso do `updateUser` está passando o parâmetro `newUser` para o método `put`.

# Criando o Local Storage Service

Agora, vamos criar o service de local storage, para isso, acesse `src/app/services` e crie um service com o nome de `local/localstorage`.

Agora, vamos importar algumas coisas:

```typescript
import { Injectable } from "@angular/core";
import { LoginReturnCredentials } from "src/app/types/login-credentials.type";
import { UserLogged, UserReturn } from "src/app/types/user.type";
```

Aqui, o `Injectable` é o que faz o service ser injetável, e o `LoginReturnCredentials`, `UserLogged` e `UserReturn` são os tipos que criamos.

Agora, ao service:

```typescript
@Injectable({
  providedIn: "root",
})
export class LocalstorageService {
  private localKeyPrefix: string = "@devameet:";
  constructor() {}

  setKeyPrefix(prefix: string): void {
    this.localKeyPrefix = prefix;
  }

  getLocalKey(key: string): string {
    return `${this.localKeyPrefix}${key}`;
  }
}
```

O que fizemos aqui foi primeiro, criar uma variável `localKeyPrefix` que é o prefixo que vai ficar no local storage, e depois criamos um método `setKeyPrefix` que é para setar o prefixo, e um método `getLocalKey` que é para pegar a chave do local storage com o prefixo.

Usamos esse prefixo pois, criando aplicações no mesmo domínio que no nosso caso é sempre `localhost`, pode acontecer de uma aplicação sobrescrever uma variável local da outra, então, para evitar isso, usamos o prefixo.

Agora, abaixo disso, vamos criar algumas funções a mais:

```typescript
  // getLocalKey ...

  // Local Storage

  setItem(key: string, value: string): void {
    localStorage.setItem(this.getLocalKey(key), value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.getLocalKey(key));
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getLocalKey(key));
  }
```

O `setItem` é para setar um item no local storage, o `getItem` é para pegar um item do local storage, e o `removeItem` é para remover um item do local storage.

Agora, abaixo destes, vamos criar algumas funções auxiliares que utilizam esses métodos:

```typescript
  // Helper Functions
  setLogin(login: LoginReturnCredentials) {
    this.setItem('token', login.token);
    this.setItem('name', login.name);
    this.setItem('email', login.email);
  }

  setLogout() {
    this.removeItem('token');
    this.removeItem('name');
    this.removeItem('email');
    this.removeItem('id');
    this.removeItem('avatar');
  }

  setUser(user: UserReturn) {
    this.setItem('id', user.id);
    if (user.avatar) {
      this.setItem('avatar', user.avatar);
    }
  }

  getUserLogged(): UserLogged {
    return {
      name: this.getItem('name'),
      email: this.getItem('email'),
      id: this.getItem('id'),
      avatar: this.getItem('avatar'),
    } as UserLogged;
  }

  getToken(): string | null {
    return this.getItem('token');
  }
```

Vamos lá, o `setLogin` é para setar os dados do login, ao fazer login nós recebemos o token, o nome e o email, então, setamos esses dados no local storage.

O `setLogout` é para remover os dados do login, ao fazer logout, nós removemos os dados do login do local storage.

O `setUser` é para setar os dados do usuário, ao pegar os dados do usuário, nós recebemos o id e o avatar, então, setamos esses dados no local storage.

O `getUserLogged` é para pegar os dados do usuário, ele retorna um objeto com os dados do usuário, e o `getToken` é para pegar o token.

Sua `localstorage.service.ts` deve ficar assim:

```typescript
import { Injectable } from "@angular/core";
import { LoginReturnCredentials } from "src/app/types/login-credentials.type";
import { UserLogged, UserReturn } from "src/app/types/user.type";

@Injectable({
  providedIn: "root",
})
export class LocalstorageService {
  private localKeyPrefix: string = "@devameet:";
  constructor() {}

  setKeyPrefix(prefix: string): void {
    this.localKeyPrefix = prefix;
  }

  getLocalKey(key: string): string {
    return `${this.localKeyPrefix}${key}`;
  }

  // Local Storage

  setItem(key: string, value: string): void {
    localStorage.setItem(this.getLocalKey(key), value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(this.getLocalKey(key));
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.getLocalKey(key));
  }

  // Helper Functions
  setLogin(login: LoginReturnCredentials) {
    this.setItem("token", login.token);
    this.setItem("name", login.name);
    this.setItem("email", login.email);
  }

  setLogout() {
    this.removeItem("token");
    this.removeItem("name");
    this.removeItem("email");
    this.removeItem("id");
    this.removeItem("avatar");
  }

  setUser(user: UserReturn) {
    this.setItem("id", user.id);
    if (user.avatar) {
      this.setItem("avatar", user.avatar);
    }
  }

  getUserLogged(): UserLogged {
    return {
      name: this.getItem("name"),
      email: this.getItem("email"),
      id: this.getItem("id"),
      avatar: this.getItem("avatar"),
    } as UserLogged;
  }

  getToken(): string | null {
    return this.getItem("token");
  }
}
```

**Agora, só falta a Auth e a Meet!**

![Gif quase lá](https://media.giphy.com/media/EDt1m8p5hqXG8/giphy.gif)

# Criando o Auth Service

Como você já sabe, acesse `src/app/services` e crie um service com o nome de `auth/auth`.

Agora, vamos importar algumas coisas:

```typescript
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  LoginCredentials,
  LoginReturnCredentials,
} from "src/app/types/login-credentials.type";
import { UserService } from "../user/user.service";
import { LocalstorageService } from "../local/localstorage.service";
import { UserLogged } from "src/app/types/user.type";
import {
  RegisterCredentials,
  RegisterReturnCredentials,
} from "src/app/types/register-credentials.type";
```

Uaall, quantas importações! Aqui você pode entender o por que criamos `local` e `user` primeiro, nós usamos essas duas services aqui, até por que, a `auth` usa elas, a auth service cuida de logar e cadastrar as pessoas na aplicação, além claro de informar algumas outras coisas.

Agora, vamos criar o service:

```typescript
@Injectable({
  providedIn: "root",
})
export class AuthService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject("DEVAMEET_URL_API") private _apiUrl: string,
    private router: Router,
    private userApiService: UserService,
    private localStorageService: LocalstorageService
  ) {
    super(_http, _apiUrl);
  }
}
```

Aqui, nós usamos o `extends` para extender a `ApiService`, e usamos o `@Inject` para injetar a url da api, que é a mesma url da api que usamos no `api.service.ts`.

O `router` é para fazer o redirecionamento de páginas, o `userApiService` é para fazer as requisições para a api de usuários, e o `localStorageService` é para pegar coisas do local storage.

Agora, **de uma pausa, uma respirada, pois as duas funções a seguir são bem extensas!**

## **Função de login**

Abaixo do constructor, vamos criar a `login`:

```typescript
// Constructor ...
  async login(credentials: LoginCredentials): Promise<void> {
    const response: LoginReturnCredentials = await this.post(
      'auth/login',
      credentials
    );

    if (!response.token) throw new Error('Token not found!');

    this.localStorageService.setLogin(response);

    const userData = await this.userApiService.getUser();
    this.localStorageService.setUser(userData);

    // Redirect after login
    const actualLocation = this.router.url;

    if (actualLocation === '/') {
      window.location.reload();
    }

    this.router.navigateByUrl('/');
  }
```

A primeira coisa é fazer um `post` para a rota `auth/login`, passando as credenciais, e esperar a resposta, que é um objeto com o token, o nome e o email.

Se não tiver o token, então, é porque deu algum erro, então, lançamos um erro `if (!response.token) throw new Error('Token not found!');`.

Depois, setamos os dados do login no local storage, com `this.localStorageService.setLogin(response);`.

Depois, pegamos os dados do usuário, com `const userData = await this.userApiService.getUser();`, e setamos os dados do usuário no local storage, com `this.localStorageService.setUser(userData);`.

Depois, pegamos a rota atual, com `const actualLocation = this.router.url;`, e se a rota atual for `/`, então, recarregamos a página, com `window.location.reload();`, mas por que?

Fazemos isso com as rotas, por que a página inical que ficará na rota `/` também servirá de login, então, a página de `home` e `login`, dividem a mesma rota, você via entender melhor quando fizermos a página de "login/home", mas por enquanto, só fique sabendo que a página de login e a página de home, dividem a mesma rota.

## **Função de cadastro**

Abaixo da função de login, vamos criar a `register`:

```typescript
// Login ...
  async register(form: RegisterCredentials): Promise<void> {
    const response: RegisterReturnCredentials = await this.post(
      'auth/register',
      form
    );

    if (!response._id) throw new Error('Register Error!');

    await this.login({
      login: form.email,
      password: form.password,
    });

    this.router.navigateByUrl('/');
  }
```

A primeira coisa é fazer um `post` para a rota `auth/register`, passando as credenciais, e esperar a resposta, que é um objeto com o id do usuário.

Se não tiver o id, então, é porque deu algum erro, então, lançamos um erro `if (!response._id) throw new Error('Register Error!');`.

Depois, fazemos o login, com `await this.login({ login: form.email, password: form.password });`.

Depois, redirecionamos para a página inicial, com `this.router.navigateByUrl('/');`.

## **Funções Auxiliares**

Agora, vamos criar algumas funções auxiliares, para facilitar a vida:

```typescript
// Register ...
  isLogged(): boolean {
    return this.localStorageService.getItem('token') !== null;
  }

  logout(): void {
    this.localStorageService.setLogout();
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return this.localStorageService.getItem('token');
  }

  getUserLogged(): UserLogged {
    return this.localStorageService.getUserLogged();
  }
```

A primeira função, `isLogged`, verifica se o usuário está logado, com `return this.localStorageService.getItem('token') !== null;`.

A segunda função, `logout`, faz o logout, com `this.localStorageService.setLogout();`, e redireciona para a página inicial, com `this.router.navigateByUrl('/');`.

A terceira função, `getToken`, pega o token, com `return this.localStorageService.getItem('token');`.

A quarta função, `getUserLogged`, pega os dados do usuário logado, com `return this.localStorageService.getUserLogged();`.

O seu `auth.service.ts` deve ficar assim:

```typescript
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import {
  LoginCredentials,
  LoginReturnCredentials,
} from "src/app/types/login-credentials.type";
import { UserService } from "../user/user.service";
import { LocalstorageService } from "../local/localstorage.service";
import { UserLogged } from "src/app/types/user.type";
import {
  RegisterCredentials,
  RegisterReturnCredentials,
} from "src/app/types/register-credentials.type";

@Injectable({
  providedIn: "root",
})
export class AuthService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject("DEVAMEET_URL_API") private _apiUrl: string,
    private router: Router,
    private userApiService: UserService,
    private localStorageService: LocalstorageService
  ) {
    super(_http, _apiUrl);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    const response: LoginReturnCredentials = await this.post(
      "auth/login",
      credentials
    );

    if (!response.token) throw new Error("Token not found!");

    this.localStorageService.setLogin(response);

    const userData = await this.userApiService.getUser();
    this.localStorageService.setUser(userData);

    // Redirect after login
    const actualLocation = this.router.url;

    if (actualLocation === "/") {
      window.location.reload();
    }

    this.router.navigateByUrl("/");
  }

  async register(form: RegisterCredentials): Promise<void> {
    const response: RegisterReturnCredentials = await this.post(
      "auth/register",
      form
    );

    if (!response._id) throw new Error("Register Error!");

    await this.login({
      login: form.email,
      password: form.password,
    });

    this.router.navigateByUrl("/");
  }

  isLogged(): boolean {
    return this.localStorageService.getItem("token") !== null;
  }

  logout(): void {
    this.localStorageService.setLogout();
    this.router.navigateByUrl("/");
  }

  getToken(): string | null {
    return this.localStorageService.getItem("token");
  }

  getUserLogged(): UserLogged {
    return this.localStorageService.getUserLogged();
  }
}
```

# Criando o Meet Service

Agora, vamos criar o service de meet, para isso, acesse `src/app/services` e crie um service com o nome de `meet/meet`.

O seu `meet.service.ts` deve ficar assim:

```typescript
import { Inject, Injectable } from "@angular/core";
import { ApiService } from "../api/api.service";
import { HttpClient } from "@angular/common/http";
import { Meet, MeetPost, MeetPut, MeetRoom } from "src/app/types/meet.type";

@Injectable({
  providedIn: "root",
})
export class MeetService extends ApiService {
  constructor(
    protected _http: HttpClient,
    @Inject("DEVAMEET_URL_API") private _apiUrl: string
  ) {
    super(_http, _apiUrl);
  }

  getRoom(link: string): Promise<MeetRoom> {
    return this.get(`room/${link}`);
  }

  getMeets(): Promise<Meet[]> {
    return this.get("meet");
  }

  getMeet(id: string): Promise<Meet> {
    return this.get(`meet/${id}`);
  }

  getMeetObjects(id: string): Promise<any> {
    return this.get(`meet/objects/${id}`);
  }

  deleteMeet(id: string): Promise<void> {
    return this.delete(`meet/${id}`);
  }

  createMeet(meet: MeetPost): Promise<void> {
    return this.post("meet", meet);
  }

  updateMeet(id: string, meet: MeetPut): Promise<void> {
    return this.put(`meet/${id}`, meet);
  }
}
```

O que está acontecendo aqui é o seguinte.

**Primeiramente, devo dizer que `meet` é uma reunião e `room` é a sala de reunião ativa, nossa aplicação é tipo um Google Meets, aonde as pessoas podem ter suas `meet` que são salas de reuniões, e quando alguem entra nessas salas de fato elas viram `room`.**

Primeiro, importamos o `Injectable` e o `ApiService`, para que possamos criar um service.

A função `getRoom` pega a sala, uma sala é uma sala de reunião, você vai entender isso no projeto, com `return this.get('room/${link}');`.

A função `getMeets` pega os meets do usuário, um usuário poderá ter várias salas de reunião, com `return this.get('meet');`.

A função `getMeet` pega um meet, com `return this.get('meet/${id}');`.

A função `getMeetObjects` pega os objetos de um meet, com `return this.get('meet/objects/${id}');`.

A função `deleteMeet` deleta um meet, com `return this.delete('meet/${id}');`.

A função `createMeet` cria um meet, com `return this.post('meet', meet);`.

A função `updateMeet` atualiza um meet, com `return this.put('meet/${id}', meet);`.

# Finalmente, terminamos!

Aleluiiaa, finalmente temos quase todas as `services` que precisamos já criadas e disponíveis.

Vamos continuar.

![Gif dano emocional](https://media.giphy.com/media/ro08ZmQ1MeqZypzgDN/giphy.gif)
