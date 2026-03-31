import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppManager } from './app-manager';
import { Logger } from '../../utility/logger/logger';
import { appLocales } from '../../model/locale';
import { WINDOW } from '../../model/custom-tokens';
import { Location } from '@angular/common';

describe('AppManager', () => {
  let service: AppManager;
  const mockWindow = {
    location: {
      href: '',
    },
  };
  const mockLocation = {
    path: () => '/en-GB/dashboard',
  };
  const mockLogger = {
    info: () => {},
    debug: () => {},
    error: () => {},
    warn: () => {},
    trace: () => {},
  };

  beforeEach(() => {
    // タイマーを擬似化 (sleep関数の内部で使用されているsetTimeoutを制御)
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        AppManager,
        { provide: LOCALE_ID, useValue: 'en-GB' },
        { provide: WINDOW, useValue: mockWindow },
        { provide: Location, useValue: mockLocation },
        { provide: Logger, useValue: mockLogger },
      ],
    });
    service = TestBed.inject(AppManager);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    service = TestBed.inject(AppManager);
    expect(service).toBeTruthy();
  });

  describe('initialize()', () => {
    it('ダミー処理 (2秒) 確認', async () => {
      // 開始前の初期化フラグがfalse。
      expect(service.isInit()).toBe(false);

      // initializeを開始
      const initTask = service.initialize();

      // sleep(2000) を進める。Promiseの解決を待つためにAsync版を使用。
      await vi.advanceTimersByTimeAsync(2000);
      await initTask;

      // 終了後の初期化フラグがtrue。
      expect(service.isInit()).toBe(true);
    });
  });

  describe('switchLocale()', () => {
    it('jaJPを指定したとき、lang="ja"が設定されること', () => {
      service.switchLocale('jaJP');
      expect(mockWindow.location.href).toContain(appLocales.jaJP.locale);
    });

    it("現在のパスが'/'などの場合にロケールが付与されること", () => {
      vi.spyOn(mockLocation, 'path').mockReturnValue('/');
      service.switchLocale('jaJP');
      expect(mockWindow.location.href).toBe(`/${appLocales.jaJP.locale}/`);
    });

    it('enGBを指定したとき、Do nothingがログに出力されること', () => {
      const spy = vi.spyOn(mockLogger, 'info');
      service.switchLocale('enGB');
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Do nothing.'));
    });
  });
});
