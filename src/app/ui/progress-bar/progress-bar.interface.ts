import { GradientStopData } from '../../model/gradient-stop';

export interface ProgressBarConfigData {
  id: string;
  strokeWidth: number; // ストローク幅。ピクセル指定。
  strokeColor?: string; // 単色。
  gradientStops?: GradientStopData[]; // グラデーション
  fontSize?: string; // 進捗テキストサイズ
}
