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

  public getAvatar(): string {
    if (this.src) {
      return `assets/images/avatars/${this.src}.png`;
    }

    const fromLocal = this.localStorageService.getItem('avatar');
    if (!fromLocal) return 'assets/images/avatars/avatar_07_front.png';

    return `assets/images/avatars/${fromLocal}.png`;
  }
}
