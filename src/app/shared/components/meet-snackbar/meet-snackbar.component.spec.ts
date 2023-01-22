import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetSnackbarComponent } from './meet-snackbar.component';

describe('MeetSnackbarComponent', () => {
  let component: MeetSnackbarComponent;
  let fixture: ComponentFixture<MeetSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
