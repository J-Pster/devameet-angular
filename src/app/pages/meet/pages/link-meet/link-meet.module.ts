import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinkMeetRoutingModule } from './link-meet-routing.module';
import { LinkMeetComponent } from './link-meet.component';
import { DecoratorsModule } from 'src/app/shared/decorators/decorators.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [LinkMeetComponent],
  imports: [
    CommonModule,
    LinkMeetRoutingModule,
    DecoratorsModule,
    SharedPagesModule,
    SharedComponentsModule,
    MatSnackBarModule,
  ],
})
export class LinkMeetModule {}
