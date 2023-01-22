import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Color {
  value: string;
}

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
})
export class ColorSelectorComponent {
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
  opened = false;

  @Output() onSelect: EventEmitter<string> = new EventEmitter();

  selectColor(color: string) {
    this.selected = color;
    this.opened = false;
    this.onSelect.emit(color);
  }

  openSelector() {
    this.opened = true;
  }
}
