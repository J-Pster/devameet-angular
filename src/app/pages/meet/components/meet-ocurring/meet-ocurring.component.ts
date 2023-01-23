import { Component, Input, Output } from '@angular/core';

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
  objectsWithWidth: any = [];
  usersWithWidth: any = [];

  constructor() {}

  getImageFromObject(object: any) {
    if (object?.name && object?.name.trim().length > 0) {
      const path = `assets/images/objects/${object?.type}/${object?.name}${
        object?.orientation ? '_' + object?.orientation : ''
      }.png`;

      return path;
    }

    return '';
  }

  getImageFromAvatar(user: any) {
    const splited = user?.avatar.split('_');
    const avatar = `${splited[0]}_${splited[1]}`;

    if (avatar && avatar.trim().length > 0) {
      const path = `assets/images/objects/avatar/${avatar}${
        user?.orientation ? '_' + user?.orientation : ''
      }.png`;

      return path;
    }

    return '';
  }

  resizeForMobile(obj: any, style: any): any {
    if (!this.mobile) return;

    const { zindex, type } = obj;

    if (type === 'wall' || type === 'floor') {
      style.width = '100%';
    } else {
      style.transform = 'scale(0.6)';
    }

    return style;
  }

  getObjectStyle(obj: any): any {
    const { zindex, type } = obj;

    const style = {} as any;

    if (zindex) {
      style.zIndex = zindex;
    }

    const finalStyle = this.resizeForMobile(obj, style);

    return finalStyle;
  }

  getClassObject(object: any): string {
    let cl = '';

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
