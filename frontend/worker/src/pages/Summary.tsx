import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Upload, Home, AlertCircle, Camera, MapPin, List, FileText } from 'lucide-react'

export default function Summary() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async () => {
    setIsUploading(true)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setIsComplete(true)
  }

  const handleReturnHome = () => {
    navigate('/')
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--v-bg)' }}>
        <div className="v-card p-10 max-w-sm w-full text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ backgroundColor: 'var(--v-success-bg)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: 'var(--v-success)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--v-text)' }}>Submitted!</h2>
          <p className="mb-6" style={{ color: 'var(--v-text-tertiary)' }}>
            Your evidence has been uploaded and is being validated.
          </p>

          <div
            className="p-4 rounded-xl mb-6 text-left"
            style={{ backgroundColor: 'var(--v-bg-subtle)', border: '1px solid var(--v-border)' }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--v-text-muted)' }}>Session ID</p>
            <p className="font-mono text-sm font-bold" style={{ color: 'var(--v-text)' }}>{sessionId}</p>
          </div>

          <button onClick={handleReturnHome} className="v-btn v-btn-primary w-full">
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Header */}
      <div className="v-section-header pb-10">
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Review</span>
          </div>
          <h1>Review & Submit</h1>
          <p className="mt-1">Confirm your evidence before submitting</p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Summary */}
        <div className="v-card p-5">
          <h3 className="text-base font-bold mb-4" style={{ color: 'var(--v-text)' }}>Evidence Summary</h3>
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--v-bg-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                >
                  <Camera className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Photos captured</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--v-text)' }}>5/5</span>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--v-bg-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>GPS location</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--v-success)' }}>Captured</span>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--v-bg-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}
                >
                  <List className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Checklist</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--v-text)' }}>5/5 complete</span>
            </div>

            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: 'var(--v-bg-subtle)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg"
                  style={{ backgroundColor: '#fffbeb', color: '#d97706' }}
                >
                  <AlertCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Upload size</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--v-text)' }}>~15 MB</span>
            </div>
          </div>
        </div>

        {/* Offline notice */}
        <div className="v-alert v-alert-warning">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">Offline Support</p>
            <p className="text-sm opacity-90">Evidence will cache locally and upload automatically when online.</p>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="v-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold" style={{ color: 'var(--v-text)' }}>Uploading...</span>
              <span className="text-sm font-bold" style={{ color: 'var(--v-accent)' }}>{uploadProgress}%</span>
            </div>
            <div className="v-progress-track">
              <div className="v-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* Submit */}
        {!isUploading && (
          <button onClick={handleSubmit} className="v-btn v-btn-primary w-full justify-center">
            <Upload className="w-5 h-5" />
            Submit Evidence
          </button>
        )}
      </div>
    </div>
  )
}
