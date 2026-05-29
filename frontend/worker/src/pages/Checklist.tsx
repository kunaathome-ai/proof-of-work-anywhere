import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronRight, Camera, FileText, AlertCircle, List } from 'lucide-react'

interface ChecklistItem {
  id: string
  text: string
  type: 'boolean' | 'text' | 'photo'
  completed: boolean
  notes?: string
}

export default function Checklist() {
  const navigate = useNavigate()
  const { jobId } = useParams()

  const [items, setItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Verify safety equipment presence', type: 'boolean', completed: false },
    { id: '2', text: 'Check emergency exits', type: 'boolean', completed: false },
    { id: '3', text: 'Document current progress', type: 'text', completed: false, notes: '' },
    { id: '4', text: 'Inspect equipment condition', type: 'boolean', completed: false },
    { id: '5', text: 'Take site overview photos', type: 'photo', completed: false },
  ])

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const updateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, notes } : item
    ))
  }

  const handleSubmit = () => {
    navigate('/summary/abc123')
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const progress = (completedCount / totalCount) * 100

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="w-4 h-4" />
      case 'photo': return <Camera className="w-4 h-4" />
      default: return <Check className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return { bg: '#faf5ff', color: '#7c3aed' }
      case 'photo': return { bg: '#eff6ff', color: '#2563eb' }
      default: return { bg: '#ecfdf5', color: '#059669' }
    }
  }

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Header */}
      <div className="v-section-header pb-10">
        <div className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <List className="w-4 h-4 opacity-70" />
            <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Job #{jobId}</span>
          </div>
          <h1>Checklist</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex-1 v-progress-track">
              <div className="v-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-bold">{completedCount}/{totalCount}</span>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 space-y-3">
        {items.map((item) => {
          const typeColor = getTypeColor(item.type)
          return (
            <div
              key={item.id}
              className="v-card p-4"
              style={{
                borderColor: item.completed ? '#a7f3d0' : 'var(--v-border)',
                backgroundColor: item.completed ? 'var(--v-success-bg)' : 'var(--v-bg-elevated)'
              }}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center justify-center w-7 h-7 rounded-full border-2 flex-shrink-0 mt-0.5 transition-all"
                  style={{
                    borderColor: item.completed ? 'var(--v-success)' : 'var(--v-border)',
                    backgroundColor: item.completed ? 'var(--v-success)' : 'transparent',
                    color: item.completed ? 'white' : 'transparent'
                  }}
                >
                  {item.completed && <Check className="w-4 h-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="flex items-center justify-center w-6 h-6 rounded-md"
                      style={{ backgroundColor: typeColor.bg, color: typeColor.color }}
                    >
                      {getTypeIcon(item.type)}
                    </div>
                    <p
                      className="text-sm font-bold"
                      style={{
                        color: item.completed ? 'var(--v-text-muted)' : 'var(--v-text)',
                        textDecoration: item.completed ? 'line-through' : 'none'
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                  {item.type === 'text' && (
                    <textarea
                      value={item.notes || ''}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      placeholder="Add notes..."
                      className="v-input text-sm"
                      rows={2}
                    />
                  )}
                  {item.type === 'photo' && (
                    <button className="v-btn v-btn-secondary text-sm py-2">
                      <Camera className="w-4 h-4" />
                      Add photo
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Validation */}
        {completedCount < totalCount && (
          <div className="v-alert v-alert-warning">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Complete all items</p>
              <p className="text-sm opacity-90">Please check all items before submitting.</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={completedCount < totalCount}
          className="v-btn w-full justify-center"
          style={{
            ...(completedCount >= totalCount
              ? { backgroundColor: 'var(--v-primary)', color: 'white', borderColor: 'var(--v-primary)' }
              : { backgroundColor: 'var(--v-bg-subtle)', color: 'var(--v-text-muted)', borderColor: 'var(--v-border-light)', cursor: 'not-allowed' }
            )
          }}
        >
          Submit Evidence
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
