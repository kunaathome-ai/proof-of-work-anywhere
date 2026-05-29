import { useState } from 'react'
import { Search, Filter, Briefcase, MapPin, Eye, Pencil, Trash2, Plus } from 'lucide-react'

export default function Jobs() {
  const [jobs] = useState([
    { id: 1, title: 'Site Inspection - Downtown', client: 'Acme Corp', status: 'active', created: '2024-01-15', location: '123 Main St, Downtown' },
    { id: 2, title: 'Equipment Verification', client: 'Tech Solutions', status: 'completed', created: '2024-01-14', location: '456 Tech Ave' },
    { id: 3, title: 'Safety Audit', client: 'BuildCo', status: 'draft', created: '2024-01-13', location: '789 Construction Blvd' },
    { id: 4, title: 'Progress Check', client: 'Acme Corp', status: 'active', created: '2024-01-12', location: '123 Main St, Downtown' },
    { id: 5, title: 'Final Review', client: 'Tech Solutions', status: 'completed', created: '2024-01-11', location: '456 Tech Ave' },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="v-badge v-badge-info">Active</span>
      case 'completed':
        return <span className="v-badge v-badge-success">Completed</span>
      case 'draft':
        return <span className="v-badge v-badge-neutral">Draft</span>
      default:
        return <span className="v-badge v-badge-neutral">{status}</span>
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>Jobs</h1>
        <p>Manage verification jobs and tasks</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--v-text-muted)' }} />
          <input
            type="text"
            placeholder="Search jobs..."
            className="v-input pl-10"
          />
        </div>
        <div className="flex gap-3">
          <button className="v-btn v-btn-secondary">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="v-btn v-btn-primary">
            <Plus className="w-4 h-4" />
            Create Job
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="v-card overflow-hidden">
        <table className="v-table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Client</th>
              <th>Location</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}
                    >
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--v-text)' }}>{job.title}</p>
                      <p className="text-xs font-mono" style={{ color: 'var(--v-text-muted)' }}>#{job.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="font-medium text-sm" style={{ color: 'var(--v-text)' }}>{job.client}</span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--v-text-muted)' }} />
                    <span className="text-sm" style={{ color: 'var(--v-text-secondary)' }}>{job.location}</span>
                  </div>
                </td>
                <td>{getStatusBadge(job.status)}</td>
                <td>
                  <span className="text-sm font-mono" style={{ color: 'var(--v-text-secondary)' }}>{job.created}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button className="v-btn v-btn-ghost p-2">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="v-btn v-btn-ghost p-2">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="v-btn v-btn-ghost p-2" style={{ color: 'var(--v-danger)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
