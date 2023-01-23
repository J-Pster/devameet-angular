import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
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
    if (this.userMediaStream) {
      this.wsServices.connect();
      this.wsServices.joinRoom({ link: this.link, user: this.userId });
      this.wsServices.onUpdateUserList(async (users: any) => {
        if (users) {
          this.connectedUsers = users;
          const me = users.find((u: any) => u.user === this.userId);
          if (me) {
            this.me = me;
          }
          const usersWithoutMe = users.filter(
            (u: any) => u.user != this.userId
          );
          for (const user of usersWithoutMe) {
            this.wsServices.addPeerConnection(
              `${user.clientId}`,
              this.userMediaStream,
              (_stream: any) => {
                this.audioSrcs.push({ id: user.clientId, src: _stream });
              }
            );
          }
        }
      });
      this.wsServices.onCallMade();
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

      this.wsServices.onRemoveUser((socketId: any) => {
        this.connectedUsers = this.connectedUsers.filter(
          (user: any) => user.clientId !== socketId
        );
        this.wsServices.removePeerConnection(socketId);
      });

      this.wsServices.onAnswerMade((socket: any) =>
        this.wsServices.callUser(socket)
      );

      document.addEventListener('keyup', this.moveAvatar);

      this.joined = true;
    }
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
    if (event && user) {
      let payload = {
        userId: user.user,
        link: this.link,
      } as any;

      switch (event.key) {
        case 'ArrowUp':
          payload.x = user.x;
          payload.orientation = 'back';
          if (user.orientation === 'back') {
            payload.y = user.y > 1 ? user.y - 1 : 1;
          } else {
            payload.y = user.y;
          }
          break;
        case 'ArrowDown':
          payload.x = user.x;
          payload.orientation = 'front';
          if (user.orientation === 'front') {
            payload.y = user.y < 7 ? user.y + 1 : 7;
          } else {
            payload.y = user.y;
          }
          break;
        case 'ArrowLeft':
          payload.y = user.y;
          payload.orientation = 'left';
          if (user.orientation === 'left') {
            payload.x = user.x > 0 ? user.x - 1 : 0;
          } else {
            payload.x = user.x;
          }
          break;
        case 'ArrowRight':
          payload.y = user.y;
          payload.orientation = 'right';
          if (user.orientation === 'right') {
            payload.x = user.x < 7 ? user.x + 1 : 7;
          } else {
            payload.x = user.x;
          }
          break;
        default:
          break;
      }

      if (payload?.x >= 0 && payload.y >= 0 && payload.orientation) {
        this.wsServices.updateUserMovement(payload);
      }
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

  loadMeeting() {
    let meetLink = this.routeActive.snapshot.paramMap.get('link');
    if (!meetLink) {
      this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });

      setTimeout(() => {
        this.route.navigateByUrl('/');
      }, 2000);

      return;
    }

    this.meetService
      .getRoom(meetLink)
      .then(async (meet) => {
        this.name = meet.name;
        this.link = meet.link;
        this.color = meet.color;
        this.objects = meet.objects.map((e: any) => {
          return { ...e, type: e.name.split('_')[0] };
        });

        this.userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 640, ideal: 1920 },
            height: { min: 400, ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 },
          },
          audio: true,
        });

        if (document.getElementById('localVideoRef')) {
          const videoRef: any = document.getElementById('localVideoRef');
          videoRef.srcObject = this.userMediaStream;
        }
      })
      .catch((err) => {
        console.error('Error: ', err);
        if (err.status === 404 || err.status === 401) {
          this.error = true;
        } else {
          this._snackBar.open('Erro ao carregar a reunião!', 'OK', {
            duration: 2000,
            verticalPosition: 'top',
          });
        }
      });
  }
}
