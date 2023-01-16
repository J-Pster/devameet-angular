import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-upload-avatar',
  templateUrl: './upload-avatar.component.html',
  styleUrls: ['./upload-avatar.component.scss'],
})
export class UploadAvatarComponent {
  @Input() public referenciaFormulario?: AbstractControl;
  @Input() public classeCssContainer: string = '';
  @Input() public imagemPrevisualizacao?: string;
  @Input() public classeCssImagemPrevisualizacao: string = '';
  @Output() public aoAtualizarImagem: EventEmitter<string> = new EventEmitter();
}
