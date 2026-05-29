import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom'
import MagicLink from './pages/MagicLink'
import JobDetails from './pages/JobDetails'
import EvidenceCapture from './pages/EvidenceCapture'
import Checklist from './pages/Checklist'
import Summary from './pages/Summary'
import OfflineBanner from './components/OfflineBanner'

function AppContent() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const token = searchParams.get('token')

  return (
    <div className="min-h-screen bg-gray-50">
      {!isOnline && <OfflineBanner />}
      
      <Routes>
        <Route path="/" element={<MagicLink token={token} />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/evidence/:jobId" element={<EvidenceCapture />} />
        <Route path="/checklist/:jobId" element={<Checklist />} />
        <Route path="/summary/:sessionId" element={<Summary />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
