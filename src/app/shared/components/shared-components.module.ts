import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { CtaFooterComponent } from './cta-footer/cta-footer.component';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from './avatar/avatar.component';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';
import { HeaderComponent } from './header/header.component';
import { AvatarModalComponent } from './avatar-modal/avatar-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FooterComponent } from './footer/footer.component';
import { ColorSelectorComponent } from './color-selector/color-selector.component';
import { ColorSelectorModalComponent } from './color-selector/color-selector-modal/color-selector-modal.component';
import { MeetSnackbarComponent } from './meet-snackbar/meet-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    CtaFooterComponent,
    AvatarComponent,
    UploadAvatarComponent,
    HeaderComponent,
    AvatarModalComponent,
    FooterComponent,
    ColorSelectorComponent,
    ColorSelectorModalComponent,
    MeetSnackbarComponent,
    ConfirmModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    CtaFooterComponent,
    AvatarComponent,
    UploadAvatarComponent,
    HeaderComponent,
    FooterComponent,
    ColorSelectorComponent,
    MeetSnackbarComponent,
  ],
})
export class SharedComponentsModule {}
