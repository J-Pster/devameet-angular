import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-n-footer',
  templateUrl: './header-n-footer.component.html',
  styleUrls: ['./header-n-footer.component.scss'],
})
export class HeaderNFooterComponent {
  @Input() active: string = '';
  @Input() cssClass: string = '';
}
