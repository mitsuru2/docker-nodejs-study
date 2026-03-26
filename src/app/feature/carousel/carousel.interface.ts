export interface CarouselImageData {
  id: string; // 画像のID。クリックイベントで使用。
  path: string; // 画像パス。外部から取得した画像の場合もURL.createObjectURL()によるパスで扱う。
}

export interface CarouselConfigData {
  images: CarouselImageData[];
}

export interface CarouselOutputData {
  id: string;
}
