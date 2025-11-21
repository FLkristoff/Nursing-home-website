import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NeueDokumentation from './pages/NeueDokumentation';
import Historie from './pages/Historie';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import type { DocumentationEntryData } from './services/database';

type Page = 'dashboard' | 'new' | 'history' | 'users' | 'analytics';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !user) {
    return <Login onLoginSuccess={() => setCurrentPage('dashboard')} />;
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleHistoryEntryClick = (entry: DocumentationEntryData) => {
    console.log('Entry clicked:', entry);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigateToNew={() => handleNavigate('new')} />;
      case 'new':
        return <NeueDokumentation />;
      case 'history':
        return <Historie onEntryClick={handleHistoryEntryClick} />;
      case 'users':
        return user?.role === 'admin' ? <UserManagement /> : <Dashboard />;
      case 'analytics':
        return user?.role === 'admin' ? <Analytics /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
