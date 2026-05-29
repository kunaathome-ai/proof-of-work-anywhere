import { useState } from 'react'
import { Plus, Brain, Zap, CheckCircle } from 'lucide-react'

export default function AI() {
  const [models] = useState([
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', type: 'multimodal', status: 'active', costPerToken: 0.000005 },
    { id: 'azure-gpt-4o', name: 'Azure GPT-4o', provider: 'azure_openai', type: 'multimodal', status: 'active', costPerToken: 0.000005 },
    { id: 'mock', name: 'Mock AI', provider: 'local', type: 'multimodal', status: 'active', costPerToken: 0 },
  ])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Models</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Model
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {models.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{model.provider.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-1" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900 capitalize">{model.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Cost/Token</span>
                <span className="font-medium text-gray-900">${model.costPerToken}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button className="flex-1 text-blue-600 hover:text-blue-900 text-sm font-medium">Configure</button>
              <button className="flex-1 text-gray-600 hover:text-gray-900 text-sm font-medium">Test</button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Configuration */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Model</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="gpt-4o">GPT-4o</option>
              <option value="azure-gpt-4o">Azure GPT-4o</option>
              <option value="mock">Mock AI (Development)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Confidence Threshold</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0%</span>
              <span>70%</span>
              <span>100%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limiting (requests/minute)</label>
            <input
              type="number"
              defaultValue="60"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="caching" className="mr-2" defaultChecked />
            <label htmlFor="caching" className="text-sm text-gray-700">Enable AI response caching</label>
          </div>
        </div>
      </div>
    </div>
  )
}
