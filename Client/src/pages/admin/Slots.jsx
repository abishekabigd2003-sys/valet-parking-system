/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import { X, Clock, CarFront, User, FileText, CheckCircle, Smartphone } from 'lucide-react';
import moment from 'moment';

const AdminSlots = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [txDetails, setTxDetails] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [liveDuration, setLiveDuration] = useState('');

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/admin/slots');
      setSlots(data);
    } catch (err) {
      console.error('Error fetching slots', err);
    }
    setLoading(false);
  };

  const seedSlots = async () => {
    try {
      await api.post('/admin/seed-slots');
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Error seeding slots');
    }
  };

  useEffect(() => {
    fetchSlots();

    socket.on('slotUpdated', (updatedSlot) => {
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot._id === updatedSlot._id ? updatedSlot : slot))
      );
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, []);

  const handleSlotClick = async (slot) => {
    setSelectedSlot(slot);
    setIsDrawerOpen(true);
    setTxDetails(null);
    setLiveDuration('');
    
    if (slot.status === 'Occupied' || slot.status === 'Reserved') {
      setTxLoading(true);
      try {
        const { data } = await api.get(`/parking/slot/${slot._id}/transaction`);
        setTxDetails(data);
      } catch (err) {
        console.error('Error fetching transaction', err);
      }
      setTxLoading(false);
    }
  };

  // Live timer effect
  useEffect(() => {
    let interval;
    if (isDrawerOpen && txDetails && txDetails.checkInTime) {
      const updateTimer = () => {
        const diff = moment().diff(moment(txDetails.checkInTime));
        const duration = moment.duration(diff);
        const hours = Math.floor(duration.asHours());
        const mins = duration.minutes();
        const secs = duration.seconds();
        setLiveDuration(`${hours}h ${mins}m ${secs}s`);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [isDrawerOpen, txDetails]);

  const handleForceCheckout = async () => {
    if (window.confirm('Are you sure you want to forcefully check out this vehicle?')) {
      try {
        await api.post(`/parking/check-out/${txDetails._id}`);
        setIsDrawerOpen(false);
        fetchSlots(); // refresh slots or let socket handle it
      } catch (err) {
        alert(err.response?.data?.message || 'Error checking out vehicle');
      }
    }
  };

  const handleRequestRetrieval = async () => {
    try {
      await api.put(`/parking/retrieve/${txDetails._id}`);
      alert('Retrieval requested successfully!');
      setIsDrawerOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting retrieval');
    }
  };

  if (loading) return <div className="text-themeText">Loading slots...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-themeText">Parking Slots</h1>
            <p className="text-themeText-secondary">Manage all parking bays and monitor availability.</p>
          </div>
          {slots.length === 0 && (
            <Button onClick={seedSlots} className="bg-primary text-black">Generate 40 Test Slots</Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {slots.map(slot => (
            <div
              key={slot._id}
              onClick={() => handleSlotClick(slot)}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 ${slot.status === 'Available' ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20' :
                  slot.status === 'Occupied' ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' :
                    'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                }`}
            >
              <span className="text-lg font-bold text-themeText">{slot.slotNumber}</span>
              <span className={`text-xs font-bold uppercase tracking-wide ${slot.status === 'Available' ? 'text-green-500' : 'text-red-500'
                }`}>{slot.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-[100] flex justify-end">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-themeBg h-full border-l border-themeBorder shadow-2xl flex flex-col transform transition-transform duration-300">
            {/* Header: fixed height 64px (h-16), border-b and shadow */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-themeBorder shadow-sm bg-themeBg-paper shrink-0">
              <h2 className="text-xl font-bold text-themeText">Slot Details</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-themeText-secondary hover:text-themeText p-2 -mr-2 rounded-lg hover:bg-themeBg-paper transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedSlot.status === 'Available' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-bold text-themeText mb-2">Slot {selectedSlot.slotNumber} is Available</h3>
                  <p className="text-themeText-secondary">This parking slot is currently available. No vehicle is parked in this slot.</p>
                </div>
              ) : txLoading ? (
                <div className="text-center py-12 text-themeText-secondary">Loading details...</div>
              ) : txDetails ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="flex items-center justify-between bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium">Status</p>
                      <p className="text-lg font-bold text-red-500 uppercase">{selectedSlot.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-themeText-secondary font-medium">Slot No.</p>
                      <p className="text-lg font-bold text-themeText">{selectedSlot.slotNumber}</p>
                    </div>
                  </div>

                  {/* Timer & Fee */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4">
                      <div className="flex items-center gap-2 text-themeText-secondary mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-primary">{liveDuration || '0h 0m 0s'}</p>
                    </div>
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4">
                      <div className="flex items-center gap-2 text-themeText-secondary mb-1">
                        <span className="text-xs font-medium uppercase tracking-wider">Current Fee</span>
                      </div>
                      <p className="text-lg font-bold text-themeText">₹{txDetails.currentFee}</p>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-themeText uppercase tracking-wider flex items-center gap-2">
                      <CarFront className="w-4 h-4 text-primary" /> Vehicle Information
                    </h4>
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-themeText-secondary">Number Plate</p>
                          <p className="text-sm font-bold text-themeText">{txDetails.vehicleId?.vehicleNumber}</p>
                        </div>
                        <div>
                          <p className="text-xs text-themeText-secondary">Type</p>
                          <p className="text-sm font-bold text-themeText">{txDetails.vehicleId?.vehicleType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-themeText-secondary">Brand / Model</p>
                          <p className="text-sm font-bold text-themeText">{txDetails.vehicleId?.brand || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-themeText-secondary">Color</p>
                          <p className="text-sm font-bold text-themeText">{txDetails.vehicleId?.color || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-themeText uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" /> Customer Details
                    </h4>
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-3">
                      <div>
                        <p className="text-xs text-themeText-secondary">Name</p>
                        <p className="text-sm font-bold text-themeText">{txDetails.customerId?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-themeText-secondary">Mobile</p>
                        <p className="text-sm font-bold text-themeText flex items-center gap-2">
                          <Smartphone className="w-3 h-3 text-themeText-secondary" />
                          {txDetails.customerId?.mobileNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Valet Info & Ticket */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-themeText uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" /> Parking Record
                    </h4>
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-4">
                      <div>
                        <p className="text-xs text-themeText-secondary">Ticket Number</p>
                        <p className="text-sm font-mono font-bold text-themeText-secondary">{txDetails.ticketNumber}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-themeText-secondary">Check-In Time</p>
                          <p className="text-sm font-bold text-themeText">{moment(txDetails.checkInTime).format('MMM DD, YYYY HH:mm')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-themeText-secondary">Assigned Valet</p>
                          <p className="text-sm font-bold text-themeText">{txDetails.valetStaffId?.name}</p>
                        </div>
                      </div>
                      
                      {txDetails.qrCodeUrl && (
                        <div className="mt-4 flex flex-col items-center p-4 bg-white rounded-xl">
                          <img src={txDetails.qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                          <p className="text-xs text-gray-600 font-bold mt-2 text-center">Scan to retrieve</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-themeText-secondary">Failed to load transaction details.</div>
              )}
            </div>
            
            {/* Action Buttons */}
            {selectedSlot.status !== 'Available' && txDetails && (
              <div className="p-6 border-t border-themeBorder bg-themeBg-paper shrink-0">
                {user?.role === 'Admin' ? (
                  <div className="space-y-3">
                    <Button onClick={handleForceCheckout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold">Force Check-Out</Button>
                    <Button variant="secondary" className="w-full">Print Ticket</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button onClick={handleRequestRetrieval} className="w-full font-bold">Request Retrieval</Button>
                    <Button variant="secondary" className="w-full">Proceed to Check-Out</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSlots;
