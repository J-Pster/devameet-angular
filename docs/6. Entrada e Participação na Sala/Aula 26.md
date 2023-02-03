# Criando o canvas de reunião em andamento

Primeiro, vá até `src/app/pages/meet/components` e crie um componente comum com o nome de `meet-ocurring`.

## **Modificando o TS**

## Primeiro, vamos criar a classe:

```typescript
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-meet-ocurring",
  templateUrl: "./meet-ocurring.component.html",
  styleUrls: ["./meet-ocurring.component.scss"],
})
export class MeetOcurringComponent {}
```

## Agora, vamos definir as variáveis e o construtor:

```typescript
  @Input() objects: any;
  @Input() connectedUsers: any;
  @Input() me: any;

  mobile: boolean = window.innerWidth < 992;

  finishLoadAssets: boolean = false;

  constructor() {}
```

Aqui, definimos que o componente receberá 3 variáveis, que são:

- `objects`: Os objetos que estão na sala
- `connectedUsers`: Os usuários conectados
- `me`: O usuário atual, no caso eu.

A variável `mobile` é para verificar se o usuário está usando um dispositivo móvel ou não.

A variável `finishLoadAssets` é para verificar se os assets já foram carregados.

## Pegando imagem do objeto

```ts
  getImageFromObject(object: any) {
    if (!object?.name || !object?.name.trim().length) {
      return '';
    }

    const orientation = object.orientation ? `_${object.orientation}` : '';
    return `assets/images/objects/${object.type}/${object.name}${orientation}.png`;
  }
```

Ela recebe o objeto em questão, e retorna o caminho da imagem dele.

## Pegando imagem do avatar

```ts
  getImageFromAvatar(user: any) {
    const avatarArray = user?.avatar?.split('_');
    const avatar = avatarArray[0] + '_' + avatarArray[1];

    if (avatar) {
      const orientation = user?.orientation || '';
      return `assets/images/objects/avatar/${avatar}_${orientation}.png`;
    }

    return '';
  }
```

O mesmo que a de cima, mas agora para o avatar.

## Redimencionando avatar e objetos para mobile

```ts
  resizeForMobile(obj: any, style: any): any {
    if (!this.mobile) return;

    const { type } = obj;
    const image = new Image();

    image.src = obj.avatar
      ? this.getImageFromAvatar(obj)
      : this.getImageFromObject(obj);

    if (type === 'wall' || type === 'floor') {
      style.width = image.width * 0.5625 + 'px';
    } else {
      style.width = image.width * 0.5625 + 'px';
      style.height = image.height * 0.5625 + 'px';
    }

    return style;
  }
```

Essa função recebe o objeto de imagem ou de avatar e o style já aplicado a ele por uma outra função, então, ela vai usar `image` para instanciar o objeto do tipo imagem, e passa o caminho da imagem para ele, assim nós conseguimos acessar `image.with` e `image.height` que são o tamanho da imagem, e então multiplicamos por `0.5625`, o que significa redimencionar ela para proporcionalmente caber em um board de 360x360 px, que é o board do mobile, ele é 56.25% do tamanho do board de desktop que tem 640x640 px.

## Definindo o Z-Index

```ts
  getObjectStyle(obj: any): any {
    const { zindex } = obj;

    const style = {} as any;

    if (zindex) {
      style.zIndex = zindex;
    }

    if (!this.mobile) return style;

    return this.resizeForMobile(obj, style);
  }
```

É chamado para definir o estilo das imagens, mas só define o zIndex e se for mobile passa para o `resizeForMobile` para redimencionar.

## Posicionando no canvas

```ts
  getClassObject(object: any): string {
    let cl = '';
    const { flexStart, type, x, y } = object;

    if (flexStart || type === 'wall' || type === 'floor') {
      cl = `column-start${type === 'wall' ? ' row-start' : ' floor-start'}`;
      return cl;
    }

    const classMap: any = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
    };

    if (
      object?.flexStart ||
      object?.type === 'wall' ||
      object?.type === 'floor'
    ) {
      cl += 'column-start ';

      if (object?.type === 'wall') {
        cl += 'row-start';
      } else {
        cl += 'floor-start';
      }
    } else {
      cl += `column-${classMap[object.x]} row-${classMap[object.y]}`;
    }

    return cl;
  }
```

