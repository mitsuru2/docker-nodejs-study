import { TestBed } from '@angular/core/testing';
import { Logger } from './logger';

describe('Logger', () => {
  let service: Logger;

  beforeAll(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Logger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log error message', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    service.error('Test error message');

    const logMessage = consoleSpy.mock.calls[0][0];
    expect(logMessage).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \| \w{8}-\w{4}-\w{4}-\w{4}-\w{12} \| \/ \| ERROR \| Test error message/,
    );
    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it('should log warning message', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    service.warn('Test warning message');

    const logMessage = consoleSpy.mock.calls[0][0];
    expect(logMessage).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \| \w{8}-\w{4}-\w{4}-\w{4}-\w{12} \| \/ \| WARN \| Test warning message/,
    );
    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it('should log info message', () => {
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    service.info('Test info message');

    const logMessage = consoleSpy.mock.calls[0][0];
    expect(logMessage).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \| \w{8}-\w{4}-\w{4}-\w{4}-\w{12} \| \/ \| INFO \| Test info message/,
    );
    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it('should log debug message', () => {
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    service.debug('Test info message');

    const logMessage = consoleSpy.mock.calls[0][0];
    expect(logMessage).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \| \w{8}-\w{4}-\w{4}-\w{4}-\w{12} \| \/ \| DEBUG \| Test info message/,
    );
    expect(consoleSpy).toHaveBeenCalledOnce();
  });

  it('should log trace message', () => {
    const consoleSpy = vi.spyOn(console, 'trace').mockImplementation(() => {});

    service.trace('Test info message');

    const logMessage = consoleSpy.mock.calls[0][0];
    expect(logMessage).toMatch(
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \| \w{8}-\w{4}-\w{4}-\w{4}-\w{12} \| \/ \| TRACE \| Test info message/,
    );
    expect(consoleSpy).toHaveBeenCalledOnce();
  });
});
