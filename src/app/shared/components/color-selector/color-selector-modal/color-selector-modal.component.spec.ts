import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectorModalComponent } from './color-selector-modal.component';

describe('ColorSelectorModalComponent', () => {
  let component: ColorSelectorModalComponent;
  let fixture: ComponentFixture<ColorSelectorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorSelectorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
