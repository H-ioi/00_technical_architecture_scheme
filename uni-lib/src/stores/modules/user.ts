import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getUniConfig } from '@/plugins/config'
import { storage } from '@/plugins/storage'
import type { UniUserProfile } from '@/types/user-profile'

import { useMenuStore } from './menu'
import { usePermissionCodeStore } from './permission-code'
import { useRouteAccessStore } from './route-access'

export const useUserStore = defineStore('user', () => {
  const accessToken = ref(storage.get<string>('access-token') ?? '')
  const profile = ref<UniUserProfile | null>(storage.get<UniUserProfile>('user-profile'))

  const isLoggedIn = computed(() => Boolean(accessToken.value))

  const setToken = (token: string) => {
    accessToken.value = token
    storage.set('access-token', token)
  }

  const setProfile = (nextProfile: UniUserProfile | null) => {
    profile.value = nextProfile

    if (nextProfile) {
      storage.set('user-profile', nextProfile)
    } else {
      storage.remove('user-profile')
    }
  }

  const resetShellAccess = () => {
    useMenuStore().reset()
    useRouteAccessStore().reset()
    usePermissionCodeStore().reset()
  }

  const login = async (params: unknown) => {
    const result = await getUniConfig().auth.login(params)

    setToken(result.accessToken)
    setProfile(result.user)
    resetShellAccess()
    usePermissionCodeStore().setPermissionCodes(result.permissions)

    return result
  }

  const logout = async () => {
    if (accessToken.value) {
      await getUniConfig()
        .auth.logoutRequest?.()
        .catch(() => undefined)
    }

    resetAuth()
  }

  const resetAuth = () => {
    accessToken.value = ''
    profile.value = null
    resetShellAccess()
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
