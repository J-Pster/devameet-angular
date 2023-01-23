import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/local/localstorage.service';

@Component({
  selector: 'app-link-meet',
  templateUrl: './link-meet.component.html',
  styleUrls: ['./link-meet.component.scss'],
})
export class LinkMeetComponent implements OnInit {
  nome: string = '';
  form: FormGroup;

  constructor(
    private localStorageService: LocalstorageService,
    private fb: FormBuilder,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      link: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.nome = this.localStorageService.getItem('name') || 'Usuário';
  }

  getFormRef(nomeCampo: string): AbstractControl {
    return this.form.controls[nomeCampo];
  }

  joinMeet() {
    if (this.form.invalid) {
      this._snackBar.open('Link inválido!', 'OK', {
        duration: 2000,
        verticalPosition: 'top',
      });
      return;
    }

    const link = this.form.value.link;
    this.route.navigateByUrl(`/meet/${link}`);
  }
}
