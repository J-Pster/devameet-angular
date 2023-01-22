import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';
import { AvatarModalComponent } from 'src/app/shared/components/avatar-modal/avatar-modal.component';
import { UserService } from 'src/app/services/user/user.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  avatarSrc: string = 'assets/images/avatars/avatar_07_front.png';
  name: string = 'Usuário';

  form: FormGroup;
  disabledName: boolean = true;

  constructor(
    private localStorageService: LocalstorageService,
    private authService: AuthService,
    private userService: UserService,
    private route: Router,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  public getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  togleName() {
    this.disabledName = !this.disabledName;

    if (!this.disabledName) {
      this.getFormRef('name').setValue('');
    }
  }

  ngOnInit(): void {
    const avatarLocal = this.localStorageService.getItem('avatar');
    if (avatarLocal) this.avatarSrc = avatarLocal;

    const nameLocal = this.localStorageService.getItem('name');
    if (nameLocal) this.name = nameLocal;
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

  onLogout() {
    this.authService.logout();
  }

  onCancel() {
    this.route.navigateByUrl('/');
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

    this.userService
      .updateUser({
        name: formValues.name,
        avatar: this.avatarSrc,
      })
      .then(() => {
        this.localStorageService.setItem('name', formValues.name);
        this.localStorageService.setItem('avatar', this.avatarSrc);

        this._snackBar.open('Perfil atualizado com sucesso!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.route.navigateByUrl('/');
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao atualizar perfil!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }
}
