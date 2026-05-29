import { useState } from 'react'
import { Plus, CheckCircle, XCircle, Settings, HardDrive, Cloud, Server, FolderOpen, Lock, Share2 } from 'lucide-react'

export default function Storage() {
  const [storageConfigs] = useState([
    { id: 1, name: 'Default Local', type: 'local', status: 'connected', path: './storage', usage: '45%' },
    { id: 2, name: 'Production S3', type: 's3', status: 'connected', bucket: 'pow-production', usage: '78%' },
    { id: 3, name: 'Backup Azure', type: 'azure_blob', status: 'disconnected', container: 'pow-backup', usage: '0%' },
  ])

  const getStorageMeta = (type: string) => {
    switch (type) {
      case 'local':
        return { icon: HardDrive, bg: '#f8fafc', color: '#64748b', label: 'Local' }
      case 's3':
        return { icon: Cloud, bg: '#fffbeb', color: '#d97706', label: 'AWS S3' }
      case 'azure_blob':
        return { icon: Server, bg: '#eff6ff', color: '#2563eb', label: 'Azure Blob' }
      default:
        return { icon: FolderOpen, bg: '#f8fafc', color: '#64748b', label: type }
    }
  }

  const storageTypes = [
    { icon: HardDrive, label: 'Local Storage', desc: 'Filesystem-based storage for development and on-prem deployments', bg: '#f8fafc', color: '#64748b' },
    { icon: Cloud, label: 'AWS S3', desc: 'Scalable object storage with S3-compatible services', bg: '#fffbeb', color: '#d97706' },
    { icon: Server, label: 'Azure Blob', desc: 'Microsoft Azure Blob Storage integration', bg: '#eff6ff', color: '#2563eb' },
    { icon: FolderOpen, label: 'MinIO', desc: 'Self-hosted S3-compatible object storage', bg: '#faf5ff', color: '#7c3aed' },
    { icon: Lock, label: 'SFTP', desc: 'Secure file transfer protocol for legacy systems', bg: '#ecfdf5', color: '#059669' },
    { icon: Share2, label: 'SharePoint', desc: 'Microsoft SharePoint integration for enterprise', bg: '#fff1f2', color: '#e11d48' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>Storage</h1>
        <p>Manage storage backends and delivery targets</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end mb-6">
        <button className="v-btn v-btn-primary">
          <Plus className="w-4 h-4" />
          Add Storage
        </button>
      </div>

      {/* Storage List */}
      <div className="space-y-4 mb-10">
        {storageConfigs.map((config) => {
          const meta = getStorageMeta(config.type)
          const Icon = meta.icon
          const isConnected = config.status === 'connected'

          return (
            <div key={config.id} className="v-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--v-text)' }}>{config.name}</h3>
                      <span className={isConnected ? 'v-badge v-badge-success' : 'v-badge v-badge-danger'}>
                        {isConnected ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Connected
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Disconnected
                          </>
                        )}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--v-text-tertiary)' }}>{meta.label}</p>
                    <div className="flex gap-6 mt-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Location</p>
                        <p className="text-sm font-mono font-medium mt-0.5" style={{ color: 'var(--v-text)' }}>
                          {config.type === 'local' ? config.path : config.type === 's3' ? config.bucket : config.container}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--v-text-muted)' }}>Usage</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--v-text)' }}>{config.usage}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="v-btn v-btn-secondary">
                  <Settings className="w-4 h-4" />
                  Configure
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Supported Types */}
      <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--v-text)' }}>Supported Storage Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {storageTypes.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.label} className="v-card-flat p-5">
              <div className="flex items-start gap-4">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: type.bg, color: type.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--v-text)' }}>{type.label}</h4>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--v-text-tertiary)' }}>{type.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
