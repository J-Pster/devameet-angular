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
    let found = false;

    if (!obj.selectMultiple) {
      for (let i = 0; i < this.objectsFromMeet.length; i++) {
        if (this.objectsFromMeet[i].type === obj.type) {
          this.objectsFromMeet[i] = obj;
          found = true;
          break;
        }
      }
    }

    if (!found) {
      this.objectsFromMeet.push(obj);
    }

    this.setSelected(obj);
  }

  removeObject(obj: any) {
    if (!obj || !obj._id) return;

    const filtered = this.objectsFromMeet.filter((o: any) => o._id !== obj._id);
    this.objectsFromMeet = filtered;
    this.setSelected({});
  }

  rotateObject(obj: any) {
    const { selected, to } = obj;

    if (selected?._id) {
      const orientationMap: any = {
        front: to === 'left' ? 'right' : 'left',
        right: to === 'left' ? 'back' : 'front',
        back: to === 'left' ? 'left' : 'right',
        left: to === 'left' ? 'front' : 'back',
      };

      selected.orientation =
        orientationMap[selected.orientation] || selected.orientation;

      this.setSelected(selected);
      this.changeObjectPosition(selected);
    }
  }

  moveObject(obj: any) {
    const { selected, to } = obj;

    if (!selected?._id || selected.flexStart) {
      return;
    }

    let x = selected.x;
    let y = selected.y;

    switch (to) {
      case 'up':
        y = y > 0 ? y - 1 : 0;
        break;
      case 'left':
        x = x > 0 ? x - 1 : 0;
        break;
      case 'down':
        y = y < 6 ? y + 1 : 6;
        break;
      case 'right':
        x = x < 6 ? x + 1 : 6;
        break;
      default:
        break;
    }

    selected.x = x;
    selected.y = y;
    this.changeObjectPosition(selected);
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

  async loadMeeting() {
    let meetingId = this.routeActive.snapshot.paramMap.get('id');
    if (!meetingId) {
      this.notLoaded();

      return;
    }

    try {
      const res = await this.meetService.getMeet(meetingId);
      if (!res) {
        this.notLoaded();
        return;
      }

      // Infos Básicas
      this.form.controls['name'].setValue(res.name);
      this.selectedColor = res.color;

      this.meet = res;

      // Objetos
      try {
        const meetObjects = await this.meetService.getMeetObjects(
          meetingId as string
        );
        this.objectsFromMeet = meetObjects.map((e: any) => {
          return { ...e, type: e.name.split('_')[0] };
        });
      } catch (error) {
        this.notLoaded();
      }
    } catch (error) {
      this.notLoaded();
    }
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
