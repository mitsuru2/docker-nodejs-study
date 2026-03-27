export interface CarouselImageData {
  id: string; // 画像のID。クリックイベントで使用。
  path: string; // 画像パス。外部から取得した画像の場合もURL.createObjectURL()によるパスで扱う。
  alt: string; // 画像のalt属性。不要な場合は空文字列を設定。
}

export interface CarouselConfigData {
  images: CarouselImageData[];
  interval: number; // 画像送りインターバル (ms)
}

export interface CarouselOutputData {
  id: string;
}
