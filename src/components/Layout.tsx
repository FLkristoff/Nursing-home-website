import { useState } from 'react';
import { Menu, X, LogOut, Settings, Users, FileText, Clock, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      showToast('Logged out successfully', 'success');
    } catch (error) {
      showToast('Failed to logout', 'error');
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, show: true },
    { id: 'new', label: 'New Documentation', icon: FileText, show: true },
    { id: 'history', label: 'History', icon: Clock, show: true },
    { id: 'users', label: 'User Management', icon: Users, show: user?.role === 'admin' },
    { id: 'analytics', label: 'Analytics', icon: Settings, show: user?.role === 'admin' },
  ];

  const visibleItems = navigationItems.filter((item) => item.show);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">MedDocs</h1>
            <p className="text-xs text-gray-500 mt-1">Documentation Platform</p>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="px-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                Account
              </p>
              <p className="text-sm font-medium text-gray-900 mt-2">{user?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1 lg:flex-none">
            <h2 className="text-lg font-semibold text-gray-900 text-center lg:text-left">
              {navigationItems.find((item) => item.id === currentPage)?.label}
            </h2>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <p className="text-sm text-gray-600">{user?.full_name}</p>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
