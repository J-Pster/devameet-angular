import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetsComponent } from './meets.component';

describe('MeetComponent', () => {
  let component: MeetsComponent;
  let fixture: ComponentFixture<MeetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeetsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
