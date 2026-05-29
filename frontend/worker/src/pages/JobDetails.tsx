import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Camera, List, ArrowRight, Briefcase, Clock, Shield } from 'lucide-react'

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
    estimatedTime: '45 minutes',
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
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Header */}
      <div className="v-section-header pb-10">
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Job #{id}</span>
          </div>
          <h1>{job.title}</h1>
          <p className="mt-1">{job.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 space-y-4">
        {/* Location */}
        <div className="v-card p-5">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--v-text)' }}>Location</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>{job.location.address}</p>
              <p className="text-xs font-mono mt-1" style={{ color: 'var(--v-text-muted)' }}>
                {job.location.coordinates.lat.toFixed(4)}, {job.location.coordinates.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="v-card p-5">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--v-text)' }}>Photos Required</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>{job.requiredPhotos} photos minimum</p>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="v-card p-5">
          <div className="flex items-start gap-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--v-text)' }}>Estimated Time</h3>
              <p className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>{job.estimatedTime}</p>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="v-card p-5">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
              style={{ backgroundColor: '#fffbeb', color: '#d97706' }}
            >
              <List className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--v-text)' }}>Checklist</h3>
              <p className="text-sm" style={{ color: 'var(--v-text-tertiary)' }}>{job.checklist.length} items to complete</p>
            </div>
          </div>
          <div className="space-y-2">
            {job.checklist.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ backgroundColor: 'var(--v-bg-subtle)' }}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0"
                  style={{
                    backgroundColor: 'var(--v-bg-elevated)',
                    color: 'var(--v-text-tertiary)',
                    border: '1px solid var(--v-border)'
                  }}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="v-btn v-btn-primary w-full"
        >
          Start Evidence Capture
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
