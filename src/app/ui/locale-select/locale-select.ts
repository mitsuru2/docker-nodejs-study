import { Component, computed, input, model } from '@angular/core';
import { LocaleSelectConfigData } from './locale-select.interface';
import { appLocaleList, LocaleData } from '../../model/locale';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CountryFlag } from '../country-flag/country-flag';

@Component({
  selector: 'app-locale-select',
  imports: [SelectModule, FormsModule, CountryFlag],
  templateUrl: './locale-select.html',
  styleUrl: './locale-select.scss',
})
export class LocaleSelect {
  private readonly className = 'LocaleSelect';

  // 入力パラメータ
  config = input.required<LocaleSelectConfigData>();
  value = model.required<LocaleData>();

  // 制御パラメータ
  protected type = computed(() => this.config().type);
  protected options = appLocaleList;
}
