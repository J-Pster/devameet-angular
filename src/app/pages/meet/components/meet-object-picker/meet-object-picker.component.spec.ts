import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetObjectPickerComponent } from './meet-object-picker.component';

describe('MeetObjectPickerComponent', () => {
  let component: MeetObjectPickerComponent;
  let fixture: ComponentFixture<MeetObjectPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetObjectPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetObjectPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
