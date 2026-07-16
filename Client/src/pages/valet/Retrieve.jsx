import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { Search, CreditCard, CheckCircle, QrCode } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import moment from 'moment';
import { useEffect } from 'react';

const ValetRetrieve = () => {
  const [query, setQuery] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      scanner.render(
        (decodedText) => {
          setQuery(decodedText);
          setScanning(false);
          scanner.clear();
          // Automatically trigger search
          triggerSearch(decodedText);
        },
        () => {
          // parse error, ignore
        }
      );
    }
    return () => {
      if (scanner) {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    };
  }, [scanning]);

  async function triggerSearch(searchQuery) {
    setLoading(true);
    setError('');
    setTransaction(null);
    try {
      const { data } = await api.get(`/parking/search?q=${searchQuery}`);
      setTransaction(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction not found');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    triggerSearch(query);
  };

  const handleRetrieve = async () => {
    try {
      const { data } = await api.post(`/parking/check-out/${transaction._id}`);
      setTransaction(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to checkout');
    }
  };

  const handlePayment = async () => {
    try {
      await api.post(`/payments/process`, {
        transactionId: transaction._id,
        amount: transaction.feeCalculated,
        paymentMethod: paymentMode
      });
      // Refresh transaction state
      const { data } = await api.get(`/parking/search?q=${transaction.ticketNumber}`);
      setTransaction(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Parked': return <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Parked</span>;
      case 'RetrievalRequested': return <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Retrieval Requested</span>;
      case 'Retrieved': return <span className="bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending Payment</span>;
      case 'Completed': return <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Completed</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-themeText">Retrieve Vehicle</h1>
        <p className="text-themeText-secondary">Search by ticket number or vehicle number to initiate checkout.</p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Enter Ticket # or Vehicle #" 
              className="pl-10" 
              required 
            />
          </div>
          <Button type="submit" className="bg-primary text-black whitespace-nowrap" disabled={loading}>
            {loading ? 'Searching...' : 'Search Record'}
          </Button>
          <Button type="button" onClick={() => setScanning(!scanning)} className="bg-gray-800 text-white whitespace-nowrap flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            {scanning ? 'Cancel Scan' : 'Scan QR Code'}
          </Button>
        </form>
        {scanning && (
          <div className="mt-6 bg-white p-4 rounded-xl">
            <div id="qr-reader" className="w-full max-w-sm mx-auto text-black"></div>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </Card>

      {transaction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="space-y-6">
            <div className="flex justify-between items-center border-b border-themeBorder pb-4">
              <h3 className="text-xl font-bold text-themeText">Ticket Info</h3>
              {getStatusBadge(transaction.status)}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Ticket Number</p>
                <p className="text-xl font-bold text-primary">{transaction.ticketNumber}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-themeText-secondary text-sm">Customer</p>
                  <p className="text-themeText font-medium">{transaction.customerId?.name}</p>
                  <p className="text-themeText-secondary text-sm">{transaction.customerId?.mobileNumber}</p>
                </div>
                <div>
                  <p className="text-themeText-secondary text-sm">Vehicle</p>
                  <p className="text-themeText font-medium uppercase">{transaction.vehicleId?.vehicleNumber}</p>
                  <p className="text-themeText-secondary text-sm">{transaction.vehicleId?.brand} - {transaction.vehicleId?.color}</p>
                </div>
              </div>

              <div>
                <p className="text-themeText-secondary text-sm">Parking Slot</p>
                <p className="text-themeText font-medium">Floor {transaction.slotId?.floor} - {transaction.slotId?.slotNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-themeText-secondary text-sm">Check-In Time</p>
                  <p className="text-themeText font-medium">{moment(transaction.checkInTime).format('DD MMM YYYY, hh:mm A')}</p>
                </div>
                <div>
                  <p className="text-themeText-secondary text-sm">Check-Out Time</p>
                  <p className="text-themeText font-medium">
                    {transaction.checkOutTime ? moment(transaction.checkOutTime).format('DD MMM YYYY, hh:mm A') : moment().format('DD MMM YYYY, hh:mm A')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-themeText-secondary text-sm">Parking Duration</p>
                  <p className="text-themeText font-medium">
                    {(() => {
                      const end = transaction.checkOutTime ? moment(transaction.checkOutTime) : moment();
                      const start = moment(transaction.checkInTime);
                      const duration = moment.duration(end.diff(start));
                      return `${Math.floor(duration.asHours())} Hours ${duration.minutes()} Minutes`;
                    })()}
                  </p>
                </div>
                <div>
                  <p className="text-themeText-secondary text-sm">Handled By</p>
                  <p className="text-themeText font-medium">{transaction.valetStaffId?.name || 'Valet Staff'}</p>
                </div>
              </div>
            </div>

            {transaction.status === 'Parked' || transaction.status === 'RetrievalRequested' ? (
              <Button onClick={handleRetrieve} className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4">
                Mark as Retrieved & Calculate Fee
              </Button>
            ) : null}
          </Card>

          {(transaction.status === 'Retrieved' || transaction.status === 'Completed') && (
            <Card className="space-y-6 flex flex-col">
              <div className="flex justify-between items-center border-b border-themeBorder pb-4">
                <h3 className="text-xl font-bold text-themeText">Payment Summary</h3>
                <CreditCard className="w-5 h-5 text-themeText-secondary" />
              </div>

              <div className="flex-1 flex flex-col justify-center items-center py-8">
                <p className="text-themeText-secondary mb-2">Total Fee</p>
                <h2 className="text-5xl font-bold text-themeText">₹{transaction.feeCalculated.toLocaleString('en-IN')}</h2>
              </div>

              {transaction.status === 'Retrieved' && transaction.paymentStatus === 'Pending' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-themeText-secondary mb-1.5 block">Payment Method</label>
                    <select 
                      value={paymentMode} 
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full bg-themeBg-paper border border-themeBorder rounded-lg px-4 py-2.5 text-themeText focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Card">Credit / Debit Card</option>
                      <option value="UPI">UPI / Digital Wallet</option>
                    </select>
                  </div>
                  <Button onClick={handlePayment} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Confirm Payment
                  </Button>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex flex-col items-center justify-center text-green-500">
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <p className="font-bold">Payment Completed</p>
                  <p className="text-sm mt-2 text-center text-green-400">Transaction is fully completed. Vehicle returned to owner.</p>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ValetRetrieve;
