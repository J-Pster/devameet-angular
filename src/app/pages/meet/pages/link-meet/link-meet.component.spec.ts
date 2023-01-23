import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkMeetComponent } from './link-meet.component';

describe('LinkMeetComponent', () => {
  let component: LinkMeetComponent;
  let fixture: ComponentFixture<LinkMeetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkMeetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkMeetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
