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
import { MatFormFieldModule } from '@angular/material/form-field';
import { FooterComponent } from './footer/footer.component';

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
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
  ],
  exports: [
    InputComponent,
    ButtonComponent,
    CtaFooterComponent,
    AvatarComponent,
    UploadAvatarComponent,
    HeaderComponent,
    FooterComponent,
  ],
})
export class SharedComponentsModule {}
