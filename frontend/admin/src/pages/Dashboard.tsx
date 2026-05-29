import { useState, useEffect } from 'react'
import { Briefcase, Users, CheckCircle, AlertCircle } from 'lucide-react'

interface DashboardStats {
  totalJobs: number
  activeJobs: number
  totalClients: number
  pendingValidations: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 0,
    activeJobs: 0,
    totalClients: 0,
    pendingValidations: 0
  })

  useEffect(() => {
    // Mock data - replace with API calls
    setStats({
      totalJobs: 150,
      activeJobs: 45,
      totalClients: 12,
      pendingValidations: 23
    })
  }, [])

  const statCards = [
    {
      name: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Jobs',
      value: stats.activeJobs,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      name: 'Pending Validations',
      value: stats.pendingValidations,
      icon: AlertCircle,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-gray-900 font-medium">Job #{1000 + i} completed</p>
                <p className="text-gray-500 text-sm">Session validation passed</p>
              </div>
              <span className="text-gray-400 text-sm">{i}h ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
