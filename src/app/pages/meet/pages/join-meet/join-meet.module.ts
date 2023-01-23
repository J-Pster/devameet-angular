import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinMeetRoutingModule } from './join-meet-routing.module';
import { JoinMeetComponent } from './join-meet.component';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { DecoratorsModule } from 'src/app/shared/decorators/decorators.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MeetComponentsModule } from '../../components/meet-components.module';

@NgModule({
  declarations: [JoinMeetComponent],
  imports: [
    CommonModule,
    JoinMeetRoutingModule,
    SharedPagesModule,
    DecoratorsModule,
    MatSnackBarModule,
    MeetComponentsModule,
  ],
})
export class JoinMeetModule {}
