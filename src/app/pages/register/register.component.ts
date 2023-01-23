import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { confirmPassVal } from 'src/app/shared/validators/confirm-pass.validator';
import { AvatarModalComponent } from 'src/app/shared/components/avatar-modal/avatar-modal.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { passwordValidator } from 'src/app/shared/validators/pass.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup;
  public avatarSrc: string = 'assets/images/avatars/avatar_07_front.png';

  constructor(
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(4), passwordValidator()],
      ],
      confirmPass: ['', [Validators.required, confirmPassVal()]],
    });
  }

  public getFormRef(nomeCampo: string): AbstractControl {
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

    const formValues = this.form.value;

    this.authService
      .register({
        name: formValues.nome,
        email: formValues.email,
        password: formValues.password,
        avatar: this.avatarSrc,
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        const errorMsg = err.error.message || 'Erro ao registrar usuário!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AvatarModalComponent, {
      data: { avatarSrc: this.avatarSrc },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.avatarSrc = result;
      }
    });
  }
}
