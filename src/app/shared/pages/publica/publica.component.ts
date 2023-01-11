import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-publica',
  templateUrl: './publica.component.html',
  styleUrls: ['./publica.component.scss'],
})
export class PublicaComponent {
  @Input() classeCssCustomizada: string = '';
  @Input() classeCssLogo: string = '';
  @Input() textoBotaoSubmit?: string;
  @Output() submiterFormulario: EventEmitter<any> = new EventEmitter();

  public aoSubmeter() {
    this.submiterFormulario.emit();
  }
}
