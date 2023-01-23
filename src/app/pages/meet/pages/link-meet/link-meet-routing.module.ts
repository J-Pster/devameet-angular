import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinkMeetComponent } from './link-meet.component';

const routes: Routes = [{ path: '', component: LinkMeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinkMeetRoutingModule { }
