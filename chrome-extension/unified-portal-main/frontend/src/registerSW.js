// Service Worker Registration for PWA
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-reload on new version
    updateSW(true)
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegistered(r) {
    // Check for updates every 60 seconds
    r && setInterval(() => {
      r.update()
    }, 60000)
  }
})

// Force reload if service worker is waiting
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    if (registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  })
}

export default updateSW
