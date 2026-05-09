<template>
  <main class="uni-login-page">
    <div class="uni-login-page__decor uni-login-page__decor--left" />
    <div class="uni-login-page__decor uni-login-page__decor--right" />
    <section class="uni-login-page__panel">
      <div class="uni-login-page__intro">
        <div class="uni-login-page__logo">{{ logoText }}</div>
        <p class="uni-login-page__eyebrow">{{ $t("login.eyebrow") }}</p>
        <h1>{{ $t("login.title") }}</h1>
        <p>{{ $t("login.description") }}</p>
      </div>

      <el-card class="uni-login-page__card" shadow="never">
        <template #header>
          <div>
            <h2>{{ $t("login.cardTitle") }}</h2>
            <p>{{ $t("login.cardDescription") }}</p>
          </div>
        </template>

        <el-form
          ref="formRef"
          :model="formModel"
          :rules="formRules"
          label-position="top"
        >
          <el-form-item :label="$t('common.username')" prop="username">
            <el-input
              v-model="formModel.username"
              :placeholder="$t('login.usernamePlaceholder')"
            />
          </el-form-item>
          <el-form-item :label="$t('common.password')" prop="password">
            <el-input
              v-model="formModel.password"
              :placeholder="$t('login.passwordPlaceholder')"
              show-password
              type="password"
              @keyup.enter="submitLogin"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="uni-login-page__submit"
            :loading="loading"
            @click="submitLogin"
          >
            {{ $t("common.login") }}
          </el-button>
        </el-form>
      </el-card>
    </section>

    <UniLoginSecurityVerifyDialog
      v-model:visible="verifyVisible"
      :captcha-client="captchaClient"
      @success="loginWithCaptcha"
    />
  </main>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { computed, reactive, ref } from "vue";

import { useUniI18n } from "@/locales/use-uni-i18n";
import type { UniCaptchaClient } from "@/types/uni-login";

import UniLoginSecurityVerifyDialog from "./security-verify-dialog.vue";

const props = withDefaults(
  defineProps<{
    /** 左侧品牌区 Logo 文案 */
    logoText?: string;
    /** 滑块验证码能力（拉图 / 加密 / 校验由宿主注入） */
    captchaClient: UniCaptchaClient;
    /** 登录接口约定的验证码类型，随表单一并提交 */
    randomStr?: string;
    /** 提交登录（含滑块产物），由宿主调用 store / 接口 */
    loginRequest: (payload: {
      username: string;
      password: string;
      captchaVerification: string;
      randomStr: string;
    }) => Promise<void>;
  }>(),
  {
    logoText: "ISA",
    randomStr: "blockPuzzle",
  },
);

const { t } = useUniI18n();
const formRef = ref<FormInstance>();
const loading = ref(false);
const verifyVisible = ref(false);

const formModel = reactive({
  username: "",
  password: "",
});

const formRules = computed<FormRules<typeof formModel>>(() => ({
  username: [
    { required: true, message: t("login.usernameRequired"), trigger: "blur" },
  ],
  password: [
    { required: true, message: t("login.passwordRequired"), trigger: "blur" },
  ],
}));

const submitLogin = async () => {
  await formRef.value?.validate();
  verifyVisible.value = true;
};

const loginWithCaptcha = async (captchaVerification: string) => {
  loading.value = true;

  try {
    await props.loginRequest({
      ...formModel,
      captchaVerification,
      randomStr: props.randomStr,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.uni-login-page {
  position: relative;
  display: grid;
  min-height: 100vh;
  padding: 32px;
  overflow: hidden;
  background: linear-gradient(135deg, #f4f8fb 0%, #eef5f8 48%, #e8f8fb 100%);
  place-items: center;

  &__decor {
    position: absolute;
    border-radius: 999px;
    filter: blur(2px);

    &--left {
      bottom: -120px;
      left: -80px;
      width: 320px;
      height: 320px;
      background: rgb(42 63 84 / 12%);
    }

    &--right {
      top: -160px;
      right: -80px;
      width: 380px;
      height: 380px;
      background: rgb(27 188 199 / 18%);
    }
  }

  &__panel {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(280px, 1fr) 420px;
    gap: 48px;
    align-items: center;
    width: min(100%, 1040px);
  }

  &__intro {
    padding: 32px;
    color: #1f2937;

    h1 {
      margin: 12px 0 16px;
      color: #1f2937;
      font-size: 46px;
      line-height: 1.15;
    }

    p {
      max-width: 520px;
      color: #4b5563;
      line-height: 1.8;
    }
  }

  &__logo {
    display: inline-grid;
    width: 64px;
    height: 64px;
    margin-bottom: 24px;
    color: #fff;
    font-size: 20px;
    font-weight: 800;
    background: #2a3f54;
    border-radius: 18px;
    box-shadow: 0 16px 36px rgb(42 63 84 / 24%);
    place-items: center;
  }

  &__eyebrow {
    color: #2a3f54;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__card {
    border: 0;
    border-radius: 18px;
    box-shadow: 0 24px 60px rgb(42 63 84 / 16%);
  }

  &__submit {
    width: 100%;
  }
}

@media (width <=860px) {
  .uni-login-page__panel {
    grid-template-columns: 1fr;
  }
}
</style>
