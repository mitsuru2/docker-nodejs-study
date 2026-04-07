import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Logger } from './utility/logger/logger';

describe('App', () => {
  const mockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: Logger, useValue: mockLogger }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