Baseado na posição do objeto, ele vai definir a classe que vai ser aplicada a ele, para que ele fique na posição correta.

## Pegando nome e mutando usuários

```ts
  getName(user: any) {
    return user?.name;
  }

  getMutedClass(user: any) {
    if (user?.muted) {
      return 'muted';
    }
    return '';
  }
```

Pega o nome do usuário para exibir em cima da cabeça dele, e define se ele está mutado ou não.

## **Modificando o HTML**

```html
<div class="container-objects">
  <div class="grid">
    <img
      *ngFor="let object of objects"
      [src]="getImageFromObject(object)"
      [class]="getClassObject(object)"
      [style]="getObjectStyle(object)"
    />
    <div
      class="user-avatar"
      *ngFor="let user of connectedUsers"
      [class]="getClassObject(user)"
    >
      <div [class]="getMutedClass(user)">
        <span [class]="getMutedClass(user)">{{ getName(user) }}</span>
      </div>
      <img [src]="getImageFromAvatar(user)" [style]="getObjectStyle(user)" />
    </div>
  </div>
</div>
```

Leia e entenda o código acima, ele é bem simples, você consegue!

## **Modificando o SCSS**

```scss
@import "/src/styles.scss";

.container-objects {
  align-self: center;

  .grid {
    display: flex;
    width: 360px;
    height: 360px;
    background-color: white;
    position: relative;

    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14);

    img {
      position: absolute;
      image-resolution: from-image 300dpi;

      img {
        width: 30%;
      }

      &.selected {
        opacity: 0.6;
      }

      &.column-start {
        left: 0%;
      }

      &.row-start {
        top: 0%;
      }

      &.floor-start {
        top: 12.5%;
      }

      &.column-zero {
        left: 2%;
      }

      &.column-one {
        left: 14.5%;
      }

      &.column-two {
        left: 27%;
      }

      &.column-three {
        left: 39.5%;
      }

      &.column-four {
        left: 52%;
      }

      &.column-five {
        left: 64.5%;
      }

      &.column-six {
        left: 77%;
      }

      &.column-seven {
        left: 89.5%;
      }

      &.row-zero {
        top: 2%;
      }

      &.row-one {
        top: 14.5%;
      }

      &.row-two {
        top: 27%;
      }

      &.row-three {
        top: 39.5%;
      }

      &.row-four {
        top: 52%;
      }

      &.row-five {
        top: 64.5%;
      }

      &.row-six {
        top: 77%;
      }

      &.row-seven {
        top: 89.5%;
      }
    }

    .user-avatar {
      @include flex(column, center, center);

      position: absolute;
      z-index: 30;

      &.column-zero {
        left: 2%;
      }

      &.column-one {
        left: 14.5%;
      }

      &.column-two {
        left: 27%;
      }

      &.column-three {
        left: 39.5%;
      }

      &.column-four {
        left: 52%;
      }

      &.column-five {
        left: 64.5%;
      }

      &.column-six {
        left: 77%;
      }

      &.column-seven {
        left: 89.5%;
      }

      &.row-zero {
        top: 2%;
      }

      &.row-one {
        top: 14.5%;
      }

      &.row-two {
        top: 27%;
      }

      &.row-three {
        top: 39.5%;
      }

      &.row-four {
        top: 52%;
      }

      &.row-five {
        top: 64.5%;
      }

      &.row-six {
        top: 77%;
      }

      &.row-seven {
        top: 84.5%;
      }

      div {
        @include flex(row, center, center);

        background: rgba(51, 51, 51, 0.75);
        border: 1px solid var(--primaria04);
        border-radius: 500px;
        padding: 2px 8px;

        margin-bottom: 2px;

        &.muted {
          border-color: var(--muted);
        }

        span {
          font-weight: 500;
          font-size: 10px;
          color: var(--primaria04);

          &.muted {
            color: var(--muted);
          }
        }
      }

      img {
        position: relative;
      }
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    display: flex;
    flex: 1;
    align-items: flex-start;
    justify-content: center;

    .grid {
      width: 640px;
      height: 640px;

      .user-avatar {
        &.column-zero {
          left: 2%;
        }

        &.column-one {
          left: 14.5%;
        }

        &.column-two {
          left: 27%;
        }

        &.column-three {
          left: 39.5%;
        }

        &.column-four {
          left: 52%;
        }

        &.column-five {
          left: 64.5%;
        }

        &.column-six {
          left: 77%;
        }

        &.column-seven {
          left: 89.5%;
        }

        &.row-zero {
          top: 2%;
        }

        &.row-one {
          top: 14.5%;
        }

        &.row-two {
          top: 27%;
        }

        &.row-three {
          top: 39.5%;
        }

        &.row-four {
          top: 52%;
        }

        &.row-five {
          top: 64.5%;
        }

        &.row-six {
          top: 77%;
        }

        &.row-seven {
          top: 84.5%;
        }

        div {
          border: 1.5px solid var(--primaria04);
          padding: 2px 8px;
          margin-bottom: 10px;

          span {
            font-weight: 500;
            font-size: 14px;
          }
        }
      }

      .audio {
        top: 90%;
        left: 90%;
        width: 48px;
      }
    }

    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 16px;

      div {
        cursor: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background-color: var(--cinza03);
        margin-bottom: 16px;
        border-radius: 4px;

        &.active {
          cursor: pointer;
          background-color: var(--primaria03);
        }
      }
    }
  }
}
```

