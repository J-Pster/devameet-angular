import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetComponent } from './meet.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

@NgModule({
  declarations: [MeetComponent],
  imports: [CommonModule, SharedComponentsModule],
  exports: [MeetComponent],
})
export class MeetModule {}
