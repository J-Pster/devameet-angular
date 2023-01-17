import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetComponent } from './meet.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { DecoratorsModule } from 'src/app/shared/decorators/decorators.module';

@NgModule({
  declarations: [MeetComponent],
  imports: [CommonModule, SharedComponentsModule, DecoratorsModule],
  exports: [MeetComponent],
})
export class MeetModule {}
