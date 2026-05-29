import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, MapPin, Upload, Check, X } from 'lucide-react'

export default function EvidenceCapture() {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [photos, setPhotos] = useState<string[]>([])
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)

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

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Evidence Capture</h1>
        <p className="text-gray-600 text-sm">Capture photos and location data</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Photo Capture */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Photos</h2>
            <span className="text-sm text-gray-500">{photos.length}/5 required</span>
          </div>

          {photos.length === 0 ? (
            <div
              onClick={handleCapture}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            >
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Tap to capture photos</p>
              <p className="text-sm text-gray-500">or drag and drop</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    onClick={() => handleRemovePhoto(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <div
                  onClick={handleCapture}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center h-32"
                >
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
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
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Location</h2>
          
          {location ? (
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Location captured</p>
                  <p className="text-xs text-gray-600">
                    {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGetLocation}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors flex items-center justify-center"
            >
              <MapPin className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-gray-600">Capture GPS location</span>
            </button>
          )}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={photos.length === 0 || !location}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          Continue to Checklist
          <Upload className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
