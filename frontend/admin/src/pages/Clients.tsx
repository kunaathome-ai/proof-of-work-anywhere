import { useState } from 'react'
import { Plus, Search, Building2, Database, Briefcase, Mail, Settings, ArrowUpRight } from 'lucide-react'

export default function Clients() {
  const [clients] = useState([
    { id: 1, name: 'Acme Corp', plan: 'enterprise', jobs: 45, storage: 'azure_blob', email: 'contact@acme.com' },
    { id: 2, name: 'Tech Solutions', plan: 'professional', jobs: 32, storage: 's3', email: 'info@techsolutions.com' },
    { id: 3, name: 'BuildCo', plan: 'starter', jobs: 18, storage: 'local', email: 'admin@buildco.com' },
  ])

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <span className="v-badge" style={{ backgroundColor: '#f0fdf4', color: '#059669' }}>Enterprise</span>
      case 'professional':
        return <span className="v-badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>Professional</span>
      case 'starter':
        return <span className="v-badge v-badge-neutral">Starter</span>
      default:
        return <span className="v-badge v-badge-neutral">{plan}</span>
    }
  }

  const getStorageIcon = (storage: string) => {
    switch (storage) {
      case 'azure_blob':
        return { bg: '#eff6ff', color: '#2563eb', label: 'Azure Blob' }
      case 's3':
        return { bg: '#fffbeb', color: '#d97706', label: 'AWS S3' }
      case 'local':
        return { bg: '#f8fafc', color: '#64748b', label: 'Local' }
      default:
        return { bg: '#f8fafc', color: '#64748b', label: storage }
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>Clients</h1>
        <p>Manage client accounts and configurations</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
          <input
            type="text"
            placeholder="Search clients..."
            className="v-input pl-10"
          />
        </div>
        <button className="v-btn v-btn-primary">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clients.map((client) => {
          const storageStyle = getStorageIcon(client.storage)
          return (
            <div key={client.id} className="v-card p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold truncate" style={{ color: 'var(--v-text)' }}>{client.name}</h3>
                    <p className="text-xs font-mono" style={{ color: 'var(--v-text-muted)' }}>ID: {client.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                {getPlanBadge(client.plan)}
              </div>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Active Jobs</span>
                  </div>
                  <span className="font-bold text-lg" style={{ color: 'var(--v-text)' }}>{client.jobs}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Storage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: storageStyle.color }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--v-text)' }}>{storageStyle.label}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--v-text-secondary)' }}>Contact</span>
                  </div>
                  <span className="text-sm" style={{ color: 'var(--v-text)' }}>{client.email}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--v-border-light)' }}>
                <button className="v-btn v-btn-secondary flex-1 justify-center text-sm">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
                <button className="v-btn v-btn-primary flex-1 justify-center text-sm">
                  <ArrowUpRight className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
