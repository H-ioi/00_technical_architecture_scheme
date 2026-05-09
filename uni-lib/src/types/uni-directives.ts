export type UniCopyValue =
  | string
  | number
  | (() => string | number)
  | {
      text: string | number | (() => string | number);
      successMessage?: string;
      errorMessage?: string;
    };

export type UniDebounceClickValue =
  | ((event: MouseEvent) => void)
  | {
      handler: (event: MouseEvent) => void;
      wait?: number;
      immediate?: boolean;
    };
