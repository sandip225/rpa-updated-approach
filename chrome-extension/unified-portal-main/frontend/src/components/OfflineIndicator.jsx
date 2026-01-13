import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowNotification(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showNotification) return null

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down ${
      isOnline ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
      <span className="font-medium">
        {isOnline ? 'Back Online' : 'You are Offline'}
      </span>
    </div>
  )
}

export default OfflineIndicator
