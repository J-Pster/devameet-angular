import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetsComponent } from './meets.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { MeetComponentsModule } from '../../components/meet-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [MeetsComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,
    SharedPagesModule,
    MeetComponentsModule,
    MatSnackBarModule,
  ],
  exports: [MeetsComponent],
})
export class MeetsModule {}
