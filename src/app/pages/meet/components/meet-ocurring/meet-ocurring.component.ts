import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-meet-ocurring',
  templateUrl: './meet-ocurring.component.html',
  styleUrls: ['./meet-ocurring.component.scss'],
})
export class MeetOcurringComponent {
  @Input() objects: any;
  @Input() connectedUsers: any;
  @Input() me: any;

  mobile: boolean = window.innerWidth < 992;

  finishLoadAssets: boolean = false;

  constructor() {}

  getImageFromObject(object: any) {
    if (!object?.name || !object?.name.trim().length) {
      return '';
    }

    const orientation = object.orientation ? `_${object.orientation}` : '';
    return `assets/images/objects/${object.type}/${object.name}${orientation}.png`;
  }

  getImageFromAvatar(user: any) {
    const avatarArray = user?.avatar?.split('_');
    const avatar = avatarArray[0] + '_' + avatarArray[1];

    if (avatar) {
      const orientation = user?.orientation || '';
      return `assets/images/objects/avatar/${avatar}_${orientation}.png`;
    }

    return '';
  }

  resizeForMobile(obj: any, style: any): any {
    if (!this.mobile) return;

    const { type } = obj;
    const image = new Image();

    image.src = obj.avatar
      ? this.getImageFromAvatar(obj)
      : this.getImageFromObject(obj);

    if (type === 'wall' || type === 'floor') {
      style.width = image.width * 0.5625 + 'px';
    } else {
      style.width = image.width * 0.5625 + 'px';
      style.height = image.height * 0.5625 + 'px';
    }

    return style;
  }

  getObjectStyle(obj: any): any {
    const { zindex } = obj;

    const style = {} as any;

    if (zindex) {
      style.zIndex = zindex;
    }

    if (!this.mobile) return style;

    return this.resizeForMobile(obj, style);
  }

  getClassObject(object: any): string {
    let cl = '';
    const { flexStart, type, x, y } = object;

    if (flexStart || type === 'wall' || type === 'floor') {
      cl = `column-start${type === 'wall' ? ' row-start' : ' floor-start'}`;
      return cl;
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

  getName(user: any) {
    return user?.name;
  }

  getMutedClass(user: any) {
    if (user?.muted) {
      return 'muted';
    }
    return '';
  }
}
