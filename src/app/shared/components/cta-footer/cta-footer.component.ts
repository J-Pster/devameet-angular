import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cta-footer',
  templateUrl: './cta-footer.component.html',
  styleUrls: ['./cta-footer.component.scss'],
})
export class CtaFooterComponent {
  @Input() pergunta?: string;
  @Input() textoDaAcao?: string;
  @Input() rota?: string;
}
