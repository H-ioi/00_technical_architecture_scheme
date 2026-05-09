<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  MoreFilled,
  Refresh,
} from "@element-plus/icons-vue";
import { ref } from "vue";

import type { UniLayoutTag, UniLayoutTranslate } from "@/types/uni-layout";

withDefaults(
  defineProps<{
    tags: UniLayoutTag[];
    activePath: string;
    translate?: UniLayoutTranslate;
  }>(),
  {
    translate: (_key?: string, fallback = "") => fallback,
  },
);

const emit = defineEmits<{
  click: [path: string];
  close: [path: string];
  refresh: [tag?: UniLayoutTag];
  closeOthers: [path?: string];
  closeAll: [];
}>();

const scrollRef = ref<HTMLElement>();

const closeTag = (path: string, event: Event) => {
  event.stopPropagation();
  emit("close", path);
};

const scrollTags = (direction: "left" | "right") => {
  scrollRef.value?.scrollBy({
    left: direction === "left" ? -180 : 180,
    behavior: "smooth",
  });
};

const handleMoreCommand = (command: string | number | object) => {
  if (command === "closeOthers") {
    emit("closeOthers");
    return;
  }

  if (command === "closeAll") {
    emit("closeAll");
  }
};

const handleTagCommand = (
  command: string | number | object,
  tag: UniLayoutTag,
) => {
  if (command === "refresh") {
    emit("refresh", tag);
    return;
  }

  if (command === "close") {
    emit("close", tag.path);
    return;
  }

  if (command === "closeOthers") {
    emit("closeOthers", tag.path);
    return;
  }

  if (command === "closeAll") {
    emit("closeAll");
  }
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
          (command: string | number | object) => handleTagCommand(command, tag)
        "
      >
        <el-tag
          class="uni-layout-tags__tag"
          :class="{ 'is-active': tag.path === activePath }"
          :closable="!tag.affix"
          :effect="tag.path === activePath ? 'dark' : 'plain'"
          @click="emit('click', tag.path)"
          @close="closeTag(tag.path, $event)"
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
        @command="handleMoreCommand"
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
        @click="emit('refresh')"
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
