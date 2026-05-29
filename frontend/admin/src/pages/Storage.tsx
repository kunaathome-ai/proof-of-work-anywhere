import { useState } from 'react'
import { Plus, CheckCircle, XCircle, Settings } from 'lucide-react'

export default function Storage() {
  const [storageConfigs] = useState([
    { id: 1, name: 'Default Local', type: 'local', status: 'connected', path: './storage' },
    { id: 2, name: 'Production S3', type: 's3', status: 'connected', bucket: 'pow-production' },
    { id: 3, name: 'Backup Azure', type: 'azure_blob', status: 'disconnected', container: 'pow-backup' },
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Storage Configuration</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Storage
        </button>
      </div>

      {/* Storage Configs */}
      <div className="space-y-4">
        {storageConfigs.map((config) => (
          <div key={config.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  config.type === 'local' ? 'bg-gray-100' :
                  config.type === 's3' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{config.type.replace('_', ' ')}</p>
                  <div className="mt-2 text-sm text-gray-600">
                    {config.type === 'local' && <span>Path: {config.path}</span>}
                    {config.type === 's3' && <span>Bucket: {config.bucket}</span>}
                    {config.type === 'azure_blob' && <span>Container: {config.container}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 ${
                  config.status === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {config.status === 'connected' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-medium capitalize">{config.status}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">Configure</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Types Info */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Supported Storage Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">Local Storage</h4>
            <p className="text-sm text-gray-600 mt-1">Filesystem-based storage for development and on-prem deployments</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">AWS S3</h4>
            <p className="text-sm text-gray-600 mt-1">Scalable object storage with S3-compatible services</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">Azure Blob</h4>
            <p className="text-sm text-gray-600 mt-1">Microsoft Azure Blob Storage integration</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">MinIO</h4>
            <p className="text-sm text-gray-600 mt-1">Self-hosted S3-compatible object storage</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">SFTP</h4>
            <p className="text-sm text-gray-600 mt-1">Secure file transfer protocol for legacy systems</p>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-medium text-gray-900">SharePoint</h4>
            <p className="text-sm text-gray-600 mt-1">Microsoft SharePoint integration for enterprise</p>
          </div>
        </div>
      </div>
    </div>
  )
}
