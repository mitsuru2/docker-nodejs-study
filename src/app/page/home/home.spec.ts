import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { Logger } from '../../utility/logger/logger';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: Logger, useValue: mockLogger }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
