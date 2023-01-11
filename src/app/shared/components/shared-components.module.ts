import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from './button/button.component';
import { CtaFooterComponent } from './cta-footer/cta-footer.component';
import { RouterModule } from '@angular/router';
import { AvatarComponent } from './avatar/avatar.component';
import { UploadAvatarComponent } from './upload-avatar/upload-avatar.component';

@NgModule({
  declarations: [
    InputComponent,
    ButtonComponent,
    CtaFooterComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [
    InputComponent,
    ButtonComponent,
    CtaFooterComponent,
    AvatarComponent,
    UploadAvatarComponent,
  ],
})
export class SharedComponentsModule {}
