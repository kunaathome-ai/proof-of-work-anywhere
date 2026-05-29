import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, MapPin, ArrowRight, Check, X, AlertCircle, ImagePlus } from 'lucide-react'

export default function EvidenceCapture() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photos, setPhotos] = useState<string[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotos(prev => [...prev, e.target?.result as string])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleContinue = () => {
    navigate(`/checklist/${jobId}`)
  }

  const canContinue = photos.length >= 1 && location

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Header */}
      <div className="v-section-header pb-10">
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-4 h-4 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Evidence Capture</span>
          </div>
          <h1>Capture Evidence</h1>
          <p className="mt-1">Photos and location data</p>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-4">
        {/* Photos */}
        <div className="v-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
              >
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--v-text)' }}>Photos</h3>
                <p className="text-xs" style={{ color: 'var(--v-text-muted)' }}>{photos.length}/5 required</p>
              </div>
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-md"
              style={{
                backgroundColor: photos.length >= 5 ? 'var(--v-success-bg)' : 'var(--v-bg-subtle)',
                color: photos.length >= 5 ? 'var(--v-success)' : 'var(--v-text-muted)'
              }}
            >
              {photos.length >= 5 ? 'Complete' : `${photos.length}/5`}
            </span>
          </div>

          {photos.length === 0 ? (
            <button
              onClick={handleCapture}
              className="w-full py-10 rounded-xl border-2 border-dashed flex flex-col items-center gap-3 transition-all"
              style={{
                borderColor: 'var(--v-border)',
                backgroundColor: 'var(--v-bg-subtle)'
              }}
            >
              <div
                className="flex items-center justify-center w-14 h-14 rounded-2xl"
                style={{ backgroundColor: 'var(--v-bg-elevated)', border: '1px solid var(--v-border)' }}
              >
                <ImagePlus className="w-6 h-6" style={{ color: 'var(--v-text-muted)' }} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm" style={{ color: 'var(--v-text-secondary)' }}>Tap to add photos</p>
                <p className="text-xs mt-1" style={{ color: 'var(--v-text-muted)' }}>Capture or upload from gallery</p>
              </div>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-36 object-cover rounded-xl"
                    style={{ border: '1px solid var(--v-border)' }}
                  />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full"
                    style={{ backgroundColor: 'var(--v-danger-bg)', color: 'var(--v-danger)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span
                    className="absolute bottom-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}
                  >
                    #{index + 1}
                  </span>
                </div>
              ))}
              {photos.length < 5 && (
                <button
                  onClick={handleCapture}
                  className="flex flex-col items-center justify-center h-36 rounded-xl border-2 border-dashed gap-2"
                  style={{
                    borderColor: 'var(--v-border)',
                    backgroundColor: 'var(--v-bg-subtle)'
                  }}
                >
                  <ImagePlus className="w-6 h-6" style={{ color: 'var(--v-text-muted)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--v-text-muted)' }}>Add photo</span>
                </button>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Location */}
        <div className="v-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold" style={{ color: 'var(--v-text)' }}>Location</h3>
          </div>

          {location ? (
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: 'var(--v-success-bg)', border: '1px solid #a7f3d0' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full"
                  style={{ backgroundColor: 'var(--v-bg-elevated)' }}
                >
                  <Check className="w-4 h-4" style={{ color: 'var(--v-success)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--v-text)' }}>Location captured</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--v-text-tertiary)' }}>
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLocation(null)}
                className="p-2 rounded-lg"
                style={{ color: 'var(--v-text-muted)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGetLocation}
              className="w-full flex items-center justify-center gap-3 p-5 rounded-xl border-2 border-dashed"
              style={{
                borderColor: 'var(--v-border)',
                backgroundColor: 'var(--v-bg-subtle)'
              }}
            >
              <MapPin className="w-5 h-5" style={{ color: 'var(--v-text-muted)' }} />
              <span className="font-semibold text-sm" style={{ color: 'var(--v-text-secondary)' }}>Capture GPS location</span>
            </button>
          )}
        </div>

        {/* Validation */}
        {!canContinue && (
          <div className="v-alert v-alert-warning">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Requirements</p>
              <p className="text-sm opacity-90">Add at least 1 photo and capture location to continue.</p>
            </div>
          </div>
        )}

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="v-btn w-full justify-center"
          style={{
            ...(canContinue
              ? { backgroundColor: 'var(--v-primary)', color: 'white', borderColor: 'var(--v-primary)' }
              : { backgroundColor: 'var(--v-bg-subtle)', color: 'var(--v-text-muted)', borderColor: 'var(--v-border-light)', cursor: 'not-allowed' }
            )
          }}
        >
          Continue to Checklist
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
