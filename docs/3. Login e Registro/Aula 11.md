# Explicando o que é um service, e um interceptor

Bem, agora que fizemos a nossa página de registro, nós vamos para a parte funcional da página, a página de registro, assim como a página de login e outras páginas da nossa aplicação, precisarão de informações que virão ou serão enviadas para um Back-End, por isso, nós usamos `services`!

Mas não vamos ficar criando get, put, post e patch em todas as services, vamos criar uma service "pai", chamada de `api`, e todas as outras services irão herdar essa service, assim, todas as services irão ter os métodos get, put, post e patch, e assim, não precisaremos ficar criando esses métodos em todas as services.

## O que é um service?

Um service é uma classe que contém métodos que podem ser usados em qualquer lugar da aplicação, nós criamos services para cada tipo de coisa que queremos trabalhar, por exemplo, um service para `autenticação` que fará cadastro e login, um para `meet` que fara criação e atualização das reuniões, um para `user` que fara alteração de informações do usuário, e por ai vai.

O motivo de fazermos dessa forma no Angular, é para seguir o padrão do Angular que é o `Dependency Injection`, Dependency Injection é um padrão de projeto que diz que uma classe não deve ser responsável por criar suas dependências, ou seja, uma classe não deve ser responsável por criar um objeto de outra classe, ela deve receber esse objeto de outra classe, e essa outra classe é responsável por criar esse objeto, e essa outra classe é chamada de `service`.

## O que é um interceptor?

Um interceptor é um service que intercepta as requisições HTTP que são feitas na aplicação, e ele pode fazer coisas com essas requisições, por exemplo, ele pode adicionar um token de autenticação em todas as requisições, ou ele pode adicionar um header em todas as requisições, ou ele pode fazer qualquer outra coisa com as requisições.

Isso é muito útil, pois assim, nós não precisamos adicionar o token em todas as requisições, nós apenas adicionamos o interceptor que adiciona o token em todas as requisições, e assim, nós não precisamos ficar manualmente fazendo isso, o que evita erros e é novamente um padrão do Angular.

## O que é uma service abstrata?

Como dito antes, vamos criar uma service chamada de `api`, e todas as outras services irão herdar essa service, isso é para evitar repetição de código, tudo que vamos fazer em services, ou quase tudo, vai envolver trabalhar com API, e os métodos que vamos usar para trabalhar com API são sempre os mesmos, então, criamos uma `service` "abstrata", para conter esses métodos.

# Criando nossa service api

A primeira que iremos criar, a service "pai", para criar um service é bem parecido com a forma de criar componentes e módulos, até por que estamos todos usando o CLI do Angular.

Vá até a pasta `src/services` e clique com o botão direito nela, agora, escolha `Angular: Generate Service`, e escolha o nome `api/api` ou seja, o campo deve ficar mais ou menos assim `services/pi/api`, nós repetimos o nome duas vezes por que o primeiro é o nome da pasta e o segundo o nome da service, aperte `Enter` e depois escolha `Confirm`

Se fez tudo certo, vai ter criado uma pasta chamada `api` dentro da pasta `services`! Top, e dentro da pasta `api` terão dois arquivos `api.service.ts` e `api.service.spec.ts`, o primeiro é o arquivo da service, e o segundo é o arquivo de teste da service.

## Adicionando dependências no app.module.ts

Antes de continuarmos, precisaremos importar o módulo do Angular que nos permite fazer requisições HTTP, para isso, abra o arquivo `app.module.ts` e adicione o seguinte código:

```typescript
import { environment } from "src/environment/environment";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
```

Nós estamos importando não somente o módulo do Angular que nos permite fazer requisições HTTP, mas também o `HTTP_INTERCEPTORS`, que é o que nos permite adicionar interceptors na aplicação, nós estamos fazendo isso agora para evitar voltar aqui quando formos criar o interceptor.

E também importamos `environment`, você vai entender isso jaja.

Dentro de `imports` que está dentro de `@NgModule`, adicione o `HttpClientModule`:

```typescript
imports: [
    // Outros imports...
    HttpClientModule,
  ],
```

Agora, e uvou falar par você sobre os `providers`, `providers` são os serviços que estão disponíveis para toda a aplicação, mas falando desse jeito fica dificil, em resumo, podemos adicionar coisas que queremos que toda a aplicação acesse aqui.

