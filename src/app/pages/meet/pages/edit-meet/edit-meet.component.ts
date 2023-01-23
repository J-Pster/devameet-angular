import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetService } from 'src/app/services/meet/meet.service';

import { objects } from 'src/assets/images/objects/objects';

@Component({
  selector: 'app-edit-meet',
  templateUrl: './edit-meet.component.html',
  styleUrls: ['./edit-meet.component.scss'],
})
export class EditMeetComponent implements OnInit {
  form: FormGroup;
  selectedColor: string = '#8250C4';

  objects: any = objects;
  objectsFromMeet: any = [];
  id: string = '';
  error: string = '';
  meet: any = {};
  index: number = 1;

  selected: any = {};

  constructor(
    private routeActive: ActivatedRoute,
    private route: Router,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private meetService: MeetService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  // Auxiliars

  changeObjectPosition(obj: any) {
    const index = this.objectsFromMeet.findIndex(
      (item: any) => item._id === obj._id
    );

    this.objectsFromMeet.splice(index, 1, obj);
  }

  setSelected(obj: any) {
    this.selected = Object.assign({}, obj);
  }

  // Canvas

  setObject(obj: any) {
    obj._id = this.index++;
    if (obj.selectMultiple) {
      this.objectsFromMeet.push(obj);
    } else {
      const filtered = this.objectsFromMeet.filter(
        (i: any) => i.type !== obj.type
      );
      filtered.push(obj);
      this.objectsFromMeet = filtered;
    }

    this.setSelected(obj);
  }

  removeObject(obj: any) {
    if (obj && obj._id) {
      const filtered = this.objectsFromMeet.filter(
        (o: any) => o._id !== obj._id
      );
      this.objectsFromMeet = filtered;
      this.setSelected({});
    }
  }

  rotateObject(obj: any) {
    const { selected, to } = obj;

    if (selected?._id) {
      if (to === 'left') {
        switch (selected.orientation) {
          case 'front':
            selected.orientation = 'left';
            break;
          case 'left':
            selected.orientation = 'back';
            break;
          case 'back':
            selected.orientation = 'right';
            break;
          case 'right':
            selected.orientation = 'front';
            break;
          default:
            break;
        }
      } else {
        switch (selected.orientation) {
          case 'front':
            selected.orientation = 'right';
            break;
          case 'right':
            selected.orientation = 'back';
            break;
          case 'back':
            selected.orientation = 'left';
            break;
          case 'left':
            selected.orientation = 'front';
            break;
          default:
            break;
        }
      }

      this.setSelected(selected);
      this.changeObjectPosition(selected);
    }
  }

  moveObject(obj: any) {
    const { selected, to } = obj;

    if (selected?._id && !selected.flexStart) {
      switch (to) {
        case 'up':
          selected.y = selected.y > 0 ? selected.y - 1 : 0;
          break;
        case 'left':
          selected.x = selected.x > 0 ? selected.x - 1 : 0;
          break;
        case 'down':
          selected.y = selected.y < 6 ? selected.y + 1 : 6;
          break;
        case 'right':
          selected.x = selected.x < 6 ? selected.x + 1 : 6;
          break;
        default:
          break;
      }

      this.changeObjectPosition(selected);
    }
  }

  // Others

  ngOnInit(): void {
    this.loadMeeting();
  }

  notLoaded(): void {
    this._snackBar.open('Não foi possível carregar a reunião!', 'OK', {
      duration: 2000,
      verticalPosition: 'top',
    });

    setTimeout(() => {
      this.route.navigateByUrl('/');
    }, 2000);
  }

  loadMeeting() {
    let meetingId = this.routeActive.snapshot.paramMap.get('id');
    if (!meetingId) {
      this.notLoaded();

      return;
    }

    this.meetService
      .getMeet(meetingId)
      .then((res) => {
        if (!res) {
          this.notLoaded();
          return;
        }

        // Infos Básicas
        this.form.controls['name'].setValue(res.name);
        this.selectedColor = res.color;

        this.meet = res;

        // Objetos
        this.meetService
          .getMeetObjects(meetingId as string)
          .then((res) => {
            this.objectsFromMeet = res.map((e: any) => {
              return { ...e, type: e.name.split('_')[0] };
            });
          })
          .catch(() => {
            this.notLoaded();
          });
      })
      .catch(() => {
        this.notLoaded();
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
    const body = {
      name: formValues.name,
      color: this.selectedColor,
      objects: this.objectsFromMeet,
    };

    console.log('body', body);

    this.meetService
      .updateMeet(this.meet._id, body)
      .then((res) => {
        this._snackBar.open('Reunião atualizada com sucesso!', 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });

        setTimeout(() => {
          this.route.navigateByUrl('/');
        }, 2000);
      })
      .catch((err) => {
        const errorMsg = err.error.message || 'Erro ao atualizar reunião!';
        this._snackBar.open(errorMsg, 'OK', {
          duration: 2000,
          verticalPosition: 'top',
        });
      });
  }
}
