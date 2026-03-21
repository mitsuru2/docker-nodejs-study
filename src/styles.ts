export enum Styles {
  BrightBlue = '--bright-blue',
  BrightPurple = '--bright-purple',
}

export function getStyleVar(name: Styles): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
