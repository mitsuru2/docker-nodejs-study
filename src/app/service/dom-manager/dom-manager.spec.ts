import { TestBed } from '@angular/core/testing';
import { DomManager } from './dom-manager';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Logger } from '../../utility/logger/logger';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('DomManager', () => {
  let service: DomManager;
  let rendererMock: Renderer2;
  let rendererFactoryMock: RendererFactory2;

  const loggerMock = {
    debug: vi.fn(),
  };

  beforeEach(() => {
    // Renderer2 のモック作成
    rendererMock = {
      setAttribute: vi.fn(),
    } as unknown as Renderer2;

    // RendererFactory2 のモック作成
    rendererFactoryMock = {
      createRenderer: vi.fn().mockReturnValue(rendererMock),
    } as unknown as RendererFactory2;

    TestBed.configureTestingModule({
      providers: [
        DomManager,
        { provide: RendererFactory2, useValue: rendererFactoryMock },
        { provide: Logger, useValue: loggerMock },
      ],
    });

    service = TestBed.inject(DomManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(loggerMock.debug).toHaveBeenCalledWith('New DomManager()');
  });

  describe('setAttribute', () => {
    it('正しい引数が渡されたとき、renderer.setAttribute を呼び出すこと', () => {
      const element = document.createElement('div');
      service.setAttribute(element, 'id', 'test-id');
      expect(rendererMock.setAttribute).toHaveBeenCalledWith(element, 'id', 'test-id');
    });

    it('element が null のとき、renderer.setAttribute を呼び出さないこと', () => {
      service.setAttribute(null as any, 'id', 'test-id');
      expect(rendererMock.setAttribute).not.toHaveBeenCalled();
    });

    it('name が空文字のとき、renderer.setAttribute を呼び出さないこと', () => {
      const element = document.createElement('div');
      service.setAttribute(element, '', 'test-id');
      expect(rendererMock.setAttribute).not.toHaveBeenCalled();
    });
  });
});
