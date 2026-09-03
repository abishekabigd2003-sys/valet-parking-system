import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CarFront, QrCode, Clock, MapPin, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import moment from 'moment';

const CustomerDashboard = () => {
  const [activeTickets, setActiveTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQr, setSelectedQr] = useState(null);

  const fetchActive = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/parking/customer/active');
      setActiveTickets(data || []);
    } catch {
      setActiveTickets([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActive();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">My Dashboard</h1>
          <p className="text-themeText-secondary">Welcome to your customer portal.</p>
        </div>
        <Button onClick={fetchActive} variant="secondary" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {activeTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTickets.map((ticket) => (
            <Card key={ticket._id} className="border border-primary/30 relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-primary font-bold uppercase tracking-wider">Active Ticket</span>
                    <h3 className="text-xl font-bold text-themeText mt-1">{ticket.vehicleId?.vehicleNumber}</h3>
                    <p className="text-xs text-themeText-secondary">{ticket.vehicleId?.brand} {ticket.vehicleId?.color}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold uppercase">
                    {ticket.status}
                  </span>
                </div>

                <div className="bg-themeBg-paper p-3 rounded-lg border border-themeBorder space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-themeText-secondary">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Slot: <strong>Floor {ticket.slotId?.floor} - {ticket.slotId?.slotNumber}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-themeText-secondary">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Parked: {moment(ticket.checkInTime).format('MMM DD, hh:mm A')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-themeBorder flex gap-2">
                {ticket.qrCodeUrl && (
                  <Button 
                    onClick={() => setSelectedQr(ticket)} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" /> View QR Code
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center justify-center p-12 text-center group border-primary/20">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CarFront className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-themeText mb-2">My Vehicles</h2>
            <p className="text-themeText-secondary text-sm">
              {loading ? 'Checking for active sessions...' : 'You have no active parking sessions at the moment.'}
            </p>
          </Card>
        </div>
      )}

      {/* QR Code Modal */}
      {selectedQr && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelectedQr(null)}>
          <Card className="max-w-sm w-full text-center p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-themeText">Parking Ticket QR</h3>
            <p className="text-xs text-themeText-secondary">{selectedQr.ticketNumber}</p>
            <img src={selectedQr.qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto bg-white p-2 rounded-lg" />
            <p className="text-xs text-themeText-secondary">Show this QR code at checkout to retrieve your vehicle.</p>
            <Button onClick={() => setSelectedQr(null)} className="w-full">Close</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
