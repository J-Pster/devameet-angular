import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../components/shared-components.module';
import { HeaderNFooterComponent } from './header-n-footer/header-n-footer.component';

@NgModule({
  declarations: [HeaderNFooterComponent],
  imports: [CommonModule, SharedComponentsModule],
  exports: [HeaderNFooterComponent],
})
export class DecoratorsModule {}
