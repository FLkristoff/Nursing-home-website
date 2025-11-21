import { FileText, Clock, Zap } from 'lucide-react';

interface DashboardProps {
  onNavigateToNew?: () => void;
}

export default function Dashboard({ onNavigateToNew }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to MedDocs</h1>
        <p className="text-gray-600 mt-2">AI-powered medical documentation platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Create</h3>
          <p className="text-sm text-gray-600 mt-2">Start a new documentation entry</p>
          <button
            onClick={onNavigateToNew}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            New Documentation
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Optimization</h3>
          <p className="text-sm text-gray-600 mt-2">Automatically optimize your notes</p>
          <button
            onClick={onNavigateToNew}
            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Get Started
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">View History</h3>
          <p className="text-sm text-gray-600 mt-2">Browse past documentations</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Use the sidebar to navigate</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Write</h3>
            <p className="text-sm text-gray-600">Enter your documentation manually or via dictation</p>
          </div>
          <div>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Optimize</h3>
            <p className="text-sm text-gray-600">Our AI automatically optimizes and structures your text</p>
          </div>
          <div>
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-bold mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adjust & Export</h3>
            <p className="text-sm text-gray-600">Review, adjust, and send to your system</p>
          </div>
        </div>
      </div>
    </div>
  );
}
