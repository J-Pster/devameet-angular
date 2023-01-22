import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeetNameNColorComponent } from './meet-name-n-color/meet-name-n-color.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MeetObjectPickerComponent } from './meet-object-picker/meet-object-picker.component';
import { MeetCanvasComponent } from './meet-canvas/meet-canvas.component';

@NgModule({
  declarations: [
    MeetNameNColorComponent,
    MeetObjectPickerComponent,
    MeetCanvasComponent,
  ],
  imports: [CommonModule, SharedComponentsModule],
  exports: [
    MeetNameNColorComponent,
    MeetObjectPickerComponent,
    MeetCanvasComponent,
  ],
})
export class MeetComponentsModule {}
