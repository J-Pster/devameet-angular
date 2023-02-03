# Criando a reunião de verdade

Finalmente, chegamos no final do nosso curso, agora, nós vamos implementar a parte mais complexa daqui, primeiro vamos implementar um service que embarca toda a lógica de conexão Web Socket, se você não conhece muito de Web Socket, tudo bem, eu vou explicar tudo que você precisa saber, mas não será o suficiente para você criar um Web Socket do zero, mas você vai entender o que está acontecendo.

## O que é um Web Socket?

Em resumo:

Web Socket é uma tecnologia de comunicação bidirecional que permite a comunicação entre um navegador da web e um servidor ao longo de uma única conexão TCP. Em contraste com o protocolo HTTP, que é solicitação-resposta, um Web Socket mantém uma conexão aberta, permitindo que as mensagens sejam transmitidas em ambas as direções sem necessidade de uma nova solicitação. Isso significa que o servidor pode enviar mensagens ao cliente sem ser solicitado, o que é útil em aplicações em tempo real, como jogos, chat, alertas em tempo real, etc. Além disso, o Web Socket é mais eficiente que o HTTP, pois não precisa fechar e abrir conexões para cada nova mensagem, o que pode resultar em uma grande economia de recursos.

No nosso caso, o servidor terá multiplos usuários conectados, e ele vai fazer com que os usuários escutem o áudio um dos outros.

## O que é o Socket IO?

O Socket.IO é uma biblioteca JavaScript que permite a comunicação em tempo real bidirecional entre o navegador e o servidor. Ele foi projetado para ser flexível e fácil de usar, para que você possa facilmente adicionar comunicação em tempo real a qualquer aplicação. O Socket.IO permite que você envie e receba qualquer tipo de dados de eventos, com objetos JSON ou binários.

Você pode importá-lo no arquivo em que você deseja usá-lo e estabelecer uma conexão com o servidor que suporta o protocolo Web Socket:

```js
import io from "socket.io-client";

const socket = io("http://localhost:3000");
```

Uma vez estabelecida a conexão, você pode enviar e receber dados do servidor usando os métodos `emit` e `on` do objeto socket:

```js
socket.emit("message", "Hello, Server!");

socket.on("reply", (message) => {
  console.log(message);
});
```

O método `emit` é usado para enviar uma mensagem ao servidor, enquanto o método `on` é usado para ouvir uma mensagem enviada pelo servidor. No exemplo acima, o cliente envia a mensagem "Hello, Server!" ao servidor e, em seguida, aguarda a resposta do servidor usando o método `on`.

## O que nós vamos fazer?

Vamos criar uma service, e essa service vai ter toda essa lógica de conectar usuários através do Web Socket, e vamos usar o Socket IO para fazer isso.

O código a seguir é complexo, então, pegue uma agua, relaxe, e vamos lá, se não entender de primeira de boa, **na aula eu vou ter uma aula final que vou mostrar na prática usando o Debugger do VS Code, passo a passo o que acontece ao entrar em uma sala!**

# Criando nosso Web Socket Service

Vá até `src/app/services` e crie uma pasta chamada `socket`, dentro dela, crie um arquivo chamado `socket.service.ts`

No seu terminal, vamos instalar o `socket.io-client`:

Yarn

```bash
yarn add socket.io-client
```

NPM

```bash
npm install socket.io-client
```

## Função de Capitalização

Vamos criar uma função para capitalizar a primeira letra de uma string, vamos usar isso.

```ts
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
```

## Criando a classe PeerConnectionSession

```ts
class PeerConnectionSession {}
```

**A partir de agora vamos trabalhar dentro dessa classe!**

## Criando variáveis

```ts
  _room: any;
  _userId: any;
  socket: any;
  peerConnections: RTCPeerConnection[] = [];
  senders = [] as any;
  listeners = {} as any;
  connected = false;
  ons = [] as any;
```

