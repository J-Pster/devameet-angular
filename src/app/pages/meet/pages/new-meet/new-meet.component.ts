import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MeetService } from 'src/app/services/meet/meet.service';

@Component({
  selector: 'app-new-meet',
  templateUrl: './new-meet.component.html',
  styleUrls: ['./new-meet.component.scss'],
})
export class NewMeetComponent {
  form: FormGroup;
  selectedColor: string = '#8250C4';

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  changeColor(color: string) {
    this.selectedColor = color;
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
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

    this.meetService
      .createMeet({
        name: formValues.name,
        color: this.selectedColor,
      })
      .then(() => {
        this._snackBar.open('Reunião criada com Sucesso!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.route.navigateByUrl('/');
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao criar reunião!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 6000,
          verticalPosition: 'top',
        });
      });
  }
}
