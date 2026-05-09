<script setup lang="ts">
/**
 * 表格单元格渲染器：按 `UniTableColumn.type` 输出文本、标签、复制、金额、日期、
 * 开关、图片、链接等；可配合列 `formatter` 与全局 `valueEnums` 做枚举展示。
 */
import { DocumentCopy } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { computed } from "vue";

import { useUniI18n } from "@/locales/use-uni-i18n";
import type { Recordable, UniOption } from "@/types/shared";
import type { UniTableColumn } from "@/types/uni-table";
import { copyText } from "@/utils/copy";
import {
  formatEmpty,
  formatTableCellText,
  isBlankValue,
  resolveOption,
  toArray,
} from "@/utils/format";

const props = defineProps<{
  row: Recordable;
  column: UniTableColumn;
  value: unknown;
  rowIndex: number;
  valueEnums?: Record<string, UniOption[]>;
}>();

const emit = defineEmits<{
  switchChange: [row: Recordable, column: UniTableColumn, value: unknown];
}>();

const i18n = useUniI18n();
const columnType = computed(() => props.column.type ?? "text");
const option = computed(() =>
  resolveOption(props.value, props.column, props.valueEnums),
);
const displayValue = computed(() =>
  formatTableCellText(
    props.row,
    props.column,
    props.value,
    props.rowIndex,
    props.valueEnums,
    i18n.t,
  ),
);

const imageUrls = computed(() =>
  toArray(props.value).map(String).filter(Boolean),
);
const linkItems = computed(() =>
  toArray(props.value).map(String).filter(Boolean),
);
const arrayItems = computed(() =>
  displayValue.value
    .split(props.column.array?.separator ?? "、")
    .filter(Boolean),
);
const emptyCopyTexts = new Set(["-", "--", "—", "暂无数据"]);
const copyTextValue = computed(() => String(displayValue.value ?? "").trim());
const canCopy = computed(
  () =>
    !isBlankValue(props.value) &&
    !isBlankValue(copyTextValue.value) &&
    !emptyCopyTexts.has(copyTextValue.value),
);

const copyCurrentValue = async () => {
  if (!canCopy.value) {
    return;
  }

  try {
    await copyText(copyTextValue.value);
    ElMessage.success(i18n.t("common.copySuccess"));
  } catch {
    ElMessage.error(i18n.t("common.copyFailed"));
  }
};

const getLinkHref = (value: unknown) => {
  if (typeof props.column.link?.href === "function") {
    return props.column.link.href(props.row, value);
  }

  return props.column.link?.href ?? String(value ?? "");
};

const handleSwitchChange = async (nextValue: unknown) => {
  const canChange = await props.column.switch?.beforeChange?.(
    props.row,
    nextValue,
  );

  if (canChange === false) {
    return;
  }

  emit("switchChange", props.row, props.column, nextValue);
};
</script>

<template>
  <div
    class="uni-table-cell"
    :class="{ 'is-overflow-tooltip': column.showOverflowTooltip }"
  >
    <template v-if="columnType === 'image' || columnType === 'images'">
      <el-image
        v-for="url in imageUrls"
        :key="url"
        class="uni-table-cell__image"
        :src="url"
        :preview-src-list="column.image?.preview === false ? [] : imageUrls"
        :style="{
          width: `${column.image?.width ?? 40}px`,
          height: `${column.image?.height ?? 40}px`,
        }"
        fit="cover"
      />
      <span v-if="imageUrls.length === 0">--</span>
    </template>

    <template v-else-if="columnType === 'video' || columnType === 'videos'">
      <el-link
        v-for="url in linkItems"
        :key="url"
        type="primary"
        :href="url"
        target="_blank"
        >查看视频</el-link
      >
      <span v-if="linkItems.length === 0">--</span>
    </template>

    <template v-else-if="columnType === 'tag' || columnType === 'enum'">
      <el-tag :type="option?.type as never" :color="option?.color">{{
        displayValue
      }}</el-tag>
    </template>

    <template v-else-if="columnType === 'tags'">
      <el-tag
        v-for="item in toArray(value)"
        :key="String(item)"
        class="uni-table-cell__tag"
      >
        {{ formatEmpty(item) }}
      </el-tag>
    </template>

    <template v-else-if="columnType === 'switch'">
      <el-switch
        :model-value="value"
        :active-value="column.switch?.activeValue ?? true"
        :inactive-value="column.switch?.inactiveValue ?? false"
        :disabled="
          typeof column.switch?.disabled === 'function'
            ? column.switch.disabled(row)
            : column.switch?.disabled
        "
        @change="handleSwitchChange"
      />
    </template>

    <template v-else-if="columnType === 'link' || columnType === 'links'">
      <el-link
        v-for="item in linkItems"
        :key="item"
        type="primary"
        :href="getLinkHref(item)"
        :target="column.link?.target ?? '_blank'"
        @click="column.link?.onClick?.(row, item)"
      >
        {{ item }}
      </el-link>
      <span v-if="linkItems.length === 0">--</span>
    </template>

    <div
      v-else-if="columnType === 'copy' || column.copyable"
      class="uni-table-cell__copy-container"
    >
      <span class="uni-table-cell__text">{{ displayValue }}</span>
      <el-button
        v-if="canCopy"
        class="uni-table-cell__copy"
        link
        type="primary"
        aria-label="复制"
        title="复制"
        @click="copyCurrentValue"
      >
        <el-icon>
          <DocumentCopy />
        </el-icon>
      </el-button>
    </div>

    <template
      v-else-if="columnType === 'array' && column.array?.renderMode === 'tag'"
    >
      <el-tag
        v-for="item in arrayItems"
        :key="item"
        class="uni-table-cell__tag"
        >{{ item }}</el-tag
      >
    </template>

    <template v-else-if="columnType === 'json'">
      <el-tooltip :content="displayValue" placement="top">
        <span class="uni-table-cell__ellipsis">{{ displayValue }}</span>
      </el-tooltip>
    </template>

    <template v-else>
      <span class="uni-table-cell__text">{{ displayValue }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
.uni-table-cell {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  min-width: 0;
  max-width: 100%;

  &__image {
    overflow: hidden;
    border-radius: 4px;
  }

  &__copy {
    flex-shrink: 0;
    margin-left: 4px;
    padding: 0;
  }

  &__tag {
    margin-right: 4px;
  }

  &__ellipsis {
    display: inline-block;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is-overflow-tooltip {
    flex-wrap: nowrap;
    width: 100%;
    overflow: hidden;
  }

  &.is-overflow-tooltip &__text,
  &.is-overflow-tooltip &__ellipsis,
  &.is-overflow-tooltip :deep(.el-link) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__copy-container {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: 100%;
    min-width: 0;

    .uni-table-cell__text {
      flex: 0 1 80%;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
