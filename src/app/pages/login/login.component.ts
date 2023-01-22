import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordValidator } from 'src/app/shared/validators/pass.validator';

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
      password: [
        '',
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
    });
  }

  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  public async onSubmit() {
    if (this.form.invalid) {
      this._snackBar.open('Preencha todos os campos corretamente!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const formValues = this.form.value;

    this.authService
      .login({
        login: formValues.login,
        password: formValues.password,
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao realizar login!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }
}
