import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JoinMeetRoutingModule } from './join-meet-routing.module';
import { JoinMeetComponent } from './join-meet.component';


@NgModule({
  declarations: [
    JoinMeetComponent
  ],
  imports: [
    CommonModule,
    JoinMeetRoutingModule
  ]
})
export class JoinMeetModule { }
