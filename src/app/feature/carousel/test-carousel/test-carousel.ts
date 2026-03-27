import { Component } from '@angular/core';
import { CarouselConfigData } from '../carousel.interface';
import { Carousel } from '../carousel';

@Component({
  selector: 'app-test-carousel',
  imports: [Carousel],
  templateUrl: './test-carousel.html',
  styleUrl: './test-carousel.scss',
})
export class TestCarousel {
  private readonly className = 'TestCarousel';

  protected readonly testCases: { title: string; config: CarouselConfigData }[] = [
    {
      title: '基本形',
      config: {
        images: [
          { id: 'requirement', path: 'images/requirement.png', alt: 'requirement analysis' },
          { id: 'system-design', path: 'images/system-design.png', alt: 'system design' },
          { id: 'front-end', path: 'images/front-end.png', alt: 'front-end development' },
          { id: 'ci', path: 'images/continuous-integration.png', alt: 'continuous integration' },
          { id: 'diag', path: 'images/vehicle-diagnostics.png', alt: 'vehicle diagnostics' },
        ],
        interval: 2000,
      },
    },
  ];
}
