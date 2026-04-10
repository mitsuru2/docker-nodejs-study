import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DatabaseManager } from './database-manager';
import { Logger } from '../../utility/logger/logger';
import { environment } from '../../../environments/environment';
import { ArticleData } from '../../model/db-data';
import { vi } from 'vitest';

describe('DatabaseManager', () => {
  let service: DatabaseManager;
  let httpMock: HttpTestingController;

  const loggerMock = {
    debug: vi.fn(),
    info: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseManager,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Logger, useValue: loggerMock },
      ],
    });
    service = TestBed.inject(DatabaseManager);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(loggerMock.debug).toHaveBeenCalledWith('New DatabaseManager()');
  });

  it('should fetch article data via GET request', () => {
    const mockArticle: Partial<ArticleData> = {
      id: '4c5f49ee-28c2-4a32-8b53-388ee7400478',
      pk: 'front-end',
      isPublished: true,
    };
    const container = 'articles';
    const partitionKey = 'front-end';

    service.getData(container, partitionKey).subscribe((data) => {
      expect(data).toEqual(mockArticle);
    });

    expect(loggerMock.info).toHaveBeenCalledWith(
      `DatabaseManager.getData() url=${environment.apiUrl}/db/${container}/${partitionKey}`,
    );

    const req = httpMock.expectOne(`${environment.apiUrl}/db/${container}/${partitionKey}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticle);
  });
});
