import { DOCUMENT, PLATFORM_ID, REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DomManager } from '../dom-manager/dom-manager';
import { AppManager } from './app-manager';
import { Logger } from '../../utility/logger/logger';
import { appLocales } from '../../model/locale';

describe('AppManager', () => {
  let service: AppManager;
  let domManagerMock: { setAttribute: ReturnType<typeof vi.fn> };
  let documentMock: { documentElement: any };

  beforeEach(() => {
    // タイマーを擬似化 (sleep関数の内部で使用されているsetTimeoutを制御)
    vi.useFakeTimers();

    vi.spyOn(Logger, 'debug').mockImplementation(() => {});
    vi.spyOn(Logger, 'info').mockImplementation(() => {});
    vi.spyOn(Logger, 'error').mockImplementation(() => {});

    domManagerMock = {
      setAttribute: vi.fn(),
    };

    documentMock = {
      documentElement: {},
    };

    TestBed.configureTestingModule({
      providers: [
        AppManager,
        { provide: DomManager, useValue: domManagerMock },
        { provide: DOCUMENT, useValue: documentMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
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
    it('ブラウザ環境：日本語設定の場合、正しく初期化されること', async () => {
      const langSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('ja-JP');
      service = TestBed.inject(AppManager);

      expect(service.isInit()).toBe(false);

      // initializeを開始
      const initTask = service.initialize();

      // sleep(2000) を進める。Promiseの解決を待つためにAsync版を使用。
      await vi.advanceTimersByTimeAsync(2000);
      await initTask;

      expect(service.isInit()).toBe(true);
      expect(domManagerMock.setAttribute).toHaveBeenCalledWith(
        documentMock.documentElement,
        'lang',
        appLocales['jaJP'].language,
      );

      langSpy.mockRestore();
    });

    it('ブラウザ環境：英語設定の場合、enGBがデフォルトになること', async () => {
      const langSpy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
      service = TestBed.inject(AppManager);

      const initTask = service.initialize();
      await vi.advanceTimersByTimeAsync(2000);
      await initTask;

      expect(domManagerMock.setAttribute).toHaveBeenCalledWith(
        documentMock.documentElement,
        'lang',
        appLocales['enGB'].language,
      );

      langSpy.mockRestore();
    });

    it('サーバー環境(SSR)：ヘッダーのaccept-languageに基づいてロケールが決定されること', async () => {
      // TestBedをサーバー環境として再構成
      TestBed.resetTestingModule();
      const requestMock = {
        headers: {
          get: vi.fn().mockReturnValue('ja-JP,ja;q=0.9'),
        },
      };

      TestBed.configureTestingModule({
        providers: [
          AppManager,
          { provide: DomManager, useValue: domManagerMock },
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'server' },
          { provide: REQUEST, useValue: requestMock },
        ],
      });

      service = TestBed.inject(AppManager);

      const initTask = service.initialize();
      await vi.advanceTimersByTimeAsync(2000);
      await initTask;

      expect(requestMock.headers.get).toHaveBeenCalledWith('accept-language');
      expect(domManagerMock.setAttribute).toHaveBeenCalledWith(
        documentMock.documentElement,
        'lang',
        appLocales['jaJP'].language,
      );
    });
  });

  describe('setLocale()', () => {
    beforeEach(() => {
      service = TestBed.inject(AppManager);
    });

    it('jaJPを指定したとき、lang="ja"が設定されること', () => {
      service.setLocale('jaJP');

      expect(domManagerMock.setAttribute).toHaveBeenCalledWith(
        documentMock.documentElement,
        'lang',
        'ja',
      );
    });

    it('enGBを指定したとき、lang="en"が設定されること', () => {
      service.setLocale('enGB');

      expect(domManagerMock.setAttribute).toHaveBeenCalledWith(
        documentMock.documentElement,
        'lang',
        'en',
      );
    });
  });
});
