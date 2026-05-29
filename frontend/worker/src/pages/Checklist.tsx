import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check, ChevronRight, Camera } from 'lucide-react'

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
    // Submit evidence and navigate to summary
    navigate('/summary/abc123')
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const progress = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">Checklist</h1>
        <div className="flex items-center mt-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="ml-3 text-sm text-gray-600">{completedCount}/{totalCount}</span>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex items-start">
              <button
                onClick={() => toggleItem(item.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                  item.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300'
                }`}
              >
                {item.completed && <Check className="w-4 h-4" />}
              </button>
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                  {item.text}
                </p>
                {item.type === 'text' && (
                  <textarea
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Add notes..."
                    className="w-full mt-2 p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={2}
                  />
                )}
                {item.type === 'photo' && (
                  <button className="mt-2 text-blue-600 text-sm font-medium flex items-center">
                    <Camera className="w-4 h-4 mr-1" />
                    Add photo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={completedCount < totalCount}
          className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-lg"
        >
          Submit Evidence
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