**Adicione o seguinte em `providers`**

```typescript
  providers: [
    {
      provide: 'DEVAMEET_URL_API',
      useValue: environment.devameetApiUrl,
    },
  ],
```

Observe, o que estamos fazendo aqui é o seguinte, estamos provendo através da chave `DEVAMEET_URL_API` o valor da variável `devameetApiUrl` que está dentro do arquivo `environment.ts`, e isso é o que chamamos de `Dependency Injection`, nós estamos injetando a variável `devameetApiUrl` dentro da aplicação, e ela estará disponível para toda a aplicação.

Claro, eu nem pedi para você mecher em `environment.devameetApiUrl`, por que isso é o que vamos fazer agora!

Vá até `src/environment/environment.ts` e adicione o seguinte código:

```typescript
export const environment = {
  production: false,
  devameetApiUrl: "http://localhost:3303/api",
};
```

Agora nós temos a tal variável `devameetApiUrl`, o proprio Angular consegue acessar ela através de `environment.devameetApiUrl`, assim como acabamos de fazer lá no `app.module.ts`.

Agora, vá até `src/environment/environment.prod.ts` e adicione o mesmo código:

```typescript
export const environment = {
  production: false,
  devameetApiUrl: "http://localhost:3303/api",
};
```

Ahh, aqui nós vimos pela primeira vez essa tal `http://localhost:3303/api`, isso é o nosso **Back-End!!** Hehehe, isso mesmo, você também vai aprender a fazer essa API com outro professor aqui na Devaria.

