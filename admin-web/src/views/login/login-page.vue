<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const formModel = reactive({
  username: 'admin',
  password: 'admin123'
})

const formRules: FormRules<typeof formModel> = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

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
        <p class="login-page__eyebrow">Admin Template</p>
        <h1>管理后台模板</h1>
        <p>统一工程结构、权限骨架、请求封装与后台布局，登录 UI 可按产品线独立调整。</p>
      </div>

      <el-card class="login-page__card" shadow="never">
        <template #header>
          <div>
            <h2>账号登录</h2>
            <p>示例账号用于模板本地闭环，接入后端时替换认证 Service。</p>
          </div>
        </template>

        <el-form ref="formRef" :model="formModel" :rules="formRules" label-position="top">
          <el-form-item label="账号" prop="username">
            <el-input v-model="formModel.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formModel.password"
              placeholder="请输入密码"
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
            登录
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
