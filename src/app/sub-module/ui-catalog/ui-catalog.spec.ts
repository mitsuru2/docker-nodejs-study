import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCatalog } from './ui-catalog';

describe('UiCatalog', () => {
  let component: UiCatalog;
  let fixture: ComponentFixture<UiCatalog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCatalog],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCatalog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
