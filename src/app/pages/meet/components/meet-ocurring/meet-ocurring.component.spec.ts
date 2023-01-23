import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetOcurringComponent } from './meet-ocurring.component';

describe('MeetOcurringComponent', () => {
  let component: MeetOcurringComponent;
  let fixture: ComponentFixture<MeetOcurringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetOcurringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetOcurringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
