import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
