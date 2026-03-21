import { Component } from '@angular/core';
import { CircleImageConfigData } from '../circle-image.interface';
import { CircleImage } from '../circle-image';

@Component({
  selector: 'app-test-circle-image',
  imports: [CircleImage],
  templateUrl: './test-circle-image.html',
  styleUrl: './test-circle-image.scss',
})
export class TestCircleImage {
  private readonly hamster = 'images/hamster_1x1.png';

  protected testCases: { title: string; config: CircleImageConfigData }[] = [
    {
      title: '原寸表示',
      config: {
        path: this.hamster,
      },
    },
    {
      title: '幅指定 (100px)',
      config: {
        path: this.hamster,
        width: '100px',
      },
    },
    {
      title: '高さ指定 (100px)',
      config: {
        path: this.hamster,
        height: '100px',
      },
    },
    {
      title: '幅と高さ指定 (100px, 200px)',
      config: {
        path: this.hamster,
        width: '100px',
        height: '200px',
      },
    },
    {
      title: 'alt指定',
      config: {
        path: this.hamster,
        width: '100px',
        alt: 'テスト画像',
      },
    },
  ];
}
