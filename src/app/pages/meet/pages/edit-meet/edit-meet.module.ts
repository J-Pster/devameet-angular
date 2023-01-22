import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditMeetRoutingModule } from './edit-meet-routing.module';
import { EditMeetComponent } from './edit-meet.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { MeetComponentsModule } from '../../components/meet-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [EditMeetComponent],
  imports: [
    CommonModule,
    EditMeetRoutingModule,
    SharedComponentsModule,
    MeetComponentsModule,
    MatSnackBarModule,
    SharedPagesModule,
  ],
})
export class EditMeetModule {}
