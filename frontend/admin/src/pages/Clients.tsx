import { useState } from 'react'
import { Plus, Search } from 'lucide-react'

export default function Clients() {
  const [clients] = useState([
    { id: 1, name: 'Acme Corp', plan: 'enterprise', jobs: 45, storage: 'azure_blob' },
    { id: 2, name: 'Tech Solutions', plan: 'professional', jobs: 32, storage: 's3' },
    { id: 3, name: 'BuildCo', plan: 'starter', jobs: 18, storage: 'local' },
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-500">#{client.id}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                client.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                client.plan === 'professional' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {client.plan}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Jobs</span>
                <span className="font-medium text-gray-900">{client.jobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage</span>
                <span className="font-medium text-gray-900">{client.storage}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button className="flex-1 text-blue-600 hover:text-blue-900 text-sm font-medium">View Details</button>
              <button className="flex-1 text-gray-600 hover:text-gray-900 text-sm font-medium">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
