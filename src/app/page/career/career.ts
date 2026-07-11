import { HttpClient } from '@angular/common/http';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AwardData, DbCommonData, ExperienceData, QualificationData } from '../../model/db-data';
import { i18nLabels } from '../../../locale/_i18n_';
import { Experience } from '../../feature/experience/experience';
import { LocalizePipe } from '../../pipe/localize/localize-pipe';
import { AppShell } from '../../feature/app-shell/app-shell';

@Component({
  selector: 'app-career',
  imports: [Experience, LocalizePipe, AppShell],
  templateUrl: './career.html',
  styleUrl: './career.scss',
})
export class Career {
  private readonly className = 'Career';

  // 依存サービス
  private http = inject(HttpClient);

  // 表示テキスト
  protected labels = i18nLabels;

  // 表示データ
  protected titleImage = 'images/career_4x1.webp';
  private readonly jsonPath = 'data/articles-career.json';
  private data = toSignal(this.http.get<DbCommonData[]>(this.jsonPath), { initialValue: [] });
  protected experiences = computed(
    () =>
      this.data()
        .filter((item): item is ExperienceData => item.type === 'experience')
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')), // Undefinedの場合は後ろになる。
  );
  protected qualifications = computed(
    () =>
      this.data()
        .filter((item): item is QualificationData => item.type === 'qualification')
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')), // Undefinedの場合は後ろになる。
  );
  protected awards = computed(
    () =>
      this.data()
        .filter((item): item is AwardData => item.type === 'award')
        .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')), // Undefinedの場合は後ろになる。
  );
}
