import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetComponent } from './meet.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';

@NgModule({
  declarations: [MeetComponent],
  imports: [CommonModule, SharedComponentsModule, SharedPagesModule],
  exports: [MeetComponent],
})
export class MeetModule {}
