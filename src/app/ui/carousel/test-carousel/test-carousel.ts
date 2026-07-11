import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CarouselConfigData, CarouselOutputData } from '../carousel.interface';
import { Carousel } from '../carousel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-test-carousel',
  imports: [Carousel, ToastModule],
  templateUrl: './test-carousel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './test-carousel.scss',
})
export class TestCarousel {
  private readonly className = 'TestCarousel';

  private readonly images = [
    { id: 'requirement', path: 'images/requirement.png', alt: 'requirement analysis' },
    { id: 'system-design', path: 'images/system-design.png', alt: 'system design' },
    { id: 'front-end', path: 'images/front-end.png', alt: 'front-end development' },
    { id: 'ci', path: 'images/continuous-integration.png', alt: 'continuous integration' },
    { id: 'diag', path: 'images/vehicle-diagnostics.png', alt: 'vehicle diagnostics' },
  ];
  private readonly interval = 2000;

  protected readonly testCases: { id: string; title: string; config: CarouselConfigData }[] = [
    {
      id: 'crsl1',
      title: 'viewport: 300px, width: 300px',
      config: { images: this.images, interval: this.interval },
    },
    {
      id: 'crsl2',
      title: 'viewport: 500px, width: 300px, gap: 10px',
      config: { images: this.images, interval: this.interval },
    },
    {
      id: 'crsl3',
      title: 'viewport: 40vw, height: 200px',
      config: { images: this.images, interval: this.interval },
    },
    {
      id: 'crsl4',
      title: 'Show dots and overlay',
      config: { images: this.images, interval: this.interval, showDots: true, showOverlay: true },
    },
    {
      id: 'crsl5',
      title: 'Show title',
      config: {
        images: this.images.map((img) => ({ ...img, title: img.alt })),
        interval: this.interval,
      },
    },
  ];

  // クリックイベント制御
  private messageService = inject(MessageService);
  protected clickHandler(event: CarouselOutputData) {
    this.messageService.add({ severity: 'info', summary: 'info', detail: JSON.stringify(event) });
  }
}
