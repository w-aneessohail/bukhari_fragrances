export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
  AMBER = "amber"
}

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};
