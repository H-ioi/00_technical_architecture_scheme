import type { App, Directive } from "vue";

export type UniDebounceClickValue =
  | ((event: MouseEvent) => void)
  | {
      handler: (event: MouseEvent) => void;
      wait?: number;
      immediate?: boolean;
    };

type DebounceState = {
  listener: EventListener;
  timer?: ReturnType<typeof setTimeout>;
};

const states = new WeakMap<HTMLElement, DebounceState>();

const normalizeValue = (value: UniDebounceClickValue) =>
  typeof value === "function"
    ? { handler: value, wait: 300, immediate: true }
    : { wait: 300, immediate: true, ...value };

const bindDebounceClick = (el: HTMLElement, value: UniDebounceClickValue) => {
  const previousState = states.get(el);

  if (previousState) {
    el.removeEventListener("click", previousState.listener);
    clearTimeout(previousState.timer);
  }

  const options = normalizeValue(value);
  let locked = false;

  const listener = (event: Event) => {
    if (locked) {
      return;
    }

    locked = true;

    if (options.immediate) {
      options.handler(event as MouseEvent);
    }

    const timer = setTimeout(() => {
      if (!options.immediate) {
        options.handler(event as MouseEvent);
      }

      locked = false;
    }, options.wait);

    states.set(el, { listener, timer });
  };

  states.set(el, { listener });
  el.addEventListener("click", listener);
};

export const uniDebounceClickDirective: Directive<
  HTMLElement,
  UniDebounceClickValue
> = {
  mounted(el, binding) {
    bindDebounceClick(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      bindDebounceClick(el, binding.value);
    }
  },
  beforeUnmount(el) {
    const state = states.get(el);

    if (state) {
      el.removeEventListener("click", state.listener);
      clearTimeout(state.timer);
      states.delete(el);
    }
  },
};

export const setupDebounceClickDirective = (app: App) => {
  app.directive("uni-debounce-click", uniDebounceClickDirective);
};
