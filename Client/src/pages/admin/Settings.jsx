import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import api from '../../services/api';

const AdminSettings = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const { data } = await api.get('/admin/tariffs');
        setTariffs(data);
      } catch (err) {
        console.error('Error fetching tariffs', err);
      }
      setLoading(false);
    };
    fetchTariffs();
  }, []);

  if (loading) return <div className="text-themeText">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-themeText">Settings</h1>
          <p className="text-themeText-secondary">Manage master data, tariffs, and system configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-themeText">Tariff / Pricing</h3>
            <Button variant="secondary" className="text-sm">Edit Pricing</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                  <th className="px-6 py-4 font-medium">Vehicle Type</th>
                  <th className="px-6 py-4 font-medium">Hourly Rate (₹)</th>
                  <th className="px-6 py-4 font-medium">Daily Max (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-themeBorder">
                {tariffs.map(tariff => (
                  <tr key={tariff._id} className="hover:bg-themeBg transition-colors">
                    <td className="px-6 py-4 font-bold text-themeText">{tariff.vehicleType}</td>
                    <td className="px-6 py-4 text-primary font-bold">₹{tariff.hourlyRate}</td>
                    <td className="px-6 py-4 text-themeText-secondary">₹{tariff.dailyRate}</td>
                  </tr>
                ))}
                {tariffs.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-themeText-secondary">
                      No tariffs configured. Run seed script or add manually.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-themeText mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
              <div>
                <p className="font-bold text-themeText">Auto-assign Parking Slots</p>
                <p className="text-sm text-themeText-secondary">Automatically assign the nearest available slot during check-in.</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-gray-900 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
              <div>
                <p className="font-bold text-themeText">Enable Digital Receipts</p>
                <p className="text-sm text-themeText-secondary">Send SMS/Email receipts to customers upon checkout.</p>
              </div>
              <div className="w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
