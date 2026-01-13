import { useState, useEffect } from 'react'

// Hook for PWA Install Prompt
export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) return false

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstallable(false)
      setInstallPrompt(null)
      return true
    }

    return false
  }

  return { isInstallable, promptInstall }
}
