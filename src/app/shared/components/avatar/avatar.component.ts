import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() public src?: string;
  @Input() public classeCss: string = '';

  public obterAvatar(): string {
    if (this.src) {
      return this.src;
    }

    return 'assets/images/avatars/avatar_07_front.png';
  }
}
