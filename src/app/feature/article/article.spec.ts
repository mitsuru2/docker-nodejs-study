import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { Article } from './article';

describe('Article thumbnail layout', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Article],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: { observe: vi.fn().mockReturnValue(of({ matches: false })) },
        },
        { provide: LOCALE_ID, useValue: 'ja' },
      ],
    }).compileComponents();
  });

  const createFixture = () => {
    const fixture = TestBed.createComponent(Article);
    fixture.componentRef.setInput('article', {
      id: 'article-test',
      pk: 'article-test',
      type: 'article',
      isPublished: true,
      paragraphs: [
        {
          images: [
            { path: '/first.png', alt: { ja: 'first' } },
            { path: '/second.png', alt: { ja: 'second' } },
          ],
        },
      ],
    });
    fixture.detectChanges();
    return fixture;
  };

  it('画像が収まらない場合は次の行に折り返す', () => {
    const fixture = createFixture();
    const track = fixture.nativeElement.querySelector('.images-track') as HTMLElement;

    expect(getComputedStyle(track).flexWrap).toBe('wrap');
  });

  it('サムネイル間隔にMマージンを使用する', () => {
    const fixture = createFixture();
    const trackRule = Array.from(document.styleSheets)
      .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
      .find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule && rule.selectorText.includes('.images-track'),
      );

    expect(trackRule?.style.getPropertyValue('gap')).toBe('var(--p-custom-margin-m)');
    fixture.destroy();
  });

  it('サムネイルを現在より20%大きくする', () => {
    const fixture = createFixture();
    const thumbnails = fixture.nativeElement.querySelectorAll(
      '.thumb-image',
    ) as NodeListOf<HTMLImageElement>;
    const thumbnailRule = Array.from(document.styleSheets)
      .flatMap((styleSheet) => Array.from(styleSheet.cssRules))
      .find(
        (rule): rule is CSSStyleRule =>
          rule instanceof CSSStyleRule &&
          rule.selectorText.includes('.images-track') &&
          rule.selectorText.includes('.thumb-image'),
      );

    expect(thumbnailRule?.style.getPropertyValue('height')).toBe('');
    expect(thumbnails[0].getAttribute('height')).toBe('216');
    expect(thumbnails[1].getAttribute('height')).toBe('216');
  });
});