- \_room é o ID da sala que estamos.
- \_userId é o nosso ID de usuário, que é gerado aleatoriamente.
- socket é o objeto que representa a conexão com o servidor Web Socket.
- peerConnections = [] é um array que representa as conexões peer-to-peer, ou seja, represente os usuários que estão nad sala.
- senders = [] é o array que representa a track de audio dos usuários que estão conectados na sala.
- listeners = {} é um objeto que representa os EventListeners que estão sendo usados.
- connected é um boolean que representa se o usuário está conectado ou não.
- ons = [] é um array que representa as funções que podem ser executadas `on` (quando) alguma coisa,

## Criando o construtor

```ts
  constructor(socket: any) {
    this.socket = socket;
  }
```

Nosso construtor recebe um Socket, que é uma instancia do Socket IO, você vai ver a função `createPeerConnectionContext` que cria essa instancia e passa para o construtor lá no fim.

## Função para ativar a conexão

```ts
  connect() {
    this.connected = true;
  }
```

Simplesmente muda o status para conectado, ela será usada em breve.

## Adicionando um novo usuário a sala

```ts
  addPeerConnection(id: any, stream: any, callback: any) {
    if (!this.peerConnections[id]) {
      console.log('creating peer:', id);
      this.peerConnections[id] = new window.RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });

      stream.getTracks().forEach((track: any) => {
        this.senders.push(this.peerConnections[id].addTrack(track, stream));
      });

      this.listeners[id] = (event: any) => {
        const on =
          '_on' +
          capitalizeFirstLetter(this.peerConnections[id].connectionState);
        const fn = this.ons[on];
        fn && fn(event, id);
      };

      this.peerConnections[id].addEventListener(
        'connectionstatechange',
        this.listeners[id]
      );

      this.peerConnections[id].ontrack = function ({ streams: [stream] }: any) {
        callback(stream);
      };
    }
  }
```

**PRIMEIRO EU VOU EXPLICAR O QUE É UMA STREAM**

Uma `STREAM` é uma track de audio, ou seja, é a track de audio de um usuário, e ela é passada para a função `addPeerConnection` quando um novo usuário entra na sala, a track de audio é tipo um código que aponta para um `<audio>` e faz com que a voz do usuário seja reproduzida no `<audio>`.

A `track` de uma stream é tipo uma faixa do áudio, não se importe com isso, só saiba que é uma track de audio, e podem ter multiplas tracks na mesma stream, mas nós só vamos usar uma track por stream.

Mas lembre-se, o `stream` não funciona sem a `track`.

Esta função é usada para adicionar uma nova conexão peer-to-peer, ou seja, quando um novo usuário entra na sala, ela funciona assim:

- Verificação de ID existente: A função verifica se já existe uma conexão peer com o ID especificado usando `if (!this.peerConnections[id])`. Se já existir uma conexão, a função não faz nada e retorna.
- Criação de nova conexão peer: Se não houver conexão com o ID especificado, a função cria uma nova conexão peer usando `this.peerConnections[id] = new window.RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], });`, ou seja, como a função recebe um ID, que será o ID do usuário que está entrando na sala, e uma stream, que será a stream do usuário que está entrando na sala.
- Adição de tracks: A função obtém todas as tracks do stream especificado usando `stream.getTracks()` e adiciona-as à nova conexão peer usando `this.peerConnections[id].addTrack(track, stream)`.
- Adição de event listener: A função adiciona um event listener à nova conexão peer usando `this.peerConnections[id].addEventListener('connectionstatechange', this.listeners[id])`. Este listener será invocado quando o estado da conexão mudar, ou ser modificada, isso é para escutarmos as mudanças que acontecem no Web Socket, quando recebemos uma mensagem, por exemplo.
- Definição de "ontrack": A função define a propriedade `ontrack` da nova conexão peer com uma função anônima `function ({ streams: [stream] }: any) { callback(stream); }`. Esta função será invocada quando uma nova stream for adicionada à conexão.
- Armazenamento do listener: A função armazena o listener adicionado em `this.listeners[id]`.

## Removendo um usuário da sala

```ts
  removePeerConnection(id: any) {
    if (this.peerConnections[id]) {
      this.peerConnections[id].removeEventListener(
        'connectionstatechange',
        this.listeners[id]
      );
      delete this.peerConnections[id];
      delete this.listeners[id];
    }
  }
```

