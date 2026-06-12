<template>
  <UniLoginPage
    :background-image="loginBgUrl"
    :captcha-client="captchaClient"
    :login-request="handleLogin"
    random-str="blockPuzzle" />
</template>

<script setup lang="ts">
import { UniLoginPage, type UniCaptchaClient } from 'uni-ui-lib'
import { useRoute, useRouter } from 'vue-router'

import loginBgUrl from '@/assets/images/isa.png'
import { captchaApi } from '@/api'
import { useUserStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const captchaClient: UniCaptchaClient = {
  fetchImage: () => captchaApi.image.get(),
  encrypt: (value, secretKey) => captchaApi.encrypt.run(value, secretKey),
  verify: (params) => captchaApi.check.post(params)
}

const handleLogin = async (payload: {
  username: string
  password: string
  captchaVerification: string
  randomStr: string
}) => {
  await userStore.login({
    username: payload.username,
    password: payload.password,
    code: payload.captchaVerification,
    randomStr: payload.randomStr
  })
  router.replace((route.query.redirect as string) || '/')
}
</script>
