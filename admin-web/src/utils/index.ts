export const isExternalUrl = (path: string) => /^(https?:|mailto:|tel:)/.test(path)

export const getAppTitle = () => import.meta.env.VITE_APP_TITLE || 'Admin Web'