## **Modificando o Módulo Compartilhado**

Vá até `src/app/pages/meet/components/meet-components.module.ts`, e adicione `MeetOcurringComponent` em `exports`:

```ts
@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
  ],
  exports: [
    // ...
    MeetOcurringComponent,
  ],
})
export class MeetComponentsModule {}
```

# Criando finalmente a página de reunião

Vá até `src/app/pages/meet/pages`, clique com o botão direito e crie um módulo chamado `join-meet`, ele será do tipo `Lazy-loaded module of pages`.

## **Modificando o Módulo**

Vá até `join-meet.module.ts`, e deixe ele assim:

```ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { JoinMeetRoutingModule } from "./join-meet-routing.module";
import { JoinMeetComponent } from "./join-meet.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MeetComponentsModule } from "../../components/meet-components.module";
import { SharedDecoratorsModule } from "src/app/shared/decorators/shared-decorators.module";

@NgModule({
  declarations: [JoinMeetComponent],
  imports: [
    CommonModule,
    JoinMeetRoutingModule,
    SharedDecoratorsModule,
    MatSnackBarModule,
    MeetComponentsModule,
  ],
})
export class JoinMeetModule {}
```

## **Modificando o TS**

## Importando algumas coisas

```ts
import { Component, OnDestroy } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalstorageService } from "src/app/services/local/localstorage.service";
import { MeetService } from "src/app/services/meet/meet.service";

import { createPeerConnectionContext } from "src/app/services/socket/socket.service";
// ...
```

Só o que vamos usar.

## Criando a classe

```ts
@Component({
  selector: "app-join-meet",
  templateUrl: "./join-meet.component.html",
  styleUrls: ["./join-meet.component.scss"],
})
export class JoinMeetComponent implements OnDestroy {}
```

**A partir daqui o que vamos fazer é dentro da classe!**

## Definindo algumas variáveis

```ts
name: string = "";
link: string = "";
color: string = "";
objects: any = [];
userMediaStream: any = null;
me: any = {};

connectedUsers: any = [];
audioSrcs: any = [];

wsServices = createPeerConnectionContext("http://localhost:3303");
joined: boolean = false;
error: boolean = false;
userId: string = "";

mobile: boolean = window.innerWidth < 992;
```

Aqui nós definimos algumas variáveis que vamos usar, elas fazem o seguinte:

- `name`: Nome do usuário.
- `link`: Link da reunião.
- `color`: Cor da reunião.
- `objects`: Objetos da reunião.
- `userMediaStream`: Stream de áudio do usuário.
- `me`: Informações do usuário, no caso você.
- `connectedUsers`: Usuários conectados.
- `audioSrcs`: Fontes de áudio dos usuários.
- `wsServices`: Serviços de Websocket, vindos de `createPeerConnectionContext`, lembra?
- `joined`: Se o usuário já entrou na reunião.
- `error`: Se houve algum erro.
- `userId`: ID do usuário, no caso você.
- `mobile`: Se o usuário está usando um dispositivo móvel.

## Criamos o construtor

