import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  avatarSrc: string;
}

@Component({
  selector: 'app-avatar-modal',
  templateUrl: './avatar-modal.component.html',
  styleUrls: ['./avatar-modal.component.scss'],
})
export class AvatarModalComponent {
  avatars = [
    'avatar_01_front',
    'avatar_02_front',
    'avatar_03_front',
    'avatar_04_front',
    'avatar_05_front',
    'avatar_06_front',
    'avatar_07_front',
    'avatar_08_front',
    'avatar_09_front',
  ];

  constructor(
    public dialogRef: MatDialogRef<AvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  selectAvatar(avatar: string): void {
    this.data.avatarSrc = avatar;
  }

  getAvatar(avatar: string): string {
    return `assets/images/avatars/${avatar}.png`;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
