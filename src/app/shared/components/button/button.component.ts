import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() public texto?: string;
  @Input() public cor: 'primaria' | 'outline' = 'primaria';
  @Input() public classeCss: string = '';
  @Input() public tipo: 'button' | 'submit' = 'button';
  @Input() public desabilitar: boolean = false;
}
