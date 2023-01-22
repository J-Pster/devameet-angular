import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditMeetComponent } from './edit-meet.component';

const routes: Routes = [{ path: '', component: EditMeetComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditMeetRoutingModule { }
