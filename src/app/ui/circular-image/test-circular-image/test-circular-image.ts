import { Component } from '@angular/core';
import { CircularImageConfigData } from '../circular-image.interface';
import { CircularImage } from '../circular-image';

@Component({
  selector: 'app-test-circular-image',
  imports: [CircularImage],
  templateUrl: './test-circular-image.html',
  styleUrl: './test-circular-image.scss',
})
export class TestCircularImage {
  private readonly hamster = 'images/hamster_1x1.png';

  protected testCases: { title: string; config: CircularImageConfigData }[] = [
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
      title: 'ID, alt指定',
      config: {
        id: 'circular-image-test',
        path: this.hamster,
        width: '100px',
        alt: 'テスト画像',
      },
    },
  ];
}
