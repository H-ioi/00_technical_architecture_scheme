import type { App, Directive } from "vue";
import { ElMessage } from "element-plus";

import type { UniCopyValue } from "@/types/uni-directives";
import { uniLibTranslate } from "@/locales/create-i18n";
import { copyText } from "@/utils/copy";

export type { UniCopyValue } from "@/types/uni-directives";

const resolveCopyValue = (value: UniCopyValue) => {
  if (typeof value === "object" && value !== null) {
    const text = typeof value.text === "function" ? value.text() : value.text;

    return {
      text: String(text),
      successMessage: value.successMessage,
      errorMessage: value.errorMessage,
    };
  }

  const text = typeof value === "function" ? value() : value;

  return {
    text: String(text),
  };
};

const listeners = new WeakMap<HTMLElement, EventListener>();

export const uniCopyDirective: Directive<HTMLElement, UniCopyValue> = {
  mounted(el, binding) {
    const listener = async () => {
      const { text, successMessage, errorMessage } = resolveCopyValue(
        binding.value,
      );

      try {
        await copyText(text);
        ElMessage.success(successMessage ?? uniLibTranslate("common.copySuccess"));
      } catch {
        ElMessage.error(errorMessage ?? uniLibTranslate("common.copyFailed"));
      }
    };

    listeners.set(el, listener);
    el.addEventListener("click", listener);
  },
  beforeUnmount(el) {
    const listener = listeners.get(el);

    if (listener) {
      el.removeEventListener("click", listener);
      listeners.delete(el);
    }
  },
};

export const setupCopyDirective = (app: App) => {
  app.directive("uni-copy", uniCopyDirective);
};
