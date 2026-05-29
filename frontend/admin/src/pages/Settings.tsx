import { useState } from 'react'
import { Save, Server, Shield, Bell, Database, Cloud, Lock, Activity } from 'lucide-react'

export default function Settings() {
  const [runtimeMode, setRuntimeMode] = useState('local')

  const modes = [
    { id: 'local', label: 'Local Development', icon: Database, desc: 'SQLite, local filesystem, mock AI' },
    { id: 'on_prem', label: 'On-Premises', icon: Server, desc: 'Postgres, MinIO, local AI inference' },
    { id: 'cloud', label: 'Cloud', icon: Cloud, desc: 'Managed services, auto-scaling' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>Settings</h1>
        <p>Configure system preferences and environment</p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Runtime Mode */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="v-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3>Runtime Mode</h3>
              <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Select your deployment environment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {modes.map((mode) => {
              const Icon = mode.icon
              const isSelected = runtimeMode === mode.id
              return (
                <button
                  key={mode.id}
                  onClick={() => setRuntimeMode(mode.id)}
                  className="text-left p-5 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: isSelected ? 'var(--v-accent)' : 'var(--v-border-light)',
                    backgroundColor: isSelected ? 'rgba(13, 148, 136, 0.05)' : 'var(--v-bg-elevated)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-lg"
                      style={{
                        backgroundColor: isSelected ? 'var(--v-accent)' : 'var(--v-bg-subtle)',
                        color: isSelected ? 'white' : 'var(--v-text-tertiary)',
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm" style={{ color: isSelected ? 'var(--v-text)' : 'var(--v-text-secondary)' }}>
                      {mode.label}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>{mode.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Security */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="v-stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3>Security</h3>
              <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Authentication and access control</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>JWT Secret</label>
              <input type="password" defaultValue="change-in-production" className="v-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>Token Expiry</label>
              <input type="text" defaultValue="24h" className="v-input" />
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <label className="flex items-center gap-3 p-4 rounded-lg flex-1 cursor-pointer" style={{ backgroundColor: 'var(--v-bg-subtle)' }}>
              <input type="checkbox" className="w-5 h-5 rounded accent-teal-600" />
              <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Enable OIDC Authentication</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-lg flex-1 cursor-pointer" style={{ backgroundColor: 'var(--v-bg-subtle)' }}>
              <input type="checkbox" className="w-5 h-5 rounded accent-teal-600" />
              <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Require Multi-Factor Auth</span>
            </label>
          </div>
        </div>

        {/* Observability */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="v-stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3>Observability</h3>
              <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Monitoring and logging configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>Log Level</label>
              <select className="v-input">
                <option value="debug">Debug</option>
                <option value="info" selected>Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--v-text)' }}>Retention (days)</label>
              <input type="number" defaultValue="30" className="v-input" />
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <label className="flex items-center gap-3 p-4 rounded-lg flex-1 cursor-pointer" style={{ backgroundColor: 'var(--v-bg-subtle)' }}>
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-teal-600" />
              <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Collect Metrics</span>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-lg flex-1 cursor-pointer" style={{ backgroundColor: 'var(--v-bg-subtle)' }}>
              <input type="checkbox" className="w-5 h-5 rounded accent-teal-600" />
              <span className="text-sm font-medium" style={{ color: 'var(--v-text)' }}>Distributed Tracing</span>
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button className="v-btn v-btn-primary">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
