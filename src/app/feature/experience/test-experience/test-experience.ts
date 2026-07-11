import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Experience } from '../experience';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { DbCommonData, ExperienceData } from '../../../model/db-data';
import { map } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-test-experience',
  imports: [Experience, ButtonModule],
  templateUrl: './test-experience.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './test-experience.scss',
})
export class TestExperience {
  private readonly className = 'TestExperience';

  // 制御パラメータ
  protected inputUndefined = signal<boolean>(false);

  // 依存サービス
  private http = inject(HttpClient);

  // 表示データ
  private readonly jsonPath = '/data/articles-career.json';
  protected data = toSignal<ExperienceData | undefined>(
    this.http
      .get<DbCommonData[]>(this.jsonPath)
      .pipe(map((data) => data.filter((item) => item.type === 'experience')[0] as ExperienceData)),
    { initialValue: undefined },
  );

  protected buttonClickedHandler() {
    this.inputUndefined.update((value) => !value);
  }
}
