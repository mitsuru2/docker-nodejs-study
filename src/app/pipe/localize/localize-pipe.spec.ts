import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { LocalizePipe } from './localize-pipe';
import { appLocales } from '../../model/locale';
import { MessageData } from '../../model/db-data';

describe('LocalizePipe', () => {
  let pipe: LocalizePipe;

  const setup = (locale: string) => {
    TestBed.configureTestingModule({
      providers: [LocalizePipe, { provide: LOCALE_ID, useValue: locale }],
    });
    pipe = TestBed.inject(LocalizePipe);
  };

  const mockData: MessageData = {
    ja: '日本語テキスト',
    en: 'English Text',
  };

  it('should be created', () => {
    setup(appLocales.jaJP.locale);
    expect(pipe).toBeTruthy();
  });

  it('入力が空の場合は空文字を返すこと', () => {
    setup(appLocales.jaJP.locale);
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('ロケールが日本語の場合、日本語の値を返すこと', () => {
    setup(appLocales.jaJP.locale);
    expect(pipe.transform(mockData)).toBe('日本語テキスト');
  });

  it('ロケールが日本語以外で英語の定義がある場合、英語を返すこと', () => {
    setup(appLocales.enGB.locale);
    expect(pipe.transform(mockData)).toBe('English Text');
  });

  it('ロケールが日本語以外でも英語の定義がない場合、日本語を返すこと', () => {
    setup(appLocales.enGB.locale);
    const jaOnlyData: MessageData = { ja: '日本語のみ' };
    expect(pipe.transform(jaOnlyData)).toBe('日本語のみ');
  });

  it('英語で空文字定義の場合、空文字を返すこと', () => {
    setup(appLocales.enGB.locale);
    const enBlankText: MessageData = { ja: '日本語テキスト', en: '' };
    expect(pipe.transform(enBlankText)).toBe('');
  });
});
