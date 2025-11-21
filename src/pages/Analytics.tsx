import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalEntries: number;
  totalValue: number;
  averageOptimization: number;
  totalUsers: number;
  entriesByStatus: { draft: number; final: number };
  entriesByLevel: { standard: number; extended: number; maximum: number };
  topPatients: Array<{ name: string; count: number }>;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);

    try {
      const [entriesRes, usersRes] = await Promise.all([
        supabase.from('documentation_entries').select('*'),
        supabase.from('user_profiles').select('*'),
      ]);

      const entries = entriesRes.data || [];
      const users = usersRes.data || [];

      const totalValue = entries.reduce((sum, e) => sum + (e.value_after || 0), 0);
      const totalOptimization = entries.reduce((sum, e) => {
        const before = e.value_before || 0;
        const after = e.value_after || 0;
        return sum + (after - before);
      }, 0);

      const avgOptimization = entries.length > 0 ? totalOptimization / entries.length : 0;

      const entriesByStatus = {
        draft: entries.filter((e) => e.status === 'draft').length,
        final: entries.filter((e) => e.status === 'final').length,
      };

      const entriesByLevel = {
        standard: entries.filter((e) => e.optimization_level === 'standard').length,
        extended: entries.filter((e) => e.optimization_level === 'extended').length,
        maximum: entries.filter((e) => e.optimization_level === 'maximum').length,
      };

      const patientCounts: { [key: string]: number } = {};
      entries.forEach((e) => {
        patientCounts[e.patient_name] = (patientCounts[e.patient_name] || 0) + 1;
      });

      const topPatients = Object.entries(patientCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setData({
        totalEntries: entries.length,
        totalValue,
        averageOptimization: avgOptimization,
        totalUsers: users.length,
        entriesByStatus,
        entriesByLevel,
        topPatients,
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load analytics</p>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtitle,
  }: {
    icon: React.ComponentType<{ className: string }>;
    label: string;
    value: string | number;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">System-wide statistics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={FileText} label="Total Entries" value={data.totalEntries} />
        <StatCard
          icon={DollarSign}
          label="Total Value"
          value={`CHF ${data.totalValue.toFixed(2)}`}
        />
        <StatCard
          icon={TrendingUp}
          label="Avg Optimization"
          value={`CHF ${data.averageOptimization.toFixed(2)}`}
        />
        <StatCard icon={Users} label="Total Users" value={data.totalUsers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Entries by Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Draft</span>
              <div className="flex items-center gap-2">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{
                      width: `${
                        data.totalEntries > 0
                          ? (data.entriesByStatus.draft / data.totalEntries) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {data.entriesByStatus.draft}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Final</span>
              <div className="flex items-center gap-2">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        data.totalEntries > 0
                          ? (data.entriesByStatus.final / data.totalEntries) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {data.entriesByStatus.final}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Entries by Optimization Level
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Standard', value: data.entriesByLevel.standard, color: 'bg-blue-500' },
              { label: 'Extended', value: data.entriesByLevel.extended, color: 'bg-purple-500' },
              { label: 'Maximum', value: data.entriesByLevel.maximum, color: 'bg-indigo-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full`}
                      style={{
                        width: `${
                          data.totalEntries > 0
                            ? (item.value / data.totalEntries) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Patients</h2>
          <div className="space-y-3">
            {data.topPatients.length === 0 ? (
              <p className="text-gray-500 text-sm">No data available</p>
            ) : (
              data.topPatients.map((patient, index) => (
                <div key={patient.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-900">{patient.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{patient.count} entries</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
