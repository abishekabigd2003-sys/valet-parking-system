import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import api from '../../services/api';
import moment from 'moment';
import { ExportButton } from '../../components/ExportButton';
import { Button } from '../../components/Button';
import { RefreshCw } from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/vehicles');
        setVehicles(data);
      } catch (err) {
        console.error('Error fetching vehicles', err);
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/vehicles');
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles', err);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-themeText">Loading vehicles...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">All Vehicles</h1>
          <p className="text-themeText-secondary">View and manage all registered vehicles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={fetchVehicles} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <ExportButton data={vehicles} filename="Vehicles_Report" />
        </div>
      </div>
      
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                <th className="px-6 py-4 font-medium">Vehicle No</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Brand & Color</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {vehicles.map(v => (
                <tr key={v._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-6 py-4 font-bold text-themeText uppercase">{v.vehicleNumber}</td>
                  <td className="px-6 py-4 text-themeText-secondary">{v.vehicleType}</td>
                  <td className="px-6 py-4 text-themeText-secondary">{v.brand || '-'} <span className="text-themeText-secondary">({v.color || '-'})</span></td>
                  <td className="px-6 py-4 text-themeText-secondary">
                    <p className="text-themeText">{v.customerId?.name}</p>
                    <p className="text-xs text-themeText-secondary">{v.customerId?.mobileNumber}</p>
                  </td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">{moment(v.createdAt).format('MMM DD, YYYY')}</td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-themeText-secondary">No vehicles found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminVehicles;
