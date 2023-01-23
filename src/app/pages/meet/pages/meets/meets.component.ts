import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';
import { MeetService } from 'src/app/services/meet/meet.service';
import { Meet } from 'src/app/types/meet.type';

@Component({
  selector: 'app-meets',
  templateUrl: './meets.component.html',
  styleUrls: ['./meets.component.scss'],
})
export class MeetsComponent {
  nome = 'Usuário';
  meetings: Meet[] = [];

  selectedMeet: Meet = {} as Meet;
  objectsFromMeet: any = [];

  constructor(
    private localStorageService: LocalstorageService,
    private meetService: MeetService,
    private _snackBar: MatSnackBar,
    private route: Router
  ) {}

  notLoaded(): void {
    this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  selectMeet(meet: Meet) {
    this.selectedMeet = meet;

    this.meetService
      .getMeetObjects(meet.id)
      .then((res) => {
        this.objectsFromMeet = res.map((e: any) => {
          return { ...e, type: e.name.split('_')[0] };
        });
      })
      .catch((err) => {
        console.error(err);
        this.notLoaded();
      });
  }

  ngOnInit() {
    this.nome = this.localStorageService.getItem('name') || 'Usuário';
    this.getMeets();
  }

  createMeet() {
    this.route.navigateByUrl('/new');
  }

  joinMeet() {
    this.route.navigate(['meet', this.selectedMeet.link]);
  }

  private getMeets() {
    this.meetService.getMeets().then((res) => {
      this.meetings = res;
    });
  }
}
