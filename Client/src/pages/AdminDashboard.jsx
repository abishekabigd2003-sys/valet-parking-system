import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import api from '../services/api';
import socket from '../services/socket';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableSlots: 0,
    occupiedSlots: 0,
    revenue: 0,
    recentTransactions: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats', err);
      }
    };
    fetchStats();

    socket.on('statsUpdated', () => {
      fetchStats();
    });

    return () => {
      socket.off('statsUpdated');
    };
  }, []);

  // Mock data for the chart to show revenue trend
  const data = [
    { name: 'Mon', revenue: 400 },
    { name: 'Tue', revenue: 300 },
    { name: 'Wed', revenue: 550 },
    { name: 'Thu', revenue: 450 },
    { name: 'Fri', revenue: 700 },
    { name: 'Sat', revenue: 1200 },
    { name: 'Sun', revenue: 1500 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-themeText mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <h3 className="text-blue-400 font-medium">Total Vehicles Parked</h3>
          <p className="text-3xl font-bold mt-2 text-themeText">{stats.totalVehicles}</p>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <h3 className="text-green-400 font-medium">Available Slots</h3>
          <p className="text-3xl font-bold mt-2 text-themeText">{stats.availableSlots}</p>
        </Card>
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <h3 className="text-yellow-400 font-medium">Occupied Slots</h3>
          <p className="text-3xl font-bold mt-2 text-themeText">{stats.occupiedSlots}</p>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/20">
          <h3 className="text-purple-400 font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2 text-themeText">₹{stats.revenue.toLocaleString('en-IN')}</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-themeText mb-6">Revenue Trend (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#FFC107' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FFC107" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <h3 className="text-lg font-bold text-themeText mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats.recentTransactions.map((tx) => (
              <div key={tx._id} className="flex justify-between items-center pb-4 border-b border-themeBorder last:border-0 last:pb-0">
                <div>
                  <p className="text-themeText font-medium">{tx.vehicleId?.vehicleNumber}</p>
                  <p className="text-xs text-themeText-secondary">{tx.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{tx.ticketNumber}</p>
                </div>
              </div>
            ))}
            {stats.recentTransactions.length === 0 && (
              <p className="text-themeText-secondary text-sm">No recent transactions.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
