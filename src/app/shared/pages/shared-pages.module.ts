import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicaComponent } from './publica/publica.component';
import { SharedComponentsModule } from '../components/shared-components.module';

@NgModule({
  declarations: [PublicaComponent],
  imports: [CommonModule, SharedComponentsModule],
  exports: [PublicaComponent],
})
export class SharedPagesModule {}