```ts
  constructor(
    private routeActive: ActivatedRoute,
    private localStorageService: LocalstorageService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {}
```

Só instanciamos o que vamos usar aqui.

## Função ao entrar na sala

```ts
  joinRoom() {
    if (!this.userMediaStream) return;

    // Conectando em uma sala
    this.wsServices.connect();
    this.wsServices.joinRoom({ link: this.link, user: this.userId });

    // Adicionando usuários na sala
    this.wsServices.onUpdateUserList(async (users: any) => {
      if (!users) return;

      this.connectedUsers = users;
      const me = users.find((u: any) => u.user === this.userId);

      if (me) {
        this.me = me;
      }

      const usersWithoutMe = users.filter((u: any) => u.user != this.userId);

      for (const user of usersWithoutMe) {
        this.wsServices.addPeerConnection(
          `${user.clientId}`,
          this.userMediaStream,
          (_stream: any) => {
            this.audioSrcs.push({ id: user.clientId, src: _stream });
          }
        );
      }
    });

    this.wsServices.onCallMade();

    // Ao adicionar um usuário
    this.wsServices.onAddUser((user: any) => {
      console.log('onAddUser', user);

      this.wsServices.addPeerConnection(
        `${user}`,
        this.userMediaStream,
        (_stream: any) => {
          this.audioSrcs.push({ id: user.clientId, src: _stream });
        }
      );

      this.wsServices.callUser(user);
    });

    // Ao remover um usuário
    this.wsServices.onRemoveUser((socketId: any) => {
      this.connectedUsers = this.connectedUsers.filter(
        (user: any) => user.clientId !== socketId
      );

      this.wsServices.removePeerConnection(socketId);
    });

    // Ao fazer uma resposta de conexão
    this.wsServices.onAnswerMade((socket: any) =>
      this.wsServices.callUser(socket)
    );

    document.addEventListener('keyup', this.moveAvatar);

    this.joined = true;
  }
```

A função acima faz o seguinte, passo a passo:

- Verifica se o objeto `this.userMediaStream` existe, e se não existir, encerra a função sem fazer mais nada.
- Faz uma conexão com o servidor através do método connect do objeto `wsServices`.
- Se conecta a uma sala específica enviando um objeto que contém a link e o user do usuário através do método `joinRoom` do objeto `wsServices`.
- Configura o evento `onUpdateUserList` para ser acionado quando a lista de usuários conectados na sala for atualizada. Quando o evento é acionado, a lista de usuários é atualizada e um usuário específico é selecionado como o "eu". Além disso, para cada usuário na sala, exceto o próprio usuário, é adicionada uma conexão peer com o método `addPeerConnection` do objeto `wsServices`.
- Configura o evento `onCallMade` do objeto `wsServices` para ser acionado quando uma chamada é feita.
- Configura o evento `onAddUser` do objeto `wsServices` para ser acionado quando um novo usuário é adicionado na sala. Quando o evento é acionado, uma nova conexão peer é adicionada para o novo usuário através do método `addPeerConnection` do objeto `wsServices`, e uma chamada é feita para o novo usuário com o método callUser do objeto `wsServices`.
- Configura o evento `onRemoveUser` do objeto `wsServices` para ser acionado quando um usuário é removido da sala. Quando o evento é acionado, a lista de usuários conectados é filtrada para remover o usuário que saiu, e a conexão peer desse usuário é removida com o método removePeerConnection do objeto `wsServices`.
- Configura o evento `onAnswerMade` do objeto `wsServices` para ser acionado quando uma resposta de conexão é feita. Quando o evento é acionado, uma chamada é feita para o usuário que respondeu à conexão com o método `callUser` do objeto `wsServices`.
- Adiciona um listener de evento de teclado para ser acionado ao pressionar uma tecla, com a função `moveAvatar` como callback.

Pode ser dificil de entender, no vídeo eu vou explicar mais afundo.

## Copiar o link da sala

```ts
  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    this._snackBar.open('Link copiado com sucesso!', 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }
```

Essa função só copia o link da sala.

## Movendo o usuário

