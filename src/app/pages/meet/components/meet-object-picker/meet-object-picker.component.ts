import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-meet-object-picker',
  templateUrl: './meet-object-picker.component.html',
  styleUrls: ['./meet-object-picker.component.scss'],
})
export class MeetObjectPickerComponent {
  @Input() title!: string;
  @Input() iconSrc!: string;
  @Input() asset!: any;

  @Output() setObject: EventEmitter<any> = new EventEmitter<any>();

  show: boolean = false;
  selected: any;

  constructor() {}

  toggleShow() {
    this.show = !this.show;
  }

  getImageFromObject(object: any) {
    if (object && object.trim().length > 0) {
      const path = `assets/images/objects/${this.asset?.path}/${object}${
        this.asset?.defaultOrientation
          ? '_' + this.asset?.defaultOrientation
          : ''
      }.png`;
      return path;
    }

    return '';
  }

  selectObject(object: any) {
    this.selected = object;

    const objectFinal = {
      name: object,
      x: this.asset?.defaultXPosition,
      y: this.asset?.defaultYPosition,
      zindex: this.asset?.defaulZIndex,
      orientation: this.asset?.defaultOrientation || '',
      selectMultiple: this.asset?.selectMultiple,
      type: this.asset?.path,
      flexStart: this.asset?.flexStart,
      canRotate: this.asset?.canRotate,
    };

    this.setObject.emit(objectFinal);
  }
}
