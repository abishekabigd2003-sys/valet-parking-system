import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ExportButton } from '../../components/ExportButton';
import { RefreshCw } from 'lucide-react';
import api from '../../services/api';
import moment from 'moment';

const CustomerReports = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/parking/customer/history');
      setHistory(data || []);
    } catch {
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">My Reports</h1>
          <p className="text-themeText-secondary">View your parking history and transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchHistory} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          {history.length > 0 && <ExportButton data={history} filename="My_Parking_History" />}
        </div>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-themeBorder">
          <h3 className="text-lg font-bold text-themeText">Recent Parking History</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm uppercase tracking-wider border-b border-themeBorder">
                <th className="px-6 py-4 font-medium">Ticket #</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Slot</th>
                <th className="px-6 py-4 font-medium">Check-In</th>
                <th className="px-6 py-4 font-medium">Check-Out</th>
                <th className="px-6 py-4 font-medium">Fee</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {history.map((item) => (
                <tr key={item._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">{item.ticketNumber}</td>
                  <td className="px-6 py-4 text-themeText font-medium uppercase">
                    {item.vehicleId?.vehicleNumber}
                    <span className="block text-xs text-themeText-secondary">{item.vehicleId?.brand}</span>
                  </td>
                  <td className="px-6 py-4 text-themeText-secondary">Floor {item.slotId?.floor} - {item.slotId?.slotNumber}</td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">{moment(item.checkInTime).format('MMM DD, YYYY hh:mm A')}</td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">
                    {item.checkOutTime ? moment(item.checkOutTime).format('MMM DD, YYYY hh:mm A') : '-'}
                  </td>
                  <td className="px-6 py-4 font-bold text-themeText">₹{item.feeCalculated || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      item.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                      item.status === 'Parked' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-themeText-secondary">
                    {loading ? 'Loading history...' : 'No parking history found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CustomerReports;
