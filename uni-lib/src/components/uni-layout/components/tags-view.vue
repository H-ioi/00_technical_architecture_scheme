<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  MoreFilled,
  Refresh,
} from "@element-plus/icons-vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useTagsViewFromRoute } from "@/composables/use-uni-tags-view-from-route";
import { useUniTagsViewController } from "@/composables/use-uni-tags-view-controller";
import type { UniLayoutTag, UniLayoutTranslate } from "@/types/uni-layout";

const props = withDefaults(
  defineProps<{
    tags: UniLayoutTag[];
    activePath: string;
    /** 为 true 时根据当前路由维护 `visitedTags`（与 `UniLayout` 的 `autoWire` 一致） */
    syncFromRoute?: boolean;
    /** `syncFromRoute` 为 true 时，关闭全部等操作的回落路径 */
    tagsFallback?: string;
    translate?: UniLayoutTranslate;
  }>(),
  {
    syncFromRoute: true,
    tagsFallback: "/dashboard",
    translate: (_key?: string, fallback = "") => fallback,
  },
);

useTagsViewFromRoute({ enabled: () => props.syncFromRoute });

const router = useRouter();
const route = useRoute();
const {
  closeTag: removeVisitedTag,
  refreshTag,
  closeOthers,
  closeAll,
} = useUniTagsViewController(router, route, {
  fallbackPath: props.tagsFallback,
});

const emit = defineEmits<{
  click: [path: string];
  close: [path: string];
  refresh: [tag?: UniLayoutTag];
  closeOthers: [path?: string];
  closeAll: [];
}>();

const scrollRef = ref<HTMLElement>();

const isSelfManaged = () => props.syncFromRoute;

const navigateTag = (path: string) => {
  if (isSelfManaged()) {
    void router.push(path);
    return;
  }

  emit("click", path);
};

const onTagCloseIcon = (path: string, event: Event) => {
  event.stopPropagation();

  if (isSelfManaged()) {
    removeVisitedTag(path);
    return;
  }

  emit("close", path);
};
const scrollTags = (direction: "left" | "right") => {
  scrollRef.value?.scrollBy({
    left: direction === "left" ? -180 : 180,
    behavior: "smooth",
  });
};

const handleTagsMenuCommand = (
  command: string | number | object,
  tag?: UniLayoutTag,
) => {
  const closeOthersAnchor = tag?.path ?? route.fullPath;

  if (isSelfManaged()) {
    if (command === "refresh") {
      if (tag) {
        refreshTag(tag);
      }

      return;
    }

    if (command === "close") {
      if (tag) {
        removeVisitedTag(tag.path);
      }

      return;
    }

    if (command === "closeOthers") {
      closeOthers(closeOthersAnchor);
      return;
    }

    if (command === "closeAll") {
      closeAll();
    }

    return;
  }

  if (command === "refresh") {
    emit("refresh", tag);
    return;
  }

  if (command === "close") {
    if (tag) {
      emit("close", tag.path);
    }

    return;
  }

  if (command === "closeOthers") {
    emit("closeOthers", tag?.path);
    return;
  }

  if (command === "closeAll") {
    emit("closeAll");
  }
};

const onToolbarRefresh = () => {
  if (isSelfManaged()) {
    refreshTag();
    return;
  }

  emit("refresh");
};
</script>

<template>
  <div class="uni-layout-tags">
    <div ref="scrollRef" class="uni-layout-tags__scroll">
      <el-dropdown
        v-for="tag in tags"
        :key="tag.path"
        trigger="contextmenu"
        popper-class="uni-layout-tags-context-dropdown"
        @command="
          (command: string | number | object) =>
            handleTagsMenuCommand(command, tag)
        "
      >
        <el-tag
          class="uni-layout-tags__tag"
          :class="{ 'is-active': tag.path === activePath }"
          :closable="!tag.affix"
          :effect="tag.path === activePath ? 'dark' : 'plain'"
          @click="navigateTag(tag.path)"
          @close="onTagCloseIcon(tag.path, $event)"
        >
          {{ translate(tag.titleKey, tag.title) }}
        </el-tag>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">
              {{ translate("common.refresh", "刷新") }}
            </el-dropdown-item>
            <el-dropdown-item command="close" :disabled="tag.affix">
              {{ translate("common.closeCurrent", "关闭当前") }}
            </el-dropdown-item>
            <el-dropdown-item command="closeOthers">
              {{ translate("common.closeOthers", "关闭其他") }}
            </el-dropdown-item>
            <el-dropdown-item command="closeAll">
              {{ translate("common.closeAll", "关闭全部") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="uni-layout-tags__actions">
      <el-button
        :icon="ArrowLeft"
        text
        :aria-label="translate('common.scrollLeft', '向左滚动')"
        @click="scrollTags('left')"
      />
      <el-button
        :icon="ArrowRight"
        text
        :aria-label="translate('common.scrollRight', '向右滚动')"
        @click="scrollTags('right')"
      />
      <el-dropdown
        trigger="click"
        popper-class="uni-layout-tags-more-dropdown"
        @command="
          (command: string | number | object) =>
            handleTagsMenuCommand(command)
        "
      >
        <el-button
          :icon="MoreFilled"
          text
          :aria-label="translate('common.more', '更多')"
        />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeOthers">
              {{ translate("common.closeOthers", "关闭其他") }}
            </el-dropdown-item>
            <el-dropdown-item command="closeAll">
              {{ translate("common.closeAll", "关闭全部") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        :icon="Refresh"
        text
        :aria-label="translate('common.refresh', '刷新')"
        @click="onToolbarRefresh"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.uni-layout-tags {
  display: flex;
  gap: 0;
  align-items: center;
  flex-shrink: 0;
  height: var(--uni-layout-tags-height);
  padding: 0 10px;
  background: var(--uni-layout-card-bg);
  border-bottom: 1px solid var(--uni-layout-border);

  &__scroll {
    display: flex;
    gap: 8px;
    align-items: center;
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  &__scroll::-webkit-scrollbar {
    display: none;
  }

  &__tag {
    flex-shrink: 0;
    cursor: pointer;
    user-select: none;

    :deep(.el-tag__close) {
      width: 0;
      margin-left: 0;
      overflow: hidden;
      opacity: 0;
      transition:
        width 0.2s ease,
        margin-left 0.2s ease,
        opacity 0.2s ease;
    }

    &:hover :deep(.el-tag__close),
    &.is-active :deep(.el-tag__close) {
      width: 14px;
      margin-left: 6px;
      opacity: 1;
    }
  }

  &__actions {
    position: relative;
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    align-items: center;
    height: 100%;
    padding-left: 8px;
    margin-left: 8px;

    :deep(.el-button) {
      width: 30px;
      height: 30px;
      margin-left: 0;
      color: #8ca0b3;
      font-size: 14px;
    }

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 1px;
      height: 60%;
      background: var(--uni-layout-border);
      transform: translateY(-50%);
    }
  }
}
</style>
