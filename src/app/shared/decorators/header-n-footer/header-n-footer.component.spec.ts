import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNFooterComponent } from './header-n-footer.component';

describe('HeaderNFooterComponent', () => {
  let component: HeaderNFooterComponent;
  let fixture: ComponentFixture<HeaderNFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderNFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderNFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
