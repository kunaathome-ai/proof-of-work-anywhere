import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Camera, List, ArrowRight } from 'lucide-react'

export default function JobDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const job = {
    id,
    title: 'Site Inspection - Downtown Project',
    description: 'Complete a comprehensive site inspection including safety checks, equipment verification, and progress documentation.',
    location: {
      address: '123 Main St, Downtown',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    requiredPhotos: 5,
    checklist: [
      'Verify safety equipment presence',
      'Check emergency exits',
      'Document current progress',
      'Inspect equipment condition',
      'Take site overview photos'
    ]
  }

  const handleStart = () => {
    navigate(`/evidence/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 pb-12">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
        <p className="text-blue-100">{job.description}</p>
      </div>

      {/* Content */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Location */}
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-lg mr-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{job.location.address}</p>
              <p className="text-sm text-gray-500 mt-1">
                {job.location.coordinates.lat.toFixed(4)}, {job.location.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="flex items-start">
            <div className="bg-green-100 p-3 rounded-lg mr-4">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Photos Required</h3>
              <p className="text-gray-600">{job.requiredPhotos} photos</p>
            </div>
          </div>

          {/* Checklist Preview */}
          <div className="flex items-start">
            <div className="bg-purple-100 p-3 rounded-lg mr-4">
              <List className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Checklist Items</h3>
              <ul className="space-y-2">
                {job.checklist.map((item, index) => (
                  <li key={index} className="text-gray-600 text-sm flex items-center">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs font-medium">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full mt-6 bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center text-lg"
        >
          Start Evidence Capture
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
