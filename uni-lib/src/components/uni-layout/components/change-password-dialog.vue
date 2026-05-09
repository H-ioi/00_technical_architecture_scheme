<template>
  <el-dialog
    v-model="visible"
    :title="t('layout.changePasswordTitle')"
    :width="width"
    :destroy-on-close="destroyOnClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-form-item :label="t('layout.oldPassword')" prop="password">
        <el-input v-model="form.password" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('layout.newPassword')" prop="newpassword1">
        <el-input v-model="form.newpassword1" type="password" show-password />
      </el-form-item>
      <el-form-item :label="t('layout.confirmPassword')" prop="newpassword2">
        <el-input v-model="form.newpassword2" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetForm">{{ t("layout.reset") }}</el-button>
      <el-button @click="handleCancel">{{ t("layout.cancel") }}</el-button>
      <el-button
        type="primary"
        :loading="effectiveLoading"
        @click="handleSubmit"
      >
        {{ t("layout.submit") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { computed, reactive, ref, watch } from "vue";

import { getUniConfig, tryGetUniConfig } from "@/plugins/config";
import { request } from "@/plugins/request";
import { useUniI18n } from "@/locales/use-uni-i18n";
import { useUserStore } from "@/stores";
import type { UniLayoutChangePasswordPayload } from "@/types/uni-layout";

defineOptions({
  name: "UniLayoutChangePasswordDialog",
});

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    /** 未配置 <code>runtime.changePassword</code> 时生效，由父级控制提交与 loading */
    loading?: boolean;
    width?: string;
    destroyOnClose?: boolean;
  }>(),
  {
    loading: false,
    width: "420px",
    destroyOnClose: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  submit: [payload: UniLayoutChangePasswordPayload];
  cancel: [];
}>();

const { t } = useUniI18n();
const userStore = useUserStore();
const formRef = ref<FormInstance>();
const form = reactive({
  password: "",
  newpassword1: "",
  newpassword2: "",
});

const managed = computed(() => Boolean(tryGetUniConfig()?.changePassword));
const innerLoading = ref(false);
const effectiveLoading = computed(() =>
  managed.value ? innerLoading.value : props.loading,
);

const resetForm = () => {
  form.password = "";
  form.newpassword1 = "";
  form.newpassword2 = "";
  formRef.value?.clearValidate();
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      resetForm();
    }
  },
);

const rules = computed<FormRules<typeof form>>(() => ({
  password: [
    {
      required: true,
      message: t("layout.oldPasswordRequired"),
      trigger: "blur",
    },
    { min: 6, message: t("layout.passwordMinLength"), trigger: "blur" },
  ],
  newpassword1: [
    {
      required: true,
      message: t("layout.newPasswordRequired"),
      trigger: "blur",
    },
    { min: 6, message: t("layout.passwordMinLength"), trigger: "blur" },
  ],
  newpassword2: [
    {
      required: true,
      message: t("layout.confirmPasswordRequired"),
      trigger: "blur",
    },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.newpassword1) {
          callback(new Error(t("layout.passwordMismatch")));
          return;
        }

        callback();
      },
      trigger: "blur",
    },
  ],
}));

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

const handleCancel = () => {
  emit("cancel");
  visible.value = false;
};

const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false);

  if (!valid) {
    return;
  }

  const payload: UniLayoutChangePasswordPayload = {
    password: form.password,
    newpassword1: form.newpassword1,
    newpassword2: form.newpassword2,
  };

  if (managed.value) {
    const cfg = getUniConfig().changePassword;
    if (!cfg) {
      return;
    }

    innerLoading.value = true;

    try {
      const body = {
        username: userStore.profile?.username || userStore.profile?.name || "",
        ...payload,
      };
      const path = cfg.api.path;
      const method = (cfg.api.method ?? "put").toUpperCase();

      if (method === "POST") {
        await request.post(path, body);
      } else {
        await request.put(path, body);
      }

      ElMessage.success(t("layout.passwordChangeSuccess"));
      visible.value = false;
      await cfg.onSuccess?.();
    } finally {
      innerLoading.value = false;
    }

    return;
  }

  emit("submit", payload);
};
</script>

<style scoped lang="scss"></style>
