import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinMeetComponent } from './join-meet.component';

const routes: Routes = [{ path: '', component: JoinMeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinMeetRoutingModule { }
