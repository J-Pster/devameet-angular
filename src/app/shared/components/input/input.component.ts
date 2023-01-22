import { AbstractControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() referenciaFormulario?: AbstractControl;
  @Input() imagem?: string;
  @Input() tipo?: string;
  @Input() placeholder?: string;
  @Input() cssClass: string = '';
  @Input() default?: string;
  @Input() disabled: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.default) {
      this.referenciaFormulario?.setValue(this.default);
    }
  }

  public aoModificarCampo(event: any): void {
    this.referenciaFormulario?.setValue(event);
    this.referenciaFormulario?.markAsDirty();
  }

  public obterMensagemErro(): string {
    if (!this.referenciaFormulario?.errors) {
      return '';
    }

    if (this.referenciaFormulario?.errors['required']) {
      return 'Campo obrigatorio!';
    }

    if (this.referenciaFormulario?.errors['email']) {
      return 'Insira um e-mail válido!';
    }

    if (this.referenciaFormulario?.errors['minlength']) {
      return `Deve ter no mínino ${this.referenciaFormulario.errors['minlength'].requiredLength} caracteres!`;
    }

    if (this.referenciaFormulario?.errors['confirmPass']) {
      return 'As senhas não conferem!';
    }

    if (this.referenciaFormulario?.errors['password']) {
      return 'Senha inválida!';
    }

    return '';
  }
}
