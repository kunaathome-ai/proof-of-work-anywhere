import { useState } from 'react'
import { Plus, Brain, CheckCircle, Settings, Play, DollarSign, Zap, Cpu } from 'lucide-react'

export default function AI() {
  const [models] = useState([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'multimodal', status: 'active', costPerToken: 0.000005, requests: 15420 },
    { id: 'azure-gpt-4o', name: 'Azure GPT-4o', provider: 'azure_openai', type: 'multimodal', status: 'active', costPerToken: 0.000005, requests: 8932 },
    { id: 'mock', name: 'Mock AI', provider: 'local', type: 'multimodal', status: 'active', costPerToken: 0, requests: 2105 },
  ])

  const getProviderMeta = (provider: string) => {
    switch (provider) {
      case 'openai':
        return { bg: '#ecfdf5', color: '#059669', label: 'OpenAI' }
      case 'azure_openai':
        return { bg: '#eff6ff', color: '#2563eb', label: 'Azure OpenAI' }
      case 'local':
        return { bg: '#faf5ff', color: '#7c3aed', label: 'Local' }
      default:
        return { bg: '#f8fafc', color: '#64748b', label: provider }
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>AI Models</h1>
        <p>Configure models and validation settings</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end mb-6">
        <button className="v-btn v-btn-primary">
          <Plus className="w-4 h-4" />
          Add Model
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {models.map((model) => {
          const meta = getProviderMeta(model.provider)
          return (
            <div key={model.id} className="v-card p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl"
                    style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}
                  >
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--v-text)' }}>{model.name}</h3>
                    <span className="v-badge v-badge-success">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-md"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Type</span>
                  </div>
                  <span className="text-sm font-semibold capitalize" style={{ color: 'var(--v-text)' }}>{model.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Cost / token</span>
                  </div>
                  <span className="text-sm font-semibold font-mono" style={{ color: 'var(--v-text)' }}>${model.costPerToken.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Requests</span>
                  </div>
                  <span className="text-sm font-semibold font-mono" style={{ color: 'var(--v-text)' }}>{model.requests.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--v-border-light)' }}>
                <button className="v-btn v-btn-secondary flex-1 justify-center text-sm">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                <button className="v-btn v-btn-primary flex-1 justify-center text-sm">
                  <Play className="w-4 h-4" />
                  Test
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Configuration */}
      <div className="v-card p-8">
        <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--v-text)' }}>Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--v-text)' }}>Default Model</label>
              <select className="v-input">
                <option value="gpt-4o">GPT-4o</option>
                <option value="azure-gpt-4o">Azure GPT-4o</option>
                <option value="mock">Mock AI (Development)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--v-text)' }}>Confidence Threshold</label>
              <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
              <div className="flex justify-between text-xs font-semibold mt-2" style={{ color: 'var(--v-text-muted)' }}>
                <span>0%</span>
                <span style={{ color: 'var(--v-accent)' }}>70%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: 'var(--v-text)' }}>Rate Limit (req/min)</label>
              <input type="number" defaultValue="60" className="v-input" />
            </div>
            <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--v-bg-subtle)' }}>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-teal-600" />
              <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Enable AI response caching</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
