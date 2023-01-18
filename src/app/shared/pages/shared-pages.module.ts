import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicaComponent } from './publica/publica.component';
import { SharedComponentsModule } from '../components/shared-components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DecoratorsModule } from '../decorators/decorators.module';

@NgModule({
  declarations: [PublicaComponent, DashboardComponent],
  imports: [CommonModule, SharedComponentsModule, DecoratorsModule],
  exports: [PublicaComponent, DashboardComponent],
})
export class SharedPagesModule {}
