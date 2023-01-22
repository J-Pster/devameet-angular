import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetsComponent } from './meets.component';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';

@NgModule({
  declarations: [MeetsComponent],
  imports: [CommonModule, SharedComponentsModule, SharedPagesModule],
  exports: [MeetsComponent],
})
export class MeetsModule {}
