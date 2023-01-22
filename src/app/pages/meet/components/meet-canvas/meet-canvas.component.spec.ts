import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetCanvasComponent } from './meet-canvas.component';

describe('MeetCanvasComponent', () => {
  let component: MeetCanvasComponent;
  let fixture: ComponentFixture<MeetCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeetCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
