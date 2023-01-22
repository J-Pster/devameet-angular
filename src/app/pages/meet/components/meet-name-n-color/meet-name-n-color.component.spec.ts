import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetNameNColorComponent } from './meet-name-n-color.component';

describe('MeetNameNColorComponent', () => {
  let component: MeetNameNColorComponent;
  let fixture: ComponentFixture<MeetNameNColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetNameNColorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetNameNColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
