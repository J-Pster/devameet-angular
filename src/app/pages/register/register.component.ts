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
    public dialog: MatDialog
  ) {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AvatarModalComponent, {
      data: { avatarSrc: this.avatarSrc },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed, result: ', result);
      if (result) {
        this.avatarSrc = result;
      }
    });
  }
}