Esta função é usada para remover uma conexão peer, ou seja, quando um usuário sai da sala, ela funciona assim:

- Verificação de ID existente: A função verifica se existe uma conexão peer com o ID especificado usando `if (this.peerConnections[id])`. Se não existir uma conexão, a função não faz nada e retorna.
- Remoção do listener: A função remove o listener adicionado usando `this.peerConnections[id].removeEventListener('connectionstatechange', this.listeners[id])`.
- Remoção da conexão peer: A função remove a conexão peer usando `delete this.peerConnections[id]`.
- Remoção do listener no array de listeners: A função remove o listener usando `delete this.listeners[id]`.

## Pedindo conexão a outros usuários

```ts
  async callUser(to: any) {
    console.log(
      'callUser to:',
      to,
      this.peerConnections[to]?.iceConnectionState
    );
    if (this.peerConnections[to]?.iceConnectionState === 'new') {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(
        new RTCSessionDescription(offer)
      );
      this.socket.emit('call-user', { offer, to, link: this._room });
    }
  }
```

### Antes de entender a função, o que é setLocalDescription?

O SDP (Session Description Protocol) é um protocolo usado para descrever detalhes de uma sessão de mídia em comunicações de tempo real, como videoconferências ou chamadas de voz em IP. Ele é amplamente utilizado em conjunto com o protocolo RTP (Real-time Transport Protocol) para estabelecer sessões de mídia em redes IP.

O SDP define as informações necessárias para a inicialização da sessão, incluindo tipo de mídia, codecs de áudio e vídeo, endereços IP, portas, e outros parâmetros importantes. É enviado em uma mensagem SIP ou como parte de outro protocolo de comunicação para estabelecer uma sessão RTP.

A descrição da sessão SDP é usada para negociar as opções de mídia entre os participantes da chamada antes de iniciar a transmissão de dados de mídia. Isso garante que as informações de configuração sejam combinadas corretamente para garantir a qualidade de mídia ótima.

Definir uma descrição local é importante porque ela fornece informações sobre as capacidades da conexão de ponto a ponto (RTCPeerConnection) e a configuração da sessão de mídia. É uma parte fundamental do processo de negociação de chamadas WebRTC, onde as descrições locais e remotas são trocadas entre as partes para estabelecer uma conexão de mídia segura e confiável. A descrição local é compartilhada com o destinatário da chamada e é usada para criar uma resposta que é, por sua vez, compartilhada de volta para estabelecer a conexão.

### Entendendo a função

Toda vez que um usuário entra na sala, vamos executar essa função e as duas seguintes, que são `onCallMade` e `onAnswerMade`, o que essa função faz é pedir conexão para o usuário que foi adicionado na sala, enviando para ele uma oferta, que é uma descrição da sessão SDP, e o usuário qeu entrou recebe a oferta em `onCallMade` e ele então responde com uma resposta, que também é uma descrição da sessão SDP, e então o nosso usuário recebe isso em `onAnswerMade`.

- Verificação de estado da conexão: A função verifica se o estado da conexão peer com o ID especificado é `new`, ou seja, se a conexão ainda não foi estabelecida. Se o estado da conexão não for `new`, a função não faz nada e retorna.
- Criação de oferta: A função cria uma oferta usando `const offer = await this.peerConnections[to].createOffer();`.
- Definição da descrição local: A função define a descrição local da conexão peer usando `await this.peerConnections[to].setLocalDescription(new RTCSessionDescription(offer));`.
- Envio da oferta: A função envia a oferta usando `this.socket.emit('call-user', { offer, to, link: this._room });`.

## Recebendo pedido de conexão e enviando audio

```ts
  onCallMade() {
    this.socket.on('call-made', async (data: any) => {
      const selectedPeer = this.peerConnections[data.socket];

      console.log('call-made', data.socket);
      if (selectedPeer) {
        await selectedPeer.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await selectedPeer.createAnswer();
        await selectedPeer.setLocalDescription(
          new RTCSessionDescription(answer)
        );
        this.socket.emit('make-answer', {
          answer,
          to: data.socket,
          link: this._room,
        });
      }
    });
  }
```

