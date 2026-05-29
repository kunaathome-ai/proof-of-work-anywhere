import { useState } from 'react'
import { Save, Server, Shield, Bell } from 'lucide-react'

export default function Settings() {
  const [runtimeMode, setRuntimeMode] = useState('local')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Runtime Mode */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Server className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Runtime Mode</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Mode</label>
              <select
                value={runtimeMode}
                onChange={(e) => setRuntimeMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="local">Local Development</option>
                <option value="on_prem">On-Premises</option>
                <option value="cloud">Cloud</option>
              </select>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Local:</strong> SQLite, local filesystem, mock AI for development<br/>
                <strong>On-Prem:</strong> Postgres, MinIO, local AI inference, offline operation<br/>
                <strong>Cloud:</strong> Managed services, auto-scaling, cloud AI models
              </p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">JWT Secret</label>
              <input
                type="password"
                defaultValue="change-in-production"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">JWT Expiry</label>
              <input
                type="text"
                defaultValue="24h"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="oidc" className="mr-2" />
              <label htmlFor="oidc" className="text-sm text-gray-700">Enable OIDC Authentication</label>
            </div>
          </div>
        </div>

        {/* Observability */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Observability</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="metrics" className="mr-2" defaultChecked />
              <label htmlFor="metrics" className="text-sm text-gray-700">Enable Metrics Collection</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="tracing" className="mr-2" />
              <label htmlFor="tracing" className="text-sm text-gray-700">Enable Distributed Tracing</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="debug">Debug</option>
                <option value="info" selected>Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <Save className="w-5 h-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