Para ter acesso a essa API, clone e rode o repositório, clicando bem aqui: [Link do repositório](https://github.com/Devaria-Oficial/devameet-nest-js).

## Agora sim, criando o nosso api service

Vamos para a ação, primeiro, vamos importar algumas coisas que vamos precisar:

```typescript
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
```

O `HttpClient` é o que nos permite fazer requisições HTTP, e o `Injectable` é o que nos permite criar uma service, e o `Inject` é o que nos permite injetar o que foi provido pelo `providers` que acabamos de fazer lá no `app.module.ts`.

Dentro de `ApiService`, altere o construtor para isso aqui:

```typescript
  constructor(
    protected http: HttpClient,
    @Inject('DEVAMEET_URL_API') private apiUrl: string
  ) {}
```

O que estamos fazendo aqui é instanciar o `HttpClient` e injetar o valor da variável `DEVAMEET_URL_API` dentro da nossa variável `apiUrl`, ou seja, `DEVAMEET_URL_API` é tipo uma variável global que escolhemos aonde injetar, isso mesmo!

Agora, vamos criar o método `post` e uma função auxiliar:

```typescript
  // Constructor ...

  private getUrl(url: string): string {
    return `${this.apiUrl}/${url}`;
  }

  public post(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }
```

O que está acontecendo aqui é uma simples função para retornar o link da api somado ao endpoint que queremos, isso é o que `getUrl` faz.

Agora, `post` é a função que vai fazer post, e aqui, no caso, estamos criando uma Promise, que é uma função que vai retornar uma resposta, ou um erro, quando ela for resolvida, e ela é resolvida de forma assincrona.

Você pode ler mais de Promises na documentação do MDN, bem aqui: [Link da documentação](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Abaixo dela, vamos adicionar mais alguns métodos:

```typescript
  // Post ...

  public put(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.getUrl(url)).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public delete(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.getUrl(url)).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }
```

Esses métodos fazem o que os seus nomes dizem, da mesma forma que `post` fez lá em cima.

Então, essa é nossa `api.service.ts`:

```typescript
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    protected http: HttpClient,
    @Inject("DEVAMEET_URL_API") private apiUrl: string
  ) {}

  private getUrl(url: string): string {
    return `${this.apiUrl}/${url}`;
  }

  public post(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public put(url: string, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(this.getUrl(url), body).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public get(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.getUrl(url)).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }

  public delete(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete(this.getUrl(url)).subscribe({
        next: (v) => resolve(v),
        error: (e) => reject(e),
      });
    });
  }
}
```

Prontinho!

![Gif obama soltando o microfone](https://media.giphy.com/media/3o7qDEq2bMbcbPRQ2c/giphy.gif)

# Criando o nosso interceptador ou interceptor

O Interceptor é tipo uma service, então, vamos cria-lo como uma, dentro da pasta `services`, crie mais um service, assim como você criou o último, mas dessa vez, o nome será `interceptor/api-interceptor`, assim fica mais fácil de identificar.

Primeiro, vamos importar algumas coisas:

```typescript
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
```

Aqui, estamos importando o `HttpInterceptor`, que é a interface que vamos implementar, e também o `HttpRequest`, que é o tipo de requisição que vamos interceptar, e o `HttpHandler`, que é o tipo de manipulador de requisição que vamos usar.

Os outros você vai entender melhor quando fizermos o interceptor.

Agora, vamos criar a classe:

```typescript
// Importações ...

@Injectable({
  providedIn: "root",
})
export class ApiInterceptorService implements HttpInterceptor {
  private requestsQueue: number = 0;

  constructor() {} // We can implement an loader service here

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {}
}
```

Essa é a base do nosso intercepador, agora, vamos adicionar algumas coisas dentro de `intercept`:

```typescript
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestsQueue++;
    // We can implement an loader service here

    const token = localStorage.getItem('@devameet:token');
    if (!token) return next.handle(req);

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });

    return next.handle(authReq).pipe(
      finalize(() => {
        this.requestsQueue--;
        // We can implement an loader service here
      })
    );
  }
```

Agora, vamos entender o que está acontecendo aqui.

A primeira coisa, é que, adicionarmos um `this.requestsQueue++`, não usamos isso de fato na aplicação, mais isso será muito útil se quisermos implementar um loader na aplicação.

Depois, vamos pegar o token que está no `localStorage`, se não tiver, vamos retornar o `next.handle(req)`, isso significa que simplesmente deixamos a requisição passar sem mudar nada nela.

Depois, vamos criar uma nova requisição, que é a `authReq`, e vamos adicionar um header nela, que é o `Authorization`, e vamos adicionar o token que pegamos lá em cima, e vamos retornar o `next.handle(authReq)`, que é a requisição que acabamos de criar, e vamos adicionar um `pipe` nela, e vamos adicionar um `finalize`, que é um método que vai ser executado no final da requisição, e vamos decrementar o `this.requestsQueue`, e vamos retornar o `next.handle(authReq)`.

O pipe é executado no final da requisição, e é possivel aninhar vários pipes.

Por fim, nosso interceptor deve parecer com isso:

```typescript
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ApiInterceptorService implements HttpInterceptor {
  private requestsQueue: number = 0;

  constructor() {} // We can implement an loader service here

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.requestsQueue++;
    // We can implement an loader service here

    const token = localStorage.getItem("@devameet:token");
    if (!token) return next.handle(req);

    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });

    return next.handle(authReq).pipe(
      finalize(() => {
        this.requestsQueue--;
        // We can implement an loader service here
      })
    );
  }
}
```

## Colocando o interceptador para funcionar

Criado o interceptador, precisamos colocalo lá nos providers, para que ele funcione, para isso, vamos no arquivo `app.module.ts`, e vamos adicionar o nosso interceptor lá.

Primeiro, vamos importar o interceptador.

```typescript
// Outras importações ...
import { ApiInterceptorService } from "./services/interceptor/api-interceptor.service";
```

Agora, vamos adiciona-lo ao providers:

```typescript
  providers: [
    {
      provide: 'DEVAMEET_URL_API',
      useValue: environment.devameetApiUrl,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true,
    },
  ],
```

A opção `multi: true` é para que o angular saiba que pode ter mais de um interceptor, e ele vai executar todos eles.

A opção `useClass` é para que o angular saiba qual classe ele deve usar como interceptador.

# **E ai, você está fazendo tudo certo?**

Como nós combinamos, você primeiro lê a apostila, e depois vê a aula, certo? Então, se você chegou até aqui antes de ver a aula, é porque você está fazendo tudo certo, parabéns!

Uma coisa que também pode te ajudar, é ao ler essa apostila, ir fazendo o que eu faço aqui ai no seu projeto local, assim você visualiza, como se sentisse o código, pode parecer bobo mas ajuda muito!

E depois, quando for ver a aula, você já vai ter em suas mãos o que eu vou fazer.

![Gif Breaking Bad soltando o microfone](https://media.giphy.com/media/i6TQUuiT5hjSU/giphy.gif)
