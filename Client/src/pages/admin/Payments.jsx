import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import api from '../../services/api';
import moment from 'moment';
import { ExportButton } from '../../components/ExportButton';
import { Button } from '../../components/Button';
import { RefreshCw } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/admin/payments');
        setPayments(data);
      } catch (err) {
        console.error('Error fetching payments', err);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/payments');
      setPayments(data);
    } catch (err) {
      console.error('Error fetching payments', err);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-themeText">Loading payments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">Payments</h1>
          <p className="text-themeText-secondary">View all payment transactions.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={fetchPayments} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <ExportButton data={payments} filename="Payments_Report" />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {payments.map(payment => (
                <tr key={payment._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-themeText-secondary">{payment.transactionId?.ticketNumber || 'N/A'}</td>
                  <td className="px-6 py-4 font-bold text-themeText">{payment.transactionId?.customerId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-primary font-bold">₹{payment.amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-themeText-secondary capitalize">{payment.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      payment.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                    }`}>{payment.status}</span>
                  </td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">{moment(payment.createdAt).format('MMM DD, YYYY HH:mm')}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-themeText-secondary">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPayments;
