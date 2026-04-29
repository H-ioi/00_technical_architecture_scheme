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
  if (!nextOptions) {
    return;
  }

  if (nextOptions.hasPermission) {
    options.hasPermission = nextOptions.hasPermission;
  }

  if (nextOptions.defaultMode) {
    options.defaultMode = nextOptions.defaultMode;
  }

  if (nextOptions.onDenied) {
    options.onDenied = nextOptions.onDenied;
  }
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

const isEmptyPermission = (code: unknown) =>
  !code || (Array.isArray(code) && code.length === 0);

const originalElementState = new WeakMap<
  HTMLElement,
  { display: string; disabled: boolean; placeholder?: Comment }
>();

const ensureOriginalState = (el: HTMLElement) => {
  if (!originalElementState.has(el)) {
    originalElementState.set(el, {
      display: el.style.display,
      disabled: el.hasAttribute("disabled"),
    });
  }
};

const applyDeniedMode = (el: HTMLElement, mode: UniPermissionMode) => {
  ensureOriginalState(el);

  if (mode === "hidden") {
    el.style.display = "none";
    return;
  }

  if (mode === "disabled") {
    el.setAttribute("disabled", "true");
    el.classList.add("is-disabled");
    return;
  }

  const originalState = originalElementState.get(el);
  const parent = el.parentNode;

  if (!parent || originalState?.placeholder) {
    return;
  }

  const placeholder = document.createComment("v-uni-permission");
  parent.insertBefore(placeholder, el);
  parent.removeChild(el);
  originalElementState.set(el, {
    display: originalState?.display ?? el.style.display,
    disabled: originalState?.disabled ?? el.hasAttribute("disabled"),
    placeholder,
  });
};

const applyAllowedMode = (el: HTMLElement) => {
  const originalState = originalElementState.get(el);

  if (!originalState) {
    return;
  }

  if (originalState.placeholder?.parentNode) {
    originalState.placeholder.parentNode.insertBefore(
      el,
      originalState.placeholder,
    );
    originalState.placeholder.parentNode.removeChild(originalState.placeholder);
    originalState.placeholder = undefined;
  }

  el.style.display = originalState.display;
  el.classList.remove("is-disabled");

  if (!originalState.disabled) {
    el.removeAttribute("disabled");
  }
};

const updatePermissionState = (el: HTMLElement, value: UniPermissionValue) => {
  const { code, mode } = normalizePermissionValue(value);

  if (isEmptyPermission(code)) {
    applyAllowedMode(el);
    return;
  }

  if (!hasUniPermission(code)) {
    options.onDenied(code);
    applyDeniedMode(el, mode);
    return;
  }

  applyAllowedMode(el);
};

export const uniPermissionDirective: Directive<
  HTMLElement,
  UniPermissionValue
> = {
  mounted(el, binding) {
    updatePermissionState(el, binding.value);
  },
  updated(el, binding) {
    updatePermissionState(el, binding.value);
  },
};

export const setupPermissionDirective = (
  app: App,
  nextOptions?: UniPermissionOptions,
) => {
  setUniPermissionOptions(nextOptions);
  app.directive("uni-permission", uniPermissionDirective);
};
