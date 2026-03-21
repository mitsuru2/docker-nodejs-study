import { GradientStopData } from '../../model/gradient-stop';

export interface CircularProgressBarConfigData {
  id: string;
  path?: string; // 画像パス
  size: number; // コンポーネント表示サイズ。正方形。ピクセル指定。
  strokeWidth: number; // ストローク幅。ピクセル指定。
  strokeColor?: string; // 単色。
  gradientStops?: GradientStopData[]; // グラデーション
}
