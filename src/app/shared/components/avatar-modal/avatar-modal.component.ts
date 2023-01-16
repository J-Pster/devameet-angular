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
    'assets/images/avatars/avatar_01_front.png',
    'assets/images/avatars/avatar_02_front.png',
    'assets/images/avatars/avatar_03_front.png',
    'assets/images/avatars/avatar_04_front.png',
    'assets/images/avatars/avatar_05_front.png',
    'assets/images/avatars/avatar_06_front.png',
    'assets/images/avatars/avatar_07_front.png',
    'assets/images/avatars/avatar_08_front.png',
    'assets/images/avatars/avatar_09_front.png',
  ];

  constructor(
    public dialogRef: MatDialogRef<AvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  selectAvatar(avatar: string): void {
    this.data.avatarSrc = avatar;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
