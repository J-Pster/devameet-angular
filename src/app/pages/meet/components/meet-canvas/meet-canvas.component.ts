import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-meet-canvas',
  templateUrl: './meet-canvas.component.html',
  styleUrls: ['./meet-canvas.component.scss'],
})
export class MeetCanvasComponent implements OnInit, OnDestroy, OnChanges {
  @Input() onlyView: boolean = false;

  @Input() objects: any;
  @Input() selected: any;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes: ', changes);

    if (changes['selected']) {
      this.selected = changes['selected'].currentValue;
    }
  }

  @Output() setSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() removeObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() rotateObject: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveObject: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    document.addEventListener('keyup', this.moveSelected);

    console.log('objects', this.objects);
    console.log('Selected: ', this.selected);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keyup', this.moveSelected);
  }

  // Image Functions

  getImageFromObject(object: any) {
    if (object?.name && object?.name.trim().length > 0) {
      const path = `assets/images/objects/${object?.type}/${object?.name}${
        object?.orientation ? '_' + object?.orientation : ''
      }.png`;
      return path;
    }

    return '';
  }

  getObjectStyle(object: any): any {
    const style: any = {};

    if (object.zindex) {
      style.zIndex = object.zindex;
    }

    return style;
  }

  getClassObject(object: any): string {
    let cl = '';

    if (this.selected?._id && object._id && this.selected?._id === object._id) {
      cl += 'selected ';
    }

    if (
      object?.flexStart ||
      object?.type === 'wall' ||
      object?.type === 'floor'
    ) {
      cl += 'column-start';

      if (object?.type === 'wall') {
        cl += ' row-start';
      } else {
        cl += ' floor-start';
      }

      return cl;
    }

    switch (object.x) {
      case 0:
        cl += 'column-zero';
        break;
      case 1:
        cl += 'column-one';
        break;
      case 2:
        cl += 'column-two';
        break;
      case 3:
        cl += 'column-three';
        break;
      case 4:
        cl += 'column-four';
        break;
      case 5:
        cl += 'column-five';
        break;
      case 6:
        cl += 'column-six';
        break;
      case 7:
        cl += 'column-seven';
        break;
      default:
        break;
    }

    switch (object.y) {
      case 0:
        cl += ' row-zero';
        break;
      case 1:
        cl += ' row-one';
        break;
      case 2:
        cl += ' row-two';
        break;
      case 3:
        cl += ' row-three';
        break;
      case 4:
        cl += ' row-four';
        break;
      case 5:
        cl += ' row-five';
        break;
      case 6:
        cl += ' row-six';
        break;
      case 7:
        cl += ' row-seven';
        break;
      default:
        break;
    }

    return cl;
  }

  selectObject(obj: any) {
    if (this.onlyView) return;
    this.setSelected.emit(obj);
  }

  // Move

  moveSelected = (event: any) => {
    if (this.onlyView) return;
    const selected = this.selected;

    const { _id } = selected;
    if (event && _id) {
      let to = '';
      switch (event.key) {
        case 'ArrowUp':
          to = 'up';
          break;
        case 'ArrowDown':
          to = 'down';
          break;
        case 'ArrowLeft':
          to = 'left';
          break;
        case 'ArrowRight':
          to = 'right';
          break;
        default:
          break;
      }

      if (to) {
        this.moveObject.emit({ selected, to });
      }
    }
  };
}
