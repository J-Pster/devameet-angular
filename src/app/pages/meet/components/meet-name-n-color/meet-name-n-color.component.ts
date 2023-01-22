import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-meet-name-n-color',
  templateUrl: './meet-name-n-color.component.html',
  styleUrls: ['./meet-name-n-color.component.scss'],
})
export class MeetNameNColorComponent {
  @Input() title!: string;
  @Input() defaultNameValue: string = '';
  @Input() nameControl!: AbstractControl;
  @Input() selectedColor!: string;

  @Output() changeColor: EventEmitter<string> = new EventEmitter<string>();
}
