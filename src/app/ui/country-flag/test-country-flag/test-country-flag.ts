import { Component } from '@angular/core';
import { CountryFlag } from '../country-flag';
import { LocaleId } from '../../../model/locale';

@Component({
  selector: 'app-test-country-flag',
  imports: [CountryFlag],
  templateUrl: './test-country-flag.html',
  styleUrl: './test-country-flag.scss',
})
export class TestCountryFlag {
  private readonly className = 'TestCountryFlag';

  protected readonly testCases: { id: string; title: string; config: LocaleId }[] = [
    { id: 't1', title: 'width: 100px', config: 'enGB' },
    { id: 't2', title: 'height: 4rem', config: 'jaJP' },
  ];
}
