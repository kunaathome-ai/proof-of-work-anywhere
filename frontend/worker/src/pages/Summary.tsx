import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle, Upload, Home, AlertCircle } from 'lucide-react'

export default function Summary() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = async () => {
    setIsUploading(true)
    
    // Simulate upload progress
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-4 rounded-full mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Evidence Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your evidence has been successfully uploaded and is now being validated. You will receive a confirmation once the review is complete.
            </p>
            
            <div className="w-full bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Session ID</p>
              <p className="font-mono text-sm text-gray-900">{sessionId}</p>
            </div>

            <button
              onClick={handleReturnHome}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Review & Submit</h1>
        <p className="text-gray-600 text-sm">Review your evidence before submitting</p>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Evidence Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Photos captured</span>
              </div>
              <span className="font-medium text-gray-900">5/5</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">GPS location</span>
              </div>
              <span className="font-medium text-gray-900">Captured</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-gray-700">Checklist items</span>
              </div>
              <span className="font-medium text-gray-900">5/5 completed</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                <span className="text-gray-700">Estimated upload size</span>
              </div>
              <span className="font-medium text-gray-900">~15 MB</span>
            </div>
          </div>
        </div>

        {/* Offline Notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">Offline Mode</p>
              <p className="text-sm text-orange-700 mt-1">
                Your evidence will be cached locally and uploaded automatically when you're back online.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-900">Uploading evidence...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!isUploading && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Submit Evidence
          </button>
        )}
      </div>
    </div>
  )
}
