import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
interface Color {
  value: string;
}

@Component({
  selector: 'app-color-selector-modal',
  templateUrl: './color-selector-modal.component.html',
  styleUrls: ['./color-selector-modal.component.scss'],
})
export class ColorSelectorModalComponent {
  @Input() colors: Color[] = [
    {
      value: '#8250C4',
    },
    {
      value: '#107C10',
    },
    {
      value: '#EB5757',
    },
    {
      value: '#F2994A',
    },
    {
      value: '#2D9CDB',
    },
  ];

  @Input() selected = '#8250C4';

  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  selectColor(event: any) {
    const color = event.target.title;
    this.onSelect.emit(color);
  }
}