Essa é a função que é ativa no usuário que entrou na sala quando os outros usuários pedem conexão de áudio com ele, e o que ela faz é receber a oferta, que é uma descrição da sessão SDP, e então ela responde com uma resposta, que também é uma descrição da sessão SDP, e então o usuário que pediu conexão recebe a resposta em `onAnswerMade`.

- Verificação de estado da conexão: A função verifica se o estado da conexão peer com o ID especificado é `new`, ou seja, se a conexão ainda não foi estabelecida. Se o estado da conexão não for `new`, a função não faz nada e retorna.
- Definição da descrição remota: A função define a descrição remota da conexão peer usando `await selectedPeer.setRemoteDescription(new RTCSessionDescription(data.offer));`.
- Criação de resposta: A função cria uma resposta usando `const answer = await selectedPeer.createAnswer();`.
- Definição da descrição local: A função define a descrição local da conexão peer usando `await selectedPeer.setLocalDescription(new RTCSessionDescription(answer));`.
- Envio da resposta: A função envia a resposta usando `this.socket.emit('make-answer', { answer, to: data.socket, link: this._room });`.

## Recebendo resposta de conexão e devolvendo áudio

```ts
  onAnswerMade(callback: any) {
    this.socket.on('answer-made', async (data: any) => {
      console.log('answer-made', data.socket);
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      callback(data.socket);
    });
  }
```

Finalmente, essa é a função que recebe a resposta do usuário que entrou na sala, que é uma descrição da sessão SDP, e então ele define essa descrição como descrição remota da conexão peer.

- Definição da descrição remota: A função define a descrição remota da conexão peer usando `await this.peerConnections[data.socket].setRemoteDescription(new RTCSessionDescription(data.answer));`, lembra do SPD que falei lá em cima? Aqui é onde ele é usado, no caso, lá é criado e enviado, e aqui ele recebe e é definido como descrição remota da conexão peer.
- Execução do callback: A função executa o callback passado como parâmetro usando `callback(data.socket)`.
- Adição do listener: A função adiciona o listener usando `this.socket.on('answer-made', async (data: any) => { ... });`.

## **O que aconteceu nas últimas 3 funções?**

Agora que você já sabe o que cada função faz, vamos entender o que aconteceu nas últimas 3 funções, que são `onCallMade`, `onAnswerMade` e `onAnswerMade`.

Quando um usuário entra na sala, ele envia uma oferta para os outros usuários, que é uma descrição da sessão SDP, e então os outros usuários recebem essa oferta em `onCallMade`, e então eles respondem com uma resposta, que também é uma descrição da sessão SDP, e então o usuário que enviou a oferta recebe a resposta em `onAnswerMade`, e então ele define essa descrição como descrição remota da conexão peer.

**Obs: sim, aqui eu expliquei "de trás pra frente", isso é pra você entender que isso é bi-direcional.**

## Funções de execução

```ts
  joinRoom(data: any) {
    this._room = data.link;
    this._userId = data.user;
    this.socket.emit('join', { link: this._room, userId: this._userId });
  }

  onAddUser(callback: any) {
    this.socket.on(`${this._room}-add-user`, async ({ user }: any) => {
      callback(user);
    });
  }

  onRemoveUser(callback: any) {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }: any) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback: any) {
    this.socket.on(`${this._room}-update-user-list`, ({ users }: any) => {
      callback(users);
    });
  }

  updateUserMovement(data: any) {
    this.socket.emit('move', data);
  }

  updateUserMute(data: any) {
    this.socket.emit('toggl-mute-user', data);
  }
```

Essas são funções que emitem ou recebem eventos vindos lá do servidor, e que são usadas para atualizar a lista de usuários na sala, adicionar e remover usuários da sala, atualizar a posição do usuário, mutar um usuário e entre outras coisas, a lógica delas será implementada aonde usarmos o service.

## Finalmente, o instancializador

Essa função ficará fora da classe, okay?

