<script setup lang="ts">
import { computed, reactive, watch } from "vue";

import {
  applyUniTheme,
  getStoredUniTheme,
  saveUniTheme,
  type UniThemeOptions,
} from "@/theme";

defineOptions({
  name: "UniThemeSettings",
});

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    defaultTheme?: UniThemeOptions;
    storageKey?: string;
    title?: string;
  }>(),
  {
    defaultTheme: () => ({
      primaryColor: "#BA8E62",
    }),
    storageKey: "uni-lib:theme",
    title: "主题设置",
  },
);

const emit = defineEmits<{
  "update:modelValue": [visible: boolean];
  applied: [theme: UniThemeOptions];
}>();

const form = reactive({
  primaryColor: "#BA8E62",
  radiusBase: "8px",
  componentSizeLarge: "40px",
  componentSize: "32px",
  componentSizeSmall: "24px",
});

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const buildTheme = (): UniThemeOptions => ({
  ...props.defaultTheme,
  primaryColor: form.primaryColor,
  radiusBase: form.radiusBase,
  variables: {
    ...props.defaultTheme.variables,
    "--el-component-size-large": form.componentSizeLarge,
    "--el-component-size": form.componentSize,
    "--el-component-size-small": form.componentSizeSmall,
  },
});

const syncForm = (theme: UniThemeOptions) => {
  form.primaryColor = theme.primaryColor ?? props.defaultTheme.primaryColor ?? "#BA8E62";
  form.radiusBase = theme.radiusBase ?? props.defaultTheme.radiusBase ?? "8px";
  form.componentSizeLarge =
    theme.variables?.["--el-component-size-large"] ??
    props.defaultTheme.variables?.["--el-component-size-large"] ??
    "40px";
  form.componentSize =
    theme.variables?.["--el-component-size"] ??
    props.defaultTheme.variables?.["--el-component-size"] ??
    "32px";
  form.componentSizeSmall =
    theme.variables?.["--el-component-size-small"] ??
    props.defaultTheme.variables?.["--el-component-size-small"] ??
    "24px";
};

const applyTheme = () => {
  const theme = buildTheme();

  applyUniTheme(theme);
  saveUniTheme(theme, props.storageKey);
  emit("applied", theme);
  visible.value = false;
};

const resetTheme = () => {
  syncForm(props.defaultTheme);
  applyTheme();
};

watch(
  () => props.modelValue,
  (nextVisible) => {
    if (nextVisible) {
      syncForm(getStoredUniTheme(props.storageKey) ?? props.defaultTheme);
    }
  },
);
</script>

<template>
  <el-drawer v-model="visible" class="uni-theme-settings" :title="title" size="320px">
    <el-form label-position="top">
      <el-form-item label="主题色">
        <el-color-picker v-model="form.primaryColor" />
      </el-form-item>
      <el-form-item label="圆角">
        <el-input v-model="form.radiusBase" />
      </el-form-item>
      <el-form-item label="大尺寸">
        <el-input v-model="form.componentSizeLarge" />
      </el-form-item>
      <el-form-item label="默认尺寸">
        <el-input v-model="form.componentSize" />
      </el-form-item>
      <el-form-item label="小尺寸">
        <el-input v-model="form.componentSizeSmall" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="resetTheme">重置</el-button>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="applyTheme">应用</el-button>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.uni-theme-settings {
  :deep(.el-form-item) {
    margin-bottom: 14px;
  }
}
</style>
