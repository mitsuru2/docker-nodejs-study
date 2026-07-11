import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { appLocales, LocaleId } from '../../model/locale';

@Component({
  selector: 'app-country-flag',
  imports: [],
  templateUrl: './country-flag.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './country-flag.scss',
})
export class CountryFlag {
  private readonly className = 'CountryFlag';

  // 入力パラメータ
  locale = input.required<LocaleId>();

  // 制御パラメータ
  protected path = computed(() => `images/flags/4x3/${appLocales[this.locale()].country}.svg`);
  protected alt = computed(
    () => `${appLocales[this.locale()].country.toUpperCase()} country flag.`,
  );
}
