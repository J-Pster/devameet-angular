import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
  exports: [RegisterComponent],
})
export class RegisterModule {}
