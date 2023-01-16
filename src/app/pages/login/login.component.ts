import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
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
      this._snackBar.open('Logando!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } catch (error) {}
  }
}
