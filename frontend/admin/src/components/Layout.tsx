import { Link, useLocation } from 'react-router-dom'
import { Layout as LayoutIcon, Home, Briefcase, Users, Database, Brain, Settings, LogOut, Shield } from 'lucide-react'

const Layout = ({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Storage', href: '/storage', icon: Database },
    { name: 'AI Models', href: '/ai', icon: Brain },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--v-bg)' }}>
      {/* Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 w-64 flex flex-col"
        style={{
          backgroundColor: 'var(--v-primary)',
          borderRight: '1px solid var(--v-primary-light)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-6"
          style={{
            borderBottom: '1px solid var(--v-primary-light)',
          }}
        >
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg mr-3"
            style={{ backgroundColor: 'var(--v-accent)' }}
          >
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">Veriforge</span>
            <span className="block text-xs font-medium" style={{ color: 'var(--v-accent-muted)' }}>
              Admin Console
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group"
                style={{
                  color: isActive ? 'white' : 'var(--v-text-muted)',
                  backgroundColor: isActive ? 'var(--v-primary-light)' : 'transparent',
                }}
              >
                <item.icon
                  className="w-5 h-5 mr-3 transition-colors"
                  style={{ color: isActive ? 'var(--v-accent-muted)' : 'var(--v-text-tertiary)' }}
                />
                {item.name}
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--v-accent)' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div
          className="px-3 pb-4"
          style={{ borderTop: '1px solid var(--v-primary-light)' }}
        >
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ color: 'var(--v-text-muted)' }}
          >
            <LogOut className="w-5 h-5 mr-3" style={{ color: 'var(--v-text-tertiary)' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  )
}

export default Layout
