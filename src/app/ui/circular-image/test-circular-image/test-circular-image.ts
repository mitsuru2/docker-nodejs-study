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
  private readonly hamster = 'images/hamster_1x1.webp';

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
        id: 'ci2',
        path: this.hamster,
      },
    },
    {
      title: '高さ指定 (100px)',
      config: {
        id: 'ci3',
        path: this.hamster,
      },
    },
    {
      title: '幅と高さ指定 (100px, 200px)',
      config: {
        id: 'ci4',
        path: this.hamster,
      },
    },
    {
      title: 'ID, alt指定',
      config: {
        id: 'ci5',
        path: this.hamster,
        alt: 'テスト画像',
      },
    },
    {
      title: '拡大表示',
      config: {
        id: 'ci6',
        path: this.hamster,
      },
    },
  ];
}
