import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { loginApi, logoutApi } from '@/api/modules/auth'
import type { LoginParams, UserProfile } from '@/types/auth'
import { storage } from '@/utils/storage'

const ACCESS_TOKEN_KEY = 'admin-web:access-token'
const USER_PROFILE_KEY = 'admin-web:user-profile'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(storage.get<string>(ACCESS_TOKEN_KEY) ?? '')
  const profile = ref<UserProfile | null>(storage.get<UserProfile>(USER_PROFILE_KEY))

  const isLoggedIn = computed(() => Boolean(accessToken.value))

  const setToken = (token: string) => {
    accessToken.value = token
    storage.set(ACCESS_TOKEN_KEY, token)
  }

  const setProfile = (nextProfile: UserProfile | null) => {
    profile.value = nextProfile

    if (nextProfile) {
      storage.set(USER_PROFILE_KEY, nextProfile)
    } else {
      storage.remove(USER_PROFILE_KEY)
    }
  }

  const login = async (params: LoginParams) => {
    const result = await loginApi(params)

    setToken(result.accessToken)
    setProfile(result.user)

    return result
  }

  const logout = async () => {
    if (accessToken.value) {
      await logoutApi().catch(() => undefined)
    }

    resetAuth()
  }

  const resetAuth = () => {
    accessToken.value = ''
    profile.value = null
    storage.remove(ACCESS_TOKEN_KEY)
    storage.remove(USER_PROFILE_KEY)
  }

  return {
    accessToken,
    profile,
    isLoggedIn,
    login,
    logout,
    resetAuth,
    setToken,
    setProfile
  }
})
