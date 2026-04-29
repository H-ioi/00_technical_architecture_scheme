import type { App, Directive } from "vue";

export type UniPermissionMode = "remove" | "hidden" | "disabled";
export type UniPermissionValue =
  | string
  | string[]
  | { code: string | string[]; mode?: UniPermissionMode };
export type UniPermissionChecker = (permission: string | string[]) => boolean;

export interface UniPermissionOptions {
  hasPermission?: UniPermissionChecker;
  defaultMode?: UniPermissionMode;
  onDenied?: (permission: string | string[]) => void;
}

const options: Required<UniPermissionOptions> = {
  hasPermission: () => true,
  defaultMode: "remove",
  onDenied: () => undefined,
};

export const setUniPermissionOptions = (nextOptions?: UniPermissionOptions) => {
  Object.assign(options, nextOptions ?? {});
};

export const hasUniPermission = (permission?: string | string[]) => {
  if (!permission || (Array.isArray(permission) && permission.length === 0)) {
    return true;
  }

  return options.hasPermission(permission);
};

const normalizePermissionValue = (value: UniPermissionValue) => {
  if (typeof value === "object" && !Array.isArray(value)) {
    return {
      code: value.code,
      mode: value.mode ?? options.defaultMode,
    };
  }

  return {
    code: value,
    mode: options.defaultMode,
  };
};

const applyDeniedMode = (el: HTMLElement, mode: UniPermissionMode) => {
  if (mode === "hidden") {
    el.style.display = "none";
    return;
  }

  if (mode === "disabled") {
    el.setAttribute("disabled", "true");
    el.classList.add("is-disabled");
    return;
  }

  el.parentNode?.removeChild(el);
};

export const uniPermissionDirective: Directive<
  HTMLElement,
  UniPermissionValue
> = {
  mounted(el, binding) {
    const { code, mode } = normalizePermissionValue(binding.value);

    if (!hasUniPermission(code)) {
      options.onDenied(code);
      applyDeniedMode(el, mode);
    }
  },
};

export const setupPermissionDirective = (
  app: App,
  nextOptions?: UniPermissionOptions,
) => {
  setUniPermissionOptions(nextOptions);
  app.directive("uni-permission", uniPermissionDirective);
};
