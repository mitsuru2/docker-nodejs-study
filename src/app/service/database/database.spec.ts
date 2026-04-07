import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Database } from './database';
import { Logger } from '../../utility/logger/logger';
import { environment } from '../../../environments/environment';
import { ArticleData } from '../../model/db-data';
import { vi } from 'vitest';

describe('Database', () => {
  let service: Database;
  let httpMock: HttpTestingController;

  const loggerMock = {
    debug: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Database,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Logger, useValue: loggerMock },
      ],
    });
    service = TestBed.inject(Database);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(loggerMock.debug).toHaveBeenCalledWith('New Database()');
  });

  it('should fetch article data via GET request', () => {
    const mockArticle: Partial<ArticleData> = {
      id: '4c5f49ee-28c2-4a32-8b53-388ee7400478',
      category: 'front-end',
      isPublished: true,
    };
    const container = 'articles';
    const partitionKey = 'front-end';

    service.readData(container, partitionKey).subscribe((data) => {
      expect(data).toEqual(mockArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/db/${container}/${partitionKey}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockArticle);
  });
});
