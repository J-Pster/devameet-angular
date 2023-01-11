import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { confirmPassVal } from 'src/app/shared/validators/confirm-pass.validator';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
})
export class CadastroComponent {
  public form: FormGroup;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPass: ['', [Validators.required, confirmPassVal()]],
    });
  }

  public obterReferencia(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  public async aoSubmeter() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    try {
      this._snackBar.open('Cadastrando!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } catch (error) {}
  }
}
