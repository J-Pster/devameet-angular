import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CadastroRoutingModule } from './cadastro-routing.module';
import { CadastroComponent } from './cadastro.component';
import { SharedPagesModule } from 'src/app/shared/pages/shared-pages.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

@NgModule({
  declarations: [CadastroComponent],
  imports: [
    CommonModule,
    CadastroRoutingModule,
    SharedPagesModule,
    SharedComponentsModule,
  ],
  exports: [CadastroComponent],
})
export class CadastroModule {}
