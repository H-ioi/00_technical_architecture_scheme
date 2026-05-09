import { watch, type MaybeRefOrGetter, toValue } from "vue";
import { useRoute } from "vue-router";

import { useUniTagsViewStore } from "@/stores";

const getRouteParamText = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

export interface UseTagsViewFromRouteOptions {
  /** 为 false 时不根据路由写入标签 store（例如布局 `autoWire: false` 且手动传 `tags`） */
  enabled?: MaybeRefOrGetter<boolean>;
}

/**
 * 在可访问 `vue-router` 的上下文中同步「当前路由 → visitedTags」。
 * 适用于标签栏组件：与全局 `router.afterEach` 等价，逻辑集中在一处。
 *
 * 详情页标签文案：在路由 `meta.tagDetailParam` 上声明动态段参数名（如 `id`），
 * 否则会使用 `title` / `titleKey`。
 */
export function useTagsViewFromRoute(
  options: UseTagsViewFromRouteOptions = {},
) {
  const route = useRoute();
  const tagsViewStore = useUniTagsViewStore();

  const isEnabled = () =>
    options.enabled === undefined ? true : toValue(options.enabled);

  const syncFromRoute = () => {
    if (!isEnabled()) {
      return;
    }

    const leaf = route.matched[route.matched.length - 1];

    if (!leaf?.name) {
      return;
    }

    const shouldAddTag =
      !leaf.meta.hidden || Boolean(leaf.meta.activeMenu);

    if (!shouldAddTag) {
      return;
    }

    const meta = leaf.meta as {
      title?: string;
      titleKey?: string;
      affix?: boolean;
      tagDetailParam?: string;
    };

    const paramKey = meta.tagDetailParam;
    const detailId = paramKey
      ? getRouteParamText(
          route.params[paramKey] as string | string[] | undefined,
        )
      : "";
    const titleKey = detailId
      ? undefined
      : (meta.titleKey as string | undefined);
    const title = detailId
      ? `${String(meta.title || String(leaf.name))}_${detailId}`
      : String(meta.title || String(leaf.name));

    tagsViewStore.addTag({
      path: route.fullPath,
      title,
      titleKey,
      affix: Boolean(meta.affix),
    });
  };

  watch(
    [() => route.fullPath, () => isEnabled()],
    () => {
      syncFromRoute();
    },
    { flush: "post", immediate: true },
  );
}
