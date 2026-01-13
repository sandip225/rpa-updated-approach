import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { Download, X } from 'lucide-react'
import { useState } from 'react'

const InstallPWA = () => {
  const { isInstallable, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (!isInstallable || dismissed) return null

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white rounded-lg shadow-lg p-4 z-50 animate-slide-up">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
      >
        <X size={20} />
      </button>
      
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Download size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Install App</h3>
          <p className="text-sm text-white/90 mb-3">
            Install our app for quick access and offline use
          </p>
          
          <button
            onClick={handleInstall}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Install Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPWA
