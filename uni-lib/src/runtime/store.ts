import type { UniLibRuntimeOptions } from "@/types/uni-runtime";

let runtime: UniLibRuntimeOptions | null = null;

export const setUniRuntimeConfig = (next: UniLibRuntimeOptions) => {
  runtime = next;
};

export const getUniRuntimeConfig = (): UniLibRuntimeOptions => {
  if (!runtime) {
    throw new Error(
      "[uni-ui-lib] Runtime config is not set. Pass options.runtime to app.use(UniLib, …).",
    );
  }

  return runtime;
};

export const tryGetUniRuntimeConfig = (): UniLibRuntimeOptions | null => runtime;