```ts
moveAvatar = (event: any) => {
  const user = this.me;
  if (!event || !user) return;

  let x = user.x;
  let y = user.y;
  let orientation = user.orientation;

  switch (event.key) {
    case "ArrowUp":
      y = user.orientation === "back" ? (user.y > 1 ? user.y - 1 : 1) : user.y;
      orientation = "back";
      break;
    case "ArrowDown":
      y = user.orientation === "front" ? (user.y < 7 ? user.y + 1 : 7) : user.y;
      orientation = "front";
      break;
    case "ArrowLeft":
      x = user.orientation === "left" ? (user.x > 0 ? user.x - 1 : 0) : user.x;
      orientation = "left";
      break;
    case "ArrowRight":
      x = user.orientation === "right" ? (user.x < 7 ? user.x + 1 : 7) : user.x;
      orientation = "right";
      break;
    default:
      break;
  }

  if (x >= 0 && y >= 0 && orientation) {
    this.wsServices.updateUserMovement({
      userId: user.user,
      link: this.link,
      x,
      y,
      orientation,
    });
  }
};
```

A função acima faz o seguinte, passo a passo:

1. A variável `user` é definida como o valor em `this.me`.
2. Se o evento ou o usuário não estiver presente, a função retorna.
3. Variáveis `x`, `y` e `orientation` são definidas como as posições atuais e a orientação do usuário.
4. A estrutura de switch é usada para verificar a tecla pressionada e atualizar as posições e orientação de acordo com a tecla.
   - Se a tecla for "ArrowUp", `y` é atualizada para ser decrementada em 1 se a orientação atual for "back", e a orientação é definida como "back".
   - Se a tecla for "ArrowDown", `y` é atualizada para ser incrementada em 1 se a orientação atual for "front", e a orientação é definida como "front".
   - Se a tecla for "ArrowLeft", `x` é atualizada para ser decrementada em 1 se a orientação atual for "left", e a orientação é definida como "left".
   - Se a tecla for "ArrowRight", `x` é atualizada para ser incrementada em 1 se a orientação atual for "right", e a orientação é definida como "right".
   - Se as novas posições (`x` e `y`) são maiores ou iguais a zero e a orientação é válida, a função `updateUserMovement` é chamada em this.wsServices para atualizar a posição do usuário na sala.
5. Se as novas posições (`x` e `y`) são maiores ou iguais a zero e a orientação é válida, a função `updateUserMovement` é chamada em this.wsServices para atualizar a posição do usuário na sala.

## Mutando e desmutando o usuário

```ts
  togglMute() {
    let payload = {
      userId: this.userId,
      link: this.link,
      muted: !this.me.muted,
    };

    this.wsServices.updateUserMute(payload);
  }
```

Simplesmente muda o valor de `muted` do usuário para o oposto do valor atual.

## Pegando lista de usuários sem mim

```ts
  usersWithoutMe() {
    const result = this.connectedUsers.filter(
      (u: any) => u.user !== this.userId
    );
    return result;
  }
```

É uma função auxiliar que pega a lista de usuários e remove o usuário atual.

## Pegando o link do audio

```ts
  getAudioSrc(userId: string) {
    const srcObj = this.audioSrcs.find((a: any) => a.id === userId);
    return srcObj.src;
  }
```

A tag `<audio>` precisa de um SRC, então essa função pega o SRC do usuário com o ID passado.

## onInit e onDestroy

```ts
  ngOnInit(): void {
    this.loadMeeting();
    this.userId = this.localStorageService.getItem('id') as string;
  }

  ngOnDestroy(): void {
    document.removeEventListener('keyup', this.moveAvatar);
    if (this.joined) {
      this.userMediaStream.getTracks().forEach((track: any) => track.stop());
      this.wsServices.removePeerConnection(this.userId);
    }
  }`
```

A `ngOnInit` carrega a reunião e pega o ID do usuário do localStorage.

A `ngOnDestroy` remove o evento de teclado e se o usuário já entrou na sala, ele para a transmissão de vídeo e áudio e remove a conexão do usuário.

## Por fim, função para carregar a reunião

```ts
  async loadMeeting() {
    const meetLink = this.routeActive.snapshot.paramMap.get('link');
    if (!meetLink) {
      this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      setTimeout(() => this.route.navigateByUrl('/'), 2000);
      return;
    }

    try {
      const meet = await this.meetService.getRoom(meetLink);

      this.name = meet.name;
      this.link = meet.link;
      this.color = meet.color;

      this.objects = meet.objects.map((obj) => ({
        ...obj,
        type: obj.name.split('_')[0],
      }));

      this.userMediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { min: 640, ideal: 1920 },
          height: { min: 400, ideal: 1080 },
          aspectRatio: { ideal: 1.7777777778 },
        },
        audio: true,
      });

      const videoRef: any = document.getElementById('localVideoRef');
      if (videoRef) {
        videoRef.srcObject = this.userMediaStream;
      }
    } catch (err: any) {
      console.error('Error: ', err);

      if (err.status === 404 || err.status === 401) {
        this.error = true;
      } else {
        this._snackBar.open('Erro ao carregar a reunião!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });
      }
    }
  }
```

Essa função faz o seguinte:

- Obtém o link da reunião através da rota ativa. Se não houver link, exibe uma mensagem de erro e redireciona o usuário para a página principal.
- Tenta obter os detalhes da reunião chamando a função `getRoom` do serviço `meetService`. Em caso de sucesso, atribui o nome, link e cor da reunião a respectivos atributos do componente.
- Transforma os objetos da reunião, separando o tipo do nome e armazenando-o em um novo atributo `type`.
- Obtém o fluxo de mídia do usuário usando `navigator.mediaDevices.getUserMedia`.
- Associa o fluxo de mídia a um elemento de vídeo local na página, se houver.
- Em caso de erro, o erro é registrado no console e, se o erro for 401 ou 404, o atributo de erro é definido como verdadeiro. Caso contrário, exibe uma mensagem de erro para o usuário.

## **Modificando o HTML**

Esse é o seu desafio, leia, e tente entender, eu sei que você consegue!

```html
<app-header-n-footer active="meet">
  <section [class.notFound]="error">
    <div class="resume" *ngIf="!error">
      <div>
        <span><span>Reunião</span> {{ link }}</span>
        <img
          src="assets/images/icons/meet/meet-copy.svg"
          (click)="copyLink()"
        />
      </div>
      <p [style.color]="color">{{ name }}</p>
    </div>

    <div class="preview-container">
      <app-meet-ocurring
        [objects]="objects"
        [connectedUsers]="connectedUsers"
      ></app-meet-ocurring>

      <div class="preview" *ngIf="!joined && !error">
        <img
          src="assets/images/icons/meet/meet-door.svg"
          alt="Entrar na sala"
        />
        <button (click)="joinRoom()">Entrar na sala</button>
      </div>

      <div class="error" *ngIf="error">
        <img src="assets/images/carinha.svg" alt="Erro" />
        <p>Reunião não encontrada :/</p>
      </div>

      <div class="mute">
        <img
          class="audio"
          src="assets/images/icons/meet/mic-on.svg"
          *ngIf="me && me.muted === false"
          (click)="togglMute()"
        />
        <img
          class="audio"
          src="assets/images/icons/meet/mic-off.svg"
          *ngIf="me && me.muted === true"
          (click)="togglMute()"
        />
      </div>
    </div>

    <div class="movement" *ngIf="mobile && !error">
      <div class="button" (click)="moveAvatar({ key: 'ArrowUp' })">
        <img
          src="assets/images/icons/arrows/arrow-up.svg"
          alt="Mover para cima"
        />
      </div>
      <div class="line">
        <div class="button" (click)="moveAvatar({ key: 'ArrowLeft' })">
          <img
            src="assets/images/icons/arrows/arrow-left.svg"
            alt="Mover para esquerda"
          />
        </div>
        <div class="button" (click)="moveAvatar({ key: 'ArrowDown' })">
          <img
            src="assets/images/icons/arrows/arrow-down.svg"
            alt="Mover para baixo"
          />
        </div>
        <div class="button" (click)="moveAvatar({ key: 'ArrowRight' })">
          <img
            src="assets/images/icons/arrows/arrow-right.svg"
            alt="Mover para direita"
          />
        </div>
      </div>
    </div>

    <div id="audio">
      <audio id="localVideoRef" autoplay playsinline [muted]="true"></audio>
      <audio
        *ngFor="let user of usersWithoutMe()"
        autoplay
        playsinline
        [srcObject]="getAudioSrc(user?.clientId)"
        [id]="user?.clientId"
        [muted]="user?.muted"
      ></audio>
    </div>
  </section>
