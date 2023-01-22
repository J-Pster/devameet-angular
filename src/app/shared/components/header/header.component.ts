import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() active: string = '';
  @Input() cssClass: string = '';

  constructor(private route: Router) {}

  navigate(page: string) {
    this.route.navigateByUrl(page);
  }

  getAvatarClass() {
    return this.active === 'profile' ? 'navActive' : 'nav';
  }
}