```ts
export const createPeerConnectionContext = (url: string) => {
  const socket = io(url);

  return new PeerConnectionSession(socket);
};
```

Ela basicamente instancia o Socket IO, e cria uma instância da classe `PeerConnectionSession` passando o socket como parâmetro.

O seu arquivo vai ficar assim no final:

```ts
import { io } from "socket.io-client";

function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class PeerConnectionSession {
  _room: any;
  _userId: any;
  socket: any;
  peerConnections: RTCPeerConnection[] = [];
  senders = [] as any;
  listeners = {} as any;
  connected = false;
  ons = [] as any;

  constructor(socket: any) {
    this.socket = socket;
  }

  connect() {
    this.connected = true;
  }

  addPeerConnection(id: any, stream: any, callback: any) {
    if (!this.peerConnections[id]) {
      console.log("creating peer:", id);
      this.peerConnections[id] = new window.RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      stream.getTracks().forEach((track: any) => {
        this.senders.push(this.peerConnections[id].addTrack(track, stream));
      });

      this.listeners[id] = (event: any) => {
        const on =
          "_on" +
          capitalizeFirstLetter(this.peerConnections[id].connectionState);
        const fn = this.ons[on];
        fn && fn(event, id);
      };

      this.peerConnections[id].addEventListener(
        "connectionstatechange",
        this.listeners[id]
      );

      this.peerConnections[id].ontrack = function ({ streams: [stream] }: any) {
        callback(stream);
      };
    }
  }

  removePeerConnection(id: any) {
    if (this.peerConnections[id]) {
      this.peerConnections[id].removeEventListener(
        "connectionstatechange",
        this.listeners[id]
      );
      delete this.peerConnections[id];
      delete this.listeners[id];
    }
  }

  async callUser(to: any) {
    console.log(
      "callUser to:",
      to,
      this.peerConnections[to]?.iceConnectionState
    );
    if (this.peerConnections[to]?.iceConnectionState === "new") {
      const offer = await this.peerConnections[to].createOffer();
      await this.peerConnections[to].setLocalDescription(
        new RTCSessionDescription(offer)
      );
      this.socket.emit("call-user", { offer, to, link: this._room });
    }
  }

  onAnswerMade(callback: any) {
    this.socket.on("answer-made", async (data: any) => {
      console.log("answer-made", data.socket);
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      callback(data.socket);
    });
  }

  onCallMade() {
    this.socket.on("call-made", async (data: any) => {
      const selectedPeer = this.peerConnections[data.socket];

      console.log("call-made", data.socket);
      if (selectedPeer) {
        await selectedPeer.setRemoteDescription(
          new RTCSessionDescription(data.offer)
        );
        const answer = await selectedPeer.createAnswer();
        await selectedPeer.setLocalDescription(
          new RTCSessionDescription(answer)
        );
        this.socket.emit("make-answer", {
          answer,
          to: data.socket,
          link: this._room,
        });
      }
    });
  }

  joinRoom(data: any) {
    this._room = data.link;
    this._userId = data.user;
    this.socket.emit("join", { link: this._room, userId: this._userId });
  }

  onAddUser(callback: any) {
    this.socket.on(`${this._room}-add-user`, async ({ user }: any) => {
      callback(user);
    });
  }

  onRemoveUser(callback: any) {
    this.socket.on(`${this._room}-remove-user`, ({ socketId }: any) => {
      callback(socketId);
    });
  }

  onUpdateUserList(callback: any) {
    this.socket.on(`${this._room}-update-user-list`, ({ users }: any) => {
      callback(users);
    });
  }

  updateUserMovement(data: any) {
    this.socket.emit("move", data);
  }

  updateUserMute(data: any) {
    this.socket.emit("toggl-mute-user", data);
  }
}

export const createPeerConnectionContext = (url: string) => {
  const socket = io(url);

  return new PeerConnectionSession(socket);
};
```

# Lembrando da aula de Debug

Lembre-se, teremos uma última aula que se chamará `Debugando o Web Socket` e lá você vai ver tudo isso funcionando como mágica.
