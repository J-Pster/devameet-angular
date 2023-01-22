import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewMeetComponent } from './new-meet.component';

const routes: Routes = [{ path: '', component: NewMeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewMeetRoutingModule {}
