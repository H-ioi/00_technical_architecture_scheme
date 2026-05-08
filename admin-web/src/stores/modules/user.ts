import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { loginApi, logoutApi } from '@/api/modules/auth'
import { usePermissionStore } from '@/stores/modules/permission'
import type { LoginParams, UserProfile } from '@/types/auth'
import { storage } from '@/utils/storage'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(storage.get<string>('access-token') ?? '')
  const profile = ref<UserProfile | null>(storage.get<UserProfile>('user-profile'))

  const isLoggedIn = computed(() => Boolean(accessToken.value))

  const setToken = (token: string) => {
    accessToken.value = token
    storage.set('access-token', token)
  }

  const setProfile = (nextProfile: UserProfile | null) => {
    profile.value = nextProfile

    if (nextProfile) {
      storage.set('user-profile', nextProfile)
    } else {
      storage.remove('user-profile')
    }
  }

  const login = async (params: LoginParams) => {
    const result = await loginApi(params)
    const permissionStore = usePermissionStore()

    setToken(result.accessToken)
    setProfile(result.user)
    permissionStore.setPermissionCodes(result.permissions)

    return result
  }

  const logout = async () => {
    if (accessToken.value) {
      await logoutApi().catch(() => undefined)
    }

    resetAuth()
  }

  const resetAuth = () => {
    const permissionStore = usePermissionStore()

    accessToken.value = ''
    profile.value = null
    permissionStore.resetPermission()
    storage.remove('access-token')
    storage.remove('user-profile')
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
