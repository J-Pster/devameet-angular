import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewMeetRoutingModule } from './new-meet-routing.module';
import { NewMeetComponent } from './new-meet.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MeetComponentsModule } from '../../components/meet-components.module';

@NgModule({
  declarations: [NewMeetComponent],
  imports: [
    CommonModule,
    NewMeetRoutingModule,
    SharedComponentsModule,
    SharedPagesModule,
    MeetComponentsModule,
    MatSnackBarModule,
  ],
})
export class NewMeetModule {}
