import { Component, input } from '@angular/core';
import { ExperienceData } from '../../model/db-data';
import { LocalizePipe } from '../../pipe/localize/localize-pipe';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-experience',
  imports: [LocalizePipe, SkeletonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  private readonly className = 'Experience';

  // 入力パラメータ
  experience = input.required<ExperienceData | undefined>();
}
