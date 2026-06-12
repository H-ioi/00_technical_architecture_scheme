/** vite-plugin-pwa 的 registerSW 回调选项（组件库不依赖该包，在此声明最小类型） */
export type PwaRegisterSWOptions = {
  onRegisterError?: (error: unknown) => void
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
  onNeedRefresh?: () => void
  onOfflineReady?: () => void
}

/** vite-plugin-pwa virtual:pwa-register 导出的 registerSW 函数类型 */
export type PwaRegisterSW = (
  options?: PwaRegisterSWOptions
) => (reloadPage?: boolean) => Promise<void>

/** 注入右下角毛玻璃更新卡片样式（仅执行一次） */
const injectPwaStyles = () => {
  if (document.getElementById('uni-pwa-update-styles')) {
    return
  }
  const style = document.createElement('style')
  style.id = 'uni-pwa-update-styles'
  style.textContent = `
    @keyframes uni-pwa-enter {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes uni-pwa-glow {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.85; }
    }
    .uni-pwa-card {
      position: fixed;
      right: 24px;
      bottom: 24px;
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 300px;
      max-width: 360px;
      padding: 16px 18px;
      border-radius: 18px;
      background: linear-gradient(145deg, rgba(22, 28, 45, 0.78), rgba(12, 16, 28, 0.88));
      backdrop-filter: blur(22px) saturate(160%);
      -webkit-backdrop-filter: blur(22px) saturate(160%);
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow:
        0 16px 48px rgba(0, 0, 0, 0.28),
        0 0 0 1px rgba(255, 255, 255, 0.06) inset,
        0 0 32px rgba(64, 158, 255, 0.18);
      color: rgba(255, 255, 255, 0.92);
      font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
      animation: uni-pwa-enter var(--uni-duration-enter) var(--uni-ease-emphasized);
      overflow: hidden;
    }
    .uni-pwa-card::before {
      content: '';
      position: absolute;
      inset: -40% auto auto -20%;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(64, 158, 255, 0.35) 0%, transparent 70%);
      pointer-events: none;
      animation: uni-pwa-glow 3s ease-in-out infinite;
    }
    .uni-pwa-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 20px;
      line-height: 1;
    }
    .uni-pwa-body {
      flex: 1;
      min-width: 0;
    }
    .uni-pwa-status {
      display: block;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.45;
      letter-spacing: 0.02em;
    }
    .uni-pwa-progress-wrap {
      margin-top: 10px;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      overflow: hidden;
    }
    .uni-pwa-progress-bar {
      width: 0%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #409eff, #79bbff, #a0cfff);
      box-shadow: 0 0 12px rgba(64, 158, 255, 0.6);
      transition: width var(--uni-duration-slow) var(--uni-ease-standard);
    }
    .uni-pwa-update-btn {
      flex-shrink: 0;
      display: none;
      padding: 8px 16px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
      transition: var(--uni-transition-transform), box-shadow var(--uni-duration-base) var(--uni-ease-standard);
    }
    .uni-pwa-update-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
    }
    .uni-pwa-update-btn:active {
      transform: translateY(0);
    }
  `
  document.head.appendChild(style)
}

/** 注册 Service Worker，并在检测到新版本时展示右下角毛玻璃更新卡片 */
export function registerServiceWorker(registerSW: PwaRegisterSW) {
  let updateNotification: HTMLDivElement | undefined
  let interval: ReturnType<typeof setInterval> | null = null

  /** 创建右下角更新通知卡片 */
  const createNotification = () => {
    if (!updateNotification) {
      injectPwaStyles()
      updateNotification = document.createElement('div')
      updateNotification.innerHTML = `
        <div class="uni-pwa-card">
          <div class="uni-pwa-icon" id="status-icon">🔄</div>
          <div class="uni-pwa-body">
            <span class="uni-pwa-status" id="status-text">发现新版本，即将开始下载...</span>
            <div class="uni-pwa-progress-wrap" id="progress-body">
              <div class="uni-pwa-progress-bar" id="update-progress"></div>
            </div>
          </div>
          <button type="button" class="uni-pwa-update-btn" id="update-button">立即更新</button>
        </div>
      `
      document.body.appendChild(updateNotification)
    }
    return updateNotification
  }

  /** 绑定「立即更新」按钮，避免重复注册 click 监听 */
  const bindUpdateButton = (updateSW: ReturnType<PwaRegisterSW>) => {
    const updateButton = updateNotification?.querySelector<HTMLButtonElement>('#update-button')
    updateButton?.addEventListener(
      'click',
      () => {
        void updateSW(true)
      },
      { once: true }
    )
  }

  /** 切换到「可更新」状态：隐藏进度条、展示按钮 */
  const showReadyState = (message: string, icon: string, updateSW: ReturnType<PwaRegisterSW>) => {
    createNotification()
    const progressBar = updateNotification?.querySelector<HTMLElement>('#progress-body')
    const updateButton = updateNotification?.querySelector<HTMLElement>('#update-button')
    const statusText = updateNotification?.querySelector('#status-text')
    const statusIcon = updateNotification?.querySelector('#status-icon')
    if (progressBar) {
      progressBar.style.display = 'none'
    }
    if (statusText) {
      statusText.textContent = message
    }
    if (statusIcon) {
      statusIcon.textContent = icon
    }
    if (updateButton) {
      updateButton.style.display = 'inline-block'
      bindUpdateButton(updateSW)
    }
  }

  const updateSW = registerSW({
    onRegisterError(error) {
      console.error('Service worker 注册失败:', error)
    },
    onRegistered(registration) {
      console.log('Service Worker 注册成功')
      registration?.update().then(() => {
        if (registration?.installing) {
          console.log('检测到新版本...')
          createNotification()
          const statusText = updateNotification?.querySelector('#status-text')
          const statusIcon = updateNotification?.querySelector('#status-icon')
          if (statusText) {
            statusText.textContent = '正在准备下载系统更新...'
          }
          if (statusIcon) {
            statusIcon.textContent = '⏳'
          }

          let progress = 0
          interval = setInterval(() => {
            const increment = (1 - progress) * (1 - progress) * Math.random() * 0.1
            progress += increment
            if (progress > 0.99) {
              progress = 0.99
            }

            const progressBar = updateNotification?.querySelector<HTMLElement>('#update-progress')
            const statusTextEl = updateNotification?.querySelector('#status-text')
            if (progressBar) {
              progressBar.style.width = `${Math.round(progress * 100)}%`
            }
            if (statusTextEl) {
              statusTextEl.textContent = `新版本下载中 ${Math.round(progress * 100)}%`
            }
          }, 200)
        }
        if (registration?.waiting) {
          console.log('新版本已下载...')
          showReadyState('新版本已就绪，请立即更新', '✨', updateSW)
        }
      })
    },
    onNeedRefresh() {
      console.log('下载完成...')
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      showReadyState('新版本已准备就绪', '✨', updateSW)
    },
    onOfflineReady() {
      console.log('应用已准备好离线工作。')
    }
  })
}
