import type { RouteLocationNormalizedLoaded, Router } from "vue-router";
import { computed } from "vue";

import { useUniTagsViewStore } from "@/stores/uni-tags-view";
import type { UniLayoutTag } from "@/types/uni-layout";

export interface UseUniTagsViewControllerOptions {
  /** 关闭全部或最后一个标签后跳转路径 */
  fallbackPath?: string;
}

/**
 * 布局侧标签交互：关闭后跳转相邻标签、`RouterView` 的 refreshKey 等。
 * 需在 Pinia 已注册、`router`/`route` 可用的 `setup` 中调用。
 */
export function useUniTagsViewController(
  router: Router,
  route: RouteLocationNormalizedLoaded,
  options: UseUniTagsViewControllerOptions = {},
) {
  const fallbackPath = options.fallbackPath ?? "/dashboard";
  const tagsViewStore = useUniTagsViewStore();

  const viewKey = computed(
    () => `${route.fullPath}-${tagsViewStore.refreshKey}`,
  );

  const findNextTag = (path: string) => {
    const tags = tagsViewStore.visitedTags;
    const index = tags.findIndex((tag) => tag.path === path);
    const left = index > 0 ? tags[index - 1] : undefined;
    const right = index < tags.length - 1 ? tags[index + 1] : undefined;

    return (
      left ||
      right ||
      tagsViewStore.visitedTags[tagsViewStore.visitedTags.length - 1]
    );
  };

  const closeTag = (path: string) => {
    const isActive = route.fullPath === path;
    const nextTag = findNextTag(path);

    tagsViewStore.removeTag(path);

    if (!isActive) {
      return;
    }

    void router.push((nextTag || { path: fallbackPath }).path);
  };

  const refreshTag = (tag?: UniLayoutTag) => {
    if (tag && tag.path !== route.fullPath) {
      void router.push(tag.path);
    }
    tagsViewStore.refreshCurrentTag();
  };

  const closeOthers = (path = route.fullPath) => {
    tagsViewStore.removeOtherTags(path);

    if (path !== route.fullPath) {
      void router.push(path);
    }
  };

  const closeAll = () => {
    tagsViewStore.removeAllTags();
    void router.push(fallbackPath);
  };

  return {
    tagsViewStore,
    viewKey,
    closeTag,
    refreshTag,
    closeOthers,
    closeAll,
  };
}
