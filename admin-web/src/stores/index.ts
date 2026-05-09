import { createPinia } from 'pinia'

export const pinia = createPinia()

export * from './modules/app'
export * from './modules/permission'
export * from './modules/user'
