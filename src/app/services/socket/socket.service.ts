import { io } from 'socket.io-client';

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

  onAnswerMade(callback: any) {
    this.socket.on('answer-made', async (data: any) => {
      console.log('answer-made', data.socket);
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      callback(data.socket);
    });
  }

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
}

export const createPeerConnectionContext = (url: string) => {
  const socket = io(url);

  return new PeerConnectionSession(socket);
};
