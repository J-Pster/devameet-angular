import { Component } from '@angular/core';
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

  constructor(
    private localStorageService: LocalstorageService,
    private meetService: MeetService,
    private route: Router
  ) {}

  ngOnInit() {
    this.nome = this.localStorageService.getItem('name') || 'Usuário';
    this.getMeets();
  }

  createMeet() {
    this.route.navigateByUrl('/new');
  }

  private getMeets() {
    this.meetService.getMeets().then((res) => {
      this.meetings = res;
    });
  }
}
