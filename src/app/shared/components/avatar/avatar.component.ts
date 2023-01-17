import { Component, Input } from '@angular/core';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() public src?: string;
  @Input() public classeCss: string = '';

  constructor(private localStorageService: LocalstorageService) {}

  public obterAvatar(): string {
    if (this.src) {
      return this.src;
    }

    return (
      this.localStorageService.getItem('avatar') ||
      'assets/images/avatars/avatar_07_front.png'
    );
  }
}
