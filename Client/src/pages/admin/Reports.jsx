import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExportButton } from '../../components/ExportButton';
import { RefreshCw } from 'lucide-react';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats', err);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-themeText">Loading reports...</div>;

  const occupancyData = [
    { name: 'Occupied', value: stats?.occupiedSlots || 0 },
    { name: 'Available', value: stats?.availableSlots || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-themeText">Reports & Analytics</h1>
          <p className="text-themeText-secondary">View detailed reports on occupancy, revenue, and entries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchStats} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <ExportButton data={stats?.recentTransactions || []} filename="Recent_Transactions" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-themeText mb-6">Occupancy Report</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-themeText mb-6">Revenue Summary</h3>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <p className="text-themeText-secondary mb-2">Total Revenue Collected</p>
            <h2 className="text-5xl font-black text-primary">₹{(stats?.revenue || 0).toLocaleString('en-IN')}</h2>
            <p className="text-sm text-green-500 mt-4">+12% from last month</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-themeText mb-6">Recent Vehicle Entries / Exits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Vehicle</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {stats?.recentTransactions?.map(tx => (
                <tr key={tx._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-themeText-secondary">{tx.ticketNumber}</td>
                  <td className="px-4 py-3 text-themeText font-bold">{tx.vehicleId?.licensePlate}</td>
                  <td className="px-4 py-3 text-themeText-secondary">{tx.customerId?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      tx.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>{tx.status}</span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-themeText-secondary">No recent transactions.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;