</app-header-n-footer>
```

## **Modificando o SCSS**

```scss
@import "/src/styles.scss";

section {
  @include flex(column, flex-start, center);

  background-image: url("../../../../../assets/images/background.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  height: calc(100vh - 100px);

  &.notFound {
    justify-content: center;
  }

  @media screen and (min-width: $desktopBreakpoint) {
    height: calc(100vh - 65px);

    justify-content: center;
    position: relative;
  }
}

.preview-container {
  @include flex(column, center, center);
  position: relative;
  width: 100%;

  .preview {
    @include flex(column, center, center);

    width: 100%;
    height: 100%;
    z-index: 30;
    background-color: rgba(0, 0, 0, 0.5);

    position: absolute;

    img {
      width: 51px;
      position: relative;
      margin-bottom: 28px;
      cursor: pointer;

      filter: brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%)
        hue-rotate(288deg) brightness(102%) contrast(102%);
    }

    button {
      width: 50%;
      padding: 8px;
      border: 2px solid white;
      border-radius: 8px;
      background-color: transparent;

      font-size: 12px;
      font-weight: 600;
      color: white;

      cursor: pointer;
    }

    @media screen and (min-width: $desktopBreakpoint) {
      img {
        width: 70px;
      }

      button {
        width: 50%;
        padding: 16px;

        font-size: 16px;
      }
    }
  }

  .error {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 30;

    position: absolute;

    img {
      width: 70%;

      margin-bottom: 20px;
    }

    p {
      font-size: 20px;
      font-weight: 500;
      color: var(--cinza02);
      margin: 0;
    }
  }

  .mute {
    position: absolute;
    bottom: 20px;
    right: 20px;

    width: 40px;

    .audio {
      cursor: pointer;
      z-index: 50;

      width: 100%;
    }

    @media screen and (min-width: $desktopBreakpoint) {
      width: 50px;
    }
  }

  @media screen and (min-width: $desktopBreakpoint) {
    width: 640px;
  }
}

.resume {
  @include flex(column, center, flex-start);
  width: calc(100% - 32px);
  padding: 16px;

  height: fit-content;

  div {
    @include flex(row, center, center);

    span {
      font-size: 14px;
      font-weight: 400;
      color: var(--cinza03);

      span {
        font-weight: 600;
      }
    }

    img {
      margin-left: 6px;
      filter: brightness(0) saturate(100%) invert(64%) sepia(98%) saturate(425%)
        hue-rotate(61deg) brightness(89%) contrast(96%);

      cursor: pointer;
    }
  }

  p {
    font-family: var(--fontBold);
    margin: 0;
  }

  @media screen and (min-width: $desktopBreakpoint) {
    position: fixed;

    bottom: 40px;
    left: 10px;
  }
}

.movement {
  @include flex(column, center, center);

  width: 100%;
  margin-top: 10px;

  flex: 1;

  cursor: pointer;

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 40px;
    background-color: var(--primaria03);
    margin: 2px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(0, 0, 0, 0.12),
      0px 1px 3px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .line {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
```

Como sempre, SCSS só na aula!

# Modificando as Rotas

Depois de criamos essa linda página, vamos configurar as rotas corretamente, vá até `src/app/app-routing.module.ts`, e procure por `routes`, dentro, procure por `join-meet` e altere para:

```typescript
const routes: Routes = [
  //..
  {
    path: "meet/:link",
    canActivate: [JwtAuthGuard],
    loadChildren: () =>
      import("./pages/meet/pages/join-meet/join-meet.module").then(
        (m) => m.JoinMeetModule
      ),
  },
  //..
];
```

# Pronto, terminamos tudo!

Finalmente a nossa aplicação inteira está pronta, se você iniciar ela com `npm start` e ir em `http://localhost:4200/` você vai ver ela funcionando, teste as funcionalidades, crie usuários, faça login, modifique eles na página de perfil, crie salas, edite salas, entre em salas, etc.

Agora, a próxima aula é extra, e é um `Debug` de todo o Web Socket para vermos tudo funcionando em tempo real!

**Meus parabéns, você terminou o curso!**

![Gif graduado](https://media.giphy.com/media/cl27Mh8srUEog5GtUR/giphy.gif)
