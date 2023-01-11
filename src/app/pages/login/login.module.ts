import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}