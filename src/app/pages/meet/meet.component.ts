import { Component } from '@angular/core';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';

@Component({
  selector: 'app-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent {
  pageName = 'meet';
  nome = 'Usuário';
  meetings = [];

  constructor(private localStorageService: LocalstorageService) {}

  ngOnInit() {
    this.nome = this.localStorageService.getItem('name') || 'Usuário';
  }
}
