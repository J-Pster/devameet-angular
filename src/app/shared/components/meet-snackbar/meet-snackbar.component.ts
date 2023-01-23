import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Meet } from 'src/app/types/meet.type';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MeetService } from 'src/app/services/meet/meet.service';

@Component({
  selector: 'app-meet-snackbar',
  templateUrl: './meet-snackbar.component.html',
  styleUrls: ['./meet-snackbar.component.scss'],
})
export class MeetSnackbarComponent {
  @Input() meet!: Meet;
  @Input() selected: boolean = false;

  @Output() onSelectMeet: EventEmitter<Meet> = new EventEmitter<Meet>();

  mobile = window.innerWidth < 992;

  constructor(
    private route: Router,
    private meetService: MeetService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  selectMeet() {
    if (this.mobile) return;

    this.onSelectMeet.emit(this.meet);
  }

  copyLink() {
    const domain = document.location.hostname;
    const link = `https://${domain}/meet/${this.meet.link}`;

    navigator.clipboard.writeText(link);
    this._snackBar.open('Link copiado!', 'Fechar', {
      duration: 2000,
      verticalPosition: 'top',
    });
  }

  editMeet() {
    this.route.navigate(['edit', this.meet.id]);
  }

  deleteMeet() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Deletar reunião',
        message: 'Deseja deletar a reunião? Essa ação não pode ser desfeita.',
        cancelText: 'Cancelar',
        confirmText: 'Confirmar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.meetService.deleteMeet(this.meet.id).then(() => {
          this._snackBar.open('Reunião deletada!', 'Fechar', {
            duration: 2000,
            verticalPosition: 'top',
          });
        });
      }
    });
  }

  joinMeet() {
    this.route.navigate(['meet', this.meet.link]);
  }
}
