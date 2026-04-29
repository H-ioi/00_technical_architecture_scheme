<script setup lang="ts">
/**
 * 表格单元格渲染器：按 `UniTableColumn.type` 输出文本、标签、复制、金额、日期、
 * 开关、图片、链接等；可配合列 `formatter` 与全局 `valueEnums` 做枚举展示。
 */
import { DocumentCopy } from "@element-plus/icons-vue";
import { computed } from "vue";
import { ElMessage } from "element-plus";

import type { Recordable, UniOption, UniTableColumn } from "@/types/shared";
import { copyText } from "@/utils/copy";
import {
  formatDate,
  formatEmpty,
  formatMoney,
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

const columnType = computed(() => props.column.type ?? "text");
const option = computed(() =>
  resolveOption(props.value, props.column, props.valueEnums),
);

const displayValue = computed(() => {
  if (props.column.formatter) {
    return props.column.formatter(
      props.row,
      props.column,
      props.value,
      props.rowIndex,
    );
  }

  if (columnType.value === "date") {
    return formatDate(
      props.value,
      props.column.date?.format ?? "YYYY-MM-DD",
      props.column.date?.placeholder,
    );
  }

  if (columnType.value === "datetime") {
    return formatDate(
      props.value,
      props.column.date?.format ?? "YYYY-MM-DD HH:mm:ss",
      props.column.date?.placeholder,
    );
  }

  if (columnType.value === "time") {
    return formatDate(
      props.value,
      props.column.date?.format ?? "HH:mm:ss",
      props.column.date?.placeholder,
    );
  }

  if (columnType.value === "relativeTime") {
    if (props.value === undefined || props.value === null || props.value === "") {
      return "--";
    }

    const date = new Date(String(props.value));

    if (Number.isNaN(date.getTime())) {
      return String(props.value);
    }

    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    const absSeconds = Math.abs(diffSeconds);
    const suffix = diffSeconds >= 0 ? "前" : "后";

    if (absSeconds < 60) {
      return "刚刚";
    }

    if (absSeconds < 3600) {
      return `${Math.floor(absSeconds / 60)} 分钟${suffix}`;
    }

    if (absSeconds < 86400) {
      return `${Math.floor(absSeconds / 3600)} 小时${suffix}`;
    }

    return `${Math.floor(absSeconds / 86400)} 天${suffix}`;
  }

  if (columnType.value === "money") {
    return formatMoney(props.value);
  }

  if (columnType.value === "percent") {
    if (props.value === undefined || props.value === null) {
      return "--";
    }

    const numberValue = Number(props.value);

    return Number.isNaN(numberValue) ? String(props.value) : `${numberValue * 100}%`;
  }

  if (columnType.value === "boolean") {
    return props.value ? "是" : "否";
  }

  if (columnType.value === "enum" || columnType.value === "tag") {
    return option.value?.label ?? formatEmpty(props.value);
  }

  if (columnType.value === "array") {
    const key = props.column.array?.itemLabel;
    return toArray(props.value)
      .map((item) => {
        if (key && typeof item === "object" && item) {
          return formatEmpty((item as Recordable)[key]);
        }

        return formatEmpty(item);
      })
      .join(props.column.array?.separator ?? "、");
  }

  if (columnType.value === "json") {
    return props.value === undefined || props.value === null
      ? "--"
      : JSON.stringify(props.value);
  }

  return formatEmpty(props.value);
});

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

const copyCurrentValue = async () => {
  await copyText(String(displayValue.value));
  ElMessage.success("复制成功");
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
  <div class="uni-table-cell">
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

    <template v-else-if="columnType === 'copy' || column.copyable">
      <span>{{ displayValue }}</span>
      <el-button
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
    </template>

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
      {{ displayValue }}
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

  &__image {
    overflow: hidden;
    border-radius: 4px;
  }

  &__copy {
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
}
</style>
