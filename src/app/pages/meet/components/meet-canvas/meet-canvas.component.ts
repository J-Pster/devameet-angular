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
import { MeetCompleteObject } from 'src/app/types/meet.type';

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
  }

  ngOnDestroy(): void {
    document.removeEventListener('keyup', this.moveSelected);
  }

  // Image Functions

  getImageFromObject(object: any) {
    if (!object?.name || !object?.name.trim().length) {
      return '';
    }

    const orientation = object.orientation ? `_${object.orientation}` : '';
    return `assets/images/objects/${object.type}/${object.name}${orientation}.png`;
  }

  getObjectStyle(object: any): any {
    return object.zindex ? { zIndex: object.zindex } : {};
  }

  getClassObject(object: MeetCompleteObject): string {
    let cl = '';

    if (this.selected?._id && object._id && this.selected?._id === object._id) {
      cl += 'selected ';
    }

    const classMap: any = {
      0: 'zero',
      1: 'one',
      2: 'two',
      3: 'three',
      4: 'four',
      5: 'five',
      6: 'six',
      7: 'seven',
    };

    if (
      object?.flexStart ||
      object?.type === 'wall' ||
      object?.type === 'floor'
    ) {
      cl += 'column-start ';

      if (object?.type === 'wall') {
        cl += 'row-start';
      } else {
        cl += 'floor-start';
      }
    } else {
      cl += `column-${classMap[object.x]} row-${classMap[object.y]}`;
    }

    return cl;
  }

  selectObject(obj: any) {
    if (this.onlyView) return;
    this.setSelected.emit(obj);
  }

  // Move

  moveSelected = (event: any) => {
    if (this.onlyView || !this.selected || !this.selected._id || !event) return;
    const selected = this.selected;

    const to = (() => {
      switch (event.key) {
        case 'ArrowUp':
          return 'up';
        case 'ArrowDown':
          return 'down';
        case 'ArrowLeft':
          return 'left';
        case 'ArrowRight':
          return 'right';
        default:
          return '';
      }
    })();

    if (to) {
      this.moveObject.emit({ selected, to });
    }
  };
}
