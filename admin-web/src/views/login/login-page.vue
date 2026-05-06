<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

import { useAppI18n } from '@/composables/use-app-i18n'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { t } = useAppI18n()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formModel = reactive({
  username: 'admin',
  password: 'admin123'
})

const formRules = computed<FormRules<typeof formModel>>(() => ({
  username: [{ required: true, message: t('login.usernameRequired'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.passwordRequired'), trigger: 'blur' }]
}))

const submitLogin = async () => {
  await formRef.value?.validate()
  loading.value = true

  try {
    await userStore.login(formModel)
    router.replace((route.query.redirect as string) || '/')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-page__panel">
      <div class="login-page__intro">
        <p class="login-page__eyebrow">{{ t('login.eyebrow') }}</p>
        <h1>{{ t('login.title') }}</h1>
        <p>{{ t('login.description') }}</p>
      </div>

      <el-card class="login-page__card" shadow="never">
        <template #header>
          <div>
            <h2>{{ t('login.cardTitle') }}</h2>
            <p>{{ t('login.cardDescription') }}</p>
          </div>
        </template>

        <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
          <el-form-item :label="t('common.username')" prop="username">
            <el-input v-model="formModel.username" :placeholder="t('login.usernamePlaceholder')" />
          </el-form-item>
          <el-form-item :label="t('common.password')" prop="password">
            <el-input
              v-model="formModel.password"
              :placeholder="t('login.passwordPlaceholder')"
              show-password
              type="password"
              @keyup.enter="submitLogin"
            />
          </el-form-item>
          <el-button
            type="primary"
            class="login-page__submit"
            :loading="loading"
            @click="submitLogin"
          >
            {{ t('common.login') }}
          </el-button>
        </el-form>
      </el-card>
    </section>
  </main>
</template>

<style scoped lang="scss">
.login-page {
  display: grid;
  min-height: 100vh;
  padding: 32px;
  background:
    radial-gradient(circle at top left, rgb(22 119 255 / 16%), transparent 32%),
    linear-gradient(135deg, #eef4ff 0%, #f8fafc 100%);
  place-items: center;
}

.login-page__panel {
  display: grid;
  grid-template-columns: minmax(280px, 1fr) 420px;
  gap: 48px;
  align-items: center;
  width: min(100%, 1040px);
}

.login-page__intro {
  h1 {
    margin: 12px 0 16px;
    color: #111827;
    font-size: 44px;
  }

  p {
    max-width: 520px;
    color: #4b5563;
    line-height: 1.8;
  }
}

.login-page__eyebrow {
  color: var(--app-primary-color);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-page__card {
  border: 0;
  border-radius: 16px;
}

.login-page__submit {
  width: 100%;
}

@media (width <= 860px) {
  .login-page__panel {
    grid-template-columns: 1fr;
  }
}
</style>
