<script setup lang="ts">
import { CaretBottom, CaretTop, DocumentCopy } from "@element-plus/icons-vue";
import { ElIcon, ElMessage } from "element-plus";
import { onMounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** 示例标题，展示在预览区上方 */
    title?: string;
    /** 与示例对应的完整代码，用于展示与复制 */
    code: string;
    /** 进入页面时是否展开代码区 */
    defaultExpand?: boolean;
  }>(),
  {
    defaultExpand: false,
  },
);

const expanded = ref(props.defaultExpand);
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

watch(
  () => props.defaultExpand,
  (v) => {
    expanded.value = v;
  },
);

async function copyCode() {
  const text = props.code.replace(/\n$/, "").trim();

  try {
    await navigator.clipboard.writeText(text);
    ElMessage.success("已复制到剪贴板");
  } catch {
    ElMessage.error("复制失败，请手动选择代码复制");
  }
}

function toggle() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <div class="comp-demo">
    <div v-if="title" class="comp-demo__title">{{ title }}</div>
    <!-- 不使用 vp-raw：其样式重置会破坏 Element Plus 表格（表头/表体错位）与分页布局 -->
    <div class="comp-demo__preview uni-lib-demo">
      <div v-if="mounted" class="comp-demo__preview-inner">
        <slot />
      </div>
      <div v-else class="comp-demo__placeholder">预览加载中…</div>
    </div>
    <div class="comp-demo__toolbar">
      <div class="comp-demo__toolbar-inner">
        <button
          type="button"
          class="comp-demo__btn"
          :class="{ 'comp-demo__btn--active': expanded }"
          :aria-expanded="expanded"
          :aria-label="expanded ? '收起代码' : '展开代码'"
          :title="expanded ? '收起代码' : '展开代码'"
          @click="toggle"
        >
          <ElIcon :size="17">
            <CaretTop v-if="expanded" />
            <CaretBottom v-else />
          </ElIcon>
        </button>
        <button
          type="button"
          class="comp-demo__btn"
          aria-label="复制代码"
          title="复制代码"
          @click="copyCode"
        >
          <ElIcon :size="17">
            <DocumentCopy />
          </ElIcon>
        </button>
      </div>
    </div>
    <Transition name="comp-demo-expand">
      <div v-show="expanded" class="comp-demo__code-panel">
        <pre
          class="comp-demo__pre"
        ><code class="comp-demo__code">{{ code }}</code></pre>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.comp-demo {
  margin: 16px 0 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  /* 勿用 overflow:hidden，否则表格底部分页常被裁切 */
  overflow: visible;
  background: var(--vp-c-bg-soft);
}

.comp-demo__title {
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.comp-demo__preview {
  margin: 0;
  border: none;
  border-radius: 0;
}

.comp-demo__preview-inner {
  min-height: 24px;
  width: 100%;
  overflow-x: auto;
}

.comp-demo__placeholder {
  padding: 24px;
  text-align: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.comp-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 6px 10px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}

.comp-demo__toolbar-inner {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
}

.comp-demo__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  color: var(--vp-c-text-2);
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.comp-demo__btn:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

.comp-demo__btn--active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-alt);
}

.comp-demo__btn:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.comp-demo__code-panel {
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}

.comp-demo__pre {
  margin: 0;
  padding: 14px 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.55;
}

.comp-demo__code {
  font-family: var(--vp-font-family-mono);
  white-space: pre;
  color: var(--vp-c-text-2);
}

.comp-demo-expand-enter-active,
.comp-demo-expand-leave-active {
  transition: opacity 0.2s ease;
}

.comp-demo-expand-enter-from,
.comp-demo-expand-leave-to {
  opacity: 0;
}
</style>
