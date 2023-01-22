import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { DecoratorsModule } from 'src/app/shared/decorators/decorators.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    DecoratorsModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
})
export class ProfileModule {}
