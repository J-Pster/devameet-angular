import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() active: string = '';

  constructor(private route: Router) {}

  navigate(page: string) {
    this.route.navigateByUrl(page);
  }

  getAvatarClass() {
    return this.active === 'profile' ? 'navActive' : 'nav';
  }
}
