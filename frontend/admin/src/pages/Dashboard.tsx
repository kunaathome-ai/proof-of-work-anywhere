import { useState, useEffect } from 'react'
import { Briefcase, Users, CheckCircle, AlertTriangle, ArrowUpRight, Clock, Activity, Plus, UserPlus, FileText } from 'lucide-react'

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
    setStats({
      totalJobs: 150,
      activeJobs: 45,
      totalClients: 12,
      pendingValidations: 23
    })
  }, [])

  const statCards = [
    {
      label: 'Total Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      trend: '+12%',
      iconBg: '#eff6ff',
      iconColor: '#2563eb'
    },
    {
      label: 'Active Jobs',
      value: stats.activeJobs,
      icon: CheckCircle,
      trend: '+5%',
      iconBg: '#ecfdf5',
      iconColor: '#059669'
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      trend: '+2',
      iconBg: '#faf5ff',
      iconColor: '#7c3aed'
    },
    {
      label: 'Pending',
      value: stats.pendingValidations,
      icon: AlertTriangle,
      trend: '-3',
      iconBg: '#fffbeb',
      iconColor: '#d97706'
    }
  ]

  const activities = [
    { title: 'Job #1001 completed', detail: 'Session validation passed', time: '1h ago', status: 'success' },
    { title: 'Job #1002 in progress', detail: 'Evidence uploaded by worker', time: '2h ago', status: 'info' },
    { title: 'Job #1003 created', detail: 'New site inspection task', time: '3h ago', status: 'neutral' },
    { title: 'Client Tech Solutions', detail: 'Plan upgraded to Professional', time: '5h ago', status: 'info' },
    { title: 'Job #998 completed', detail: 'AI validation completed', time: '6h ago', status: 'success' },
  ]

  const quickActions = [
    { label: 'Create Job', description: 'Start a new verification task', icon: Plus, btn: 'accent' },
    { label: 'Add Client', description: 'Onboard a new organization', icon: UserPlus, btn: 'primary' },
    { label: 'View Reports', description: 'Access verification reports', icon: FileText, btn: 'secondary' },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="v-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your verification operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="v-card v-stat">
            <div>
              <p className="v-stat-label">{stat.label}</p>
              <p className="v-stat-value">{stat.value}</p>
              <div className="flex items-center mt-2 gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" style={{ color: 'var(--v-success)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--v-success)' }}>{stat.trend}</span>
                <span className="text-sm" style={{ color: 'var(--v-text-muted)' }}>vs last week</span>
              </div>
            </div>
            <div
              className="v-stat-icon"
              style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
            >
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity Feed */}
        <div className="lg:col-span-2 v-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="v-stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3>Recent Activity</h3>
                <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Last 24 hours</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: i % 2 === 0 ? 'var(--v-bg)' : 'transparent',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{
                    backgroundColor:
                      activity.status === 'success' ? 'var(--v-success)' :
                      activity.status === 'info' ? 'var(--v-info)' :
                      'var(--v-text-muted)'
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--v-text)' }}>{activity.title}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--v-text-tertiary)' }}>{activity.detail}</p>
                </div>
                <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--v-text-muted)' }}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="v-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="v-stat-icon" style={{ backgroundColor: '#faf5ff', color: '#7c3aed' }}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3>Quick Actions</h3>
              <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>Frequent tasks</p>
            </div>
          </div>

          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="w-full flex items-center gap-4 p-4 rounded-lg transition-all text-left"
                style={{
                  backgroundColor: 'var(--v-bg-subtle)',
                  border: '1px solid var(--v-border-light)',
                }}
              >
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                  style={{
                    backgroundColor: action.btn === 'accent' ? 'var(--v-accent)' :
                                    action.btn === 'primary' ? 'var(--v-primary)' :
                                    'var(--v-bg-elevated)',
                    color: action.btn === 'secondary' ? 'var(--v-text-tertiary)' : 'white',
                    border: action.btn === 'secondary' ? '1px solid var(--v-border)' : 'none'
                  }}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--v-text)' }}>{action.label}</p>
                  <p className="text-sm" style={{ color: 'var(--v-text-muted)' }}>{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
