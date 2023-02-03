import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';
import { MeetService } from 'src/app/services/meet/meet.service';

import { createPeerConnectionContext } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-join-meet',
  templateUrl: './join-meet.component.html',
  styleUrls: ['./join-meet.component.scss'],
})
export class JoinMeetComponent implements OnDestroy {
  name: string = '';
  link: string = '';
  color: string = '';
  objects: any = [];
  userMediaStream: any = null;
  me: any = {};

  connectedUsers: any = [];
  audioSrcs: any = [];

  wsServices = createPeerConnectionContext('http://localhost:3303');
  joined: boolean = false;
  error: boolean = false;
  userId: string = '';

  mobile: boolean = window.innerWidth < 992;

  constructor(
    private routeActive: ActivatedRoute,
    private localStorageService: LocalstorageService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {}

  // Meet

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

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    this._snackBar.open('Link copiado com sucesso!', 'Ok', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  moveAvatar = (event: any) => {
    const user = this.me;
    if (!event || !user) return;

    let x = user.x;
    let y = user.y;
    let orientation = user.orientation;

    switch (event.key) {
      case 'ArrowUp':
        y =
          user.orientation === 'back' ? (user.y > 1 ? user.y - 1 : 1) : user.y;
        orientation = 'back';
        break;
      case 'ArrowDown':
        y =
          user.orientation === 'front' ? (user.y < 7 ? user.y + 1 : 7) : user.y;
        orientation = 'front';
        break;
      case 'ArrowLeft':
        x =
          user.orientation === 'left' ? (user.x > 0 ? user.x - 1 : 0) : user.x;
        orientation = 'left';
        break;
      case 'ArrowRight':
        x =
          user.orientation === 'right' ? (user.x < 7 ? user.x + 1 : 7) : user.x;
        orientation = 'right';
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

  togglMute() {
    let payload = {
      userId: this.userId,
      link: this.link,
      muted: !this.me.muted,
    };

    this.wsServices.updateUserMute(payload);
  }

  usersWithoutMe() {
    const result = this.connectedUsers.filter(
      (u: any) => u.user !== this.userId
    );
    return result;
  }

  getAudioSrc(userId: string) {
    const srcObj = this.audioSrcs.find((a: any) => a.id === userId);
    return srcObj.src;
  }

  // Others

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
  }

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
}
