import { Component, input } from '@angular/core';
import { CircleImageConfigData } from './circle-image.interface';

@Component({
  selector: 'app-circle-image',
  imports: [],
  templateUrl: './circle-image.html',
  styleUrl: './circle-image.scss',
})
export class CircleImage {
  private readonly className = "CircleImage";

  // 入力パラメータ
  config = input.required<CircleImageConfigData>();
}
