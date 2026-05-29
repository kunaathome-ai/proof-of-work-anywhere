import { Link, useLocation } from 'react-router-dom'
import { Layout as LayoutIcon, Home, Briefcase, Users, Database, Brain, Settings } from 'lucide-react'

const Layout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <LayoutIcon className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">POW Admin</span>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  isActive ? 'bg-gray-800 text-white border-r-4 border-blue-500' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}

export default Layout
