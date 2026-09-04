import { useEffect, useState } from 'react';
import { Button } from '../../components/Button';
import api from '../../services/api';
import socket from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Clock, 
  CarFront, 
  User, 
  FileText, 
  CheckCircle, 
  Smartphone, 
  AlertTriangle, 
  Wrench, 
  RefreshCw,
  Layers,
  Filter,
  ArrowRight
} from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const AdminSlots = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Drawer state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [txDetails, setTxDetails] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [liveDuration, setLiveDuration] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/admin/slots');
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching slots', err);
      setError(err.response?.data?.message || err.message || 'Error loading parking slots');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const seedSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/seed-slots');
      if (data.slots && Array.isArray(data.slots)) {
        setSlots(data.slots);
      } else {
        fetchSlots();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error seeding slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();

    socket.on('slotUpdated', (updatedSlot) => {
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot._id === updatedSlot._id ? updatedSlot : slot))
      );
      if (selectedSlot && selectedSlot._id === updatedSlot._id) {
        setSelectedSlot(updatedSlot);
      }
    });

    return () => {
      socket.off('slotUpdated');
    };
  }, [selectedSlot]);

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
        console.warn('No active transaction record found for slot', err?.response?.data?.message);
        setTxDetails(null);
      } finally {
        setTxLoading(false);
      }
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
    if (!txDetails) return;
    if (window.confirm('Are you sure you want to forcefully check out this vehicle?')) {
      setActionLoading(true);
      try {
        await api.post(`/parking/check-out/${txDetails._id}`);
        setIsDrawerOpen(false);
        fetchSlots();
      } catch (err) {
        alert(err.response?.data?.message || 'Error checking out vehicle');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRequestRetrieval = async () => {
    if (!txDetails) return;
    setActionLoading(true);
    try {
      await api.put(`/parking/retrieve/${txDetails._id}`);
      alert('Retrieval requested successfully!');
      setIsDrawerOpen(false);
      fetchSlots();
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting retrieval');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleMaintenance = async () => {
    if (!selectedSlot) return;
    setActionLoading(true);
    const newStatus = selectedSlot.status === 'Maintenance' ? 'Available' : 'Maintenance';
    try {
      const { data } = await api.put(`/admin/slots/${selectedSlot._id}/status`, { status: newStatus });
      setSelectedSlot(data);
      setSlots(prev => prev.map(s => s._id === data._id ? data : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating slot status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetOrphanSlot = async () => {
    if (!selectedSlot) return;
    if (window.confirm(`Reset slot ${selectedSlot.slotNumber} to Available status?`)) {
      setActionLoading(true);
      try {
        const { data } = await api.put(`/admin/slots/${selectedSlot._id}/status`, { status: 'Available' });
        setSelectedSlot(data);
        setSlots(prev => prev.map(s => s._id === data._id ? data : s));
        setIsDrawerOpen(false);
      } catch (err) {
        alert(err.response?.data?.message || 'Error resetting slot');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Filtered slots calculation
  const filteredSlots = slots.filter(slot => {
    if (statusFilter !== 'All' && slot.status !== statusFilter) return false;
    if (floorFilter !== 'All' && slot.floor !== floorFilter) return false;
    if (zoneFilter !== 'All' && slot.zone !== zoneFilter) return false;
    if (typeFilter !== 'All' && slot.vehicleType !== typeFilter && slot.vehicleType !== 'Any') return false;
    return true;
  });

  const availableCount = slots.filter(s => s.status === 'Available').length;
  const occupiedCount = slots.filter(s => s.status === 'Occupied').length;
  const maintenanceCount = slots.filter(s => s.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" /> Parking Bays & Slots
          </h1>
          <p className="text-themeText-secondary">
            Manage all 40 parking bays, monitor live occupancy, and inspect bay status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchSlots} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          {!loading && slots.length === 0 && (
            <Button onClick={seedSlots} className="bg-primary text-black">
              Generate 40 Test Slots
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-themeBg-paper border border-themeBorder p-4 rounded-xl">
          <p className="text-xs font-semibold text-themeText-secondary uppercase">Total Bays</p>
          <p className="text-2xl font-black text-themeText mt-1">{slots.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
          <p className="text-xs font-semibold text-green-400 uppercase">Available</p>
          <p className="text-2xl font-black text-green-500 mt-1">{availableCount}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <p className="text-xs font-semibold text-red-400 uppercase">Occupied</p>
          <p className="text-2xl font-black text-red-500 mt-1">{occupiedCount}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
          <p className="text-xs font-semibold text-yellow-400 uppercase">Maintenance</p>
          <p className="text-2xl font-black text-yellow-500 mt-1">{maintenanceCount}</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-themeBg-paper border border-themeBorder p-4 rounded-xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-themeText-secondary">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-semibold">Filters:</span>
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-themeBg border border-themeBorder rounded-lg px-3 py-1.5 text-sm text-themeText focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="All">All Statuses ({slots.length})</option>
          <option value="Available">Available ({availableCount})</option>
          <option value="Occupied">Occupied ({occupiedCount})</option>
          <option value="Maintenance">Maintenance ({maintenanceCount})</option>
        </select>

        {/* Floor */}
        <select
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
          className="bg-themeBg border border-themeBorder rounded-lg px-3 py-1.5 text-sm text-themeText focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="All">All Floors</option>
          <option value="1">Floor 1</option>
          <option value="2">Floor 2</option>
        </select>

        {/* Zone */}
        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="bg-themeBg border border-themeBorder rounded-lg px-3 py-1.5 text-sm text-themeText focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="All">All Zones</option>
          <option value="A">Zone A</option>
          <option value="B">Zone B</option>
        </select>

        {/* Vehicle Type */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-themeBg border border-themeBorder rounded-lg px-3 py-1.5 text-sm text-themeText focus:ring-1 focus:ring-primary focus:outline-none"
        >
          <option value="All">All Vehicle Types</option>
          <option value="Car">Car</option>
          <option value="SUV">SUV</option>
          <option value="Bike">Bike</option>
        </select>

        {(statusFilter !== 'All' || floorFilter !== 'All' || zoneFilter !== 'All' || typeFilter !== 'All') && (
          <button
            onClick={() => {
              setStatusFilter('All');
              setFloorFilter('All');
              setZoneFilter('All');
              setTypeFilter('All');
            }}
            className="text-xs text-primary hover:underline ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center justify-between">
          <p className="text-sm font-medium">{error}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={fetchSlots}>Retry</Button>
            <Button size="sm" className="bg-primary text-black" onClick={seedSlots}>Initialize 40 Slots</Button>
          </div>
        </div>
      )}

      {/* Grid of 40 Slots */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-themeText-secondary gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading 40 parking bays...</span>
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-12 text-center text-themeText-secondary">
          <p className="text-lg font-bold text-themeText mb-1">No slots matching your filter</p>
          <p className="text-sm">Try changing or resetting your active filter selections.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3.5">
          {filteredSlots.map(slot => (
            <div
              key={slot._id}
              onClick={() => handleSlotClick(slot)}
              className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg relative group ${
                slot.status === 'Available'
                  ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/60'
                  : slot.status === 'Occupied'
                  ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/60'
                  : 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-500/60'
              }`}
            >
              <span className="text-base font-black text-themeText tracking-tight">{slot.slotNumber}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                slot.status === 'Available'
                  ? 'bg-green-500/20 text-green-400'
                  : slot.status === 'Occupied'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {slot.status}
              </span>
              <span className="text-[11px] text-themeText-secondary font-medium">
                {slot.vehicleType}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Slide-in Drawer Modal */}
      {isDrawerOpen && selectedSlot && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-themeBg h-full border-l border-themeBorder shadow-2xl flex flex-col z-10">
            
            {/* Drawer Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-themeBorder bg-themeBg-paper shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-themeText">Bay {selectedSlot.slotNumber}</span>
                <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  selectedSlot.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                  selectedSlot.status === 'Occupied' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedSlot.status}
                </span>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)} 
                className="text-themeText-secondary hover:text-themeText p-2 rounded-lg hover:bg-themeBg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Slot Meta Overview */}
              <div className="grid grid-cols-3 gap-3 bg-themeBg-paper border border-themeBorder rounded-xl p-3 text-center">
                <div>
                  <p className="text-[11px] text-themeText-secondary font-medium uppercase">Zone</p>
                  <p className="text-base font-bold text-themeText mt-0.5">{selectedSlot.zone}</p>
                </div>
                <div>
                  <p className="text-[11px] text-themeText-secondary font-medium uppercase">Floor</p>
                  <p className="text-base font-bold text-themeText mt-0.5">{selectedSlot.floor}</p>
                </div>
                <div>
                  <p className="text-[11px] text-themeText-secondary font-medium uppercase">Vehicle Type</p>
                  <p className="text-base font-bold text-primary mt-0.5">{selectedSlot.vehicleType}</p>
                </div>
              </div>

              {selectedSlot.status === 'Available' ? (
                <div className="space-y-6">
                  <div className="text-center py-10 bg-green-500/5 border border-green-500/20 rounded-2xl p-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-themeText mb-1">Bay {selectedSlot.slotNumber} is Ready</h3>
                    <p className="text-sm text-themeText-secondary max-w-xs mx-auto">
                      This parking bay is currently unoccupied and ready to accommodate incoming {selectedSlot.vehicleType} vehicles.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate('/valet/check-in')}
                      className="w-full bg-primary text-black font-bold flex items-center justify-center gap-2"
                    >
                      <CarFront className="w-4 h-4" /> Check-In Vehicle Here <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleToggleMaintenance}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-4 h-4" /> Mark as Maintenance
                    </Button>
                  </div>
                </div>
              ) : selectedSlot.status === 'Maintenance' ? (
                <div className="space-y-6">
                  <div className="text-center py-10 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-themeText mb-1">Bay Under Maintenance</h3>
                    <p className="text-sm text-themeText-secondary max-w-xs mx-auto">
                      This bay is temporarily out of service for inspection or maintenance.
                    </p>
                  </div>

                  <Button
                    onClick={handleToggleMaintenance}
                    disabled={actionLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold"
                  >
                    Restore Bay to Available
                  </Button>
                </div>
              ) : txLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-themeText-secondary gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium">Fetching parking record...</p>
                </div>
              ) : txDetails ? (
                <div className="space-y-6">
                  
                  {/* Timer & Live Fee Card */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-themeText-secondary mb-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="text-lg font-mono font-black text-primary">{liveDuration || '0h 0m 0s'}</p>
                    </div>
                    <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-themeText-secondary mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider">Current Fee</span>
                      </div>
                      <p className="text-lg font-black text-themeText">₹{txDetails.currentFee || 0}</p>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-themeText uppercase tracking-wider flex items-center gap-2 border-b border-themeBorder pb-2">
                      <CarFront className="w-4 h-4 text-primary" /> Vehicle Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-themeText-secondary">Number Plate</p>
                        <p className="font-bold text-themeText uppercase">{txDetails.vehicleId?.vehicleNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-themeText-secondary">Vehicle Type</p>
                        <p className="font-medium text-themeText">{txDetails.vehicleId?.vehicleType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-themeText-secondary">Brand / Model</p>
                        <p className="font-medium text-themeText">{txDetails.vehicleId?.brand || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-themeText-secondary">Color</p>
                        <p className="font-medium text-themeText">{txDetails.vehicleId?.color || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-themeText uppercase tracking-wider flex items-center gap-2 border-b border-themeBorder pb-2">
                      <User className="w-4 h-4 text-primary" /> Customer Details
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-themeText-secondary">Name</p>
                        <p className="font-bold text-themeText">{txDetails.customerId?.name || 'Walk-in'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-themeText-secondary">Mobile</p>
                        <p className="font-medium text-themeText flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-primary" />
                          {txDetails.customerId?.mobileNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details */}
                  <div className="bg-themeBg-paper border border-themeBorder rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-themeText uppercase tracking-wider flex items-center gap-2 border-b border-themeBorder pb-2">
                      <FileText className="w-4 h-4 text-primary" /> Parking Record
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-themeText-secondary text-xs">Ticket Number:</span>
                        <span className="font-mono font-bold text-primary">{txDetails.ticketNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-themeText-secondary text-xs">Check-In Time:</span>
                        <span className="font-medium text-themeText">{moment(txDetails.checkInTime).format('MMM DD, YYYY HH:mm')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-themeText-secondary text-xs">Valet Attendant:</span>
                        <span className="font-medium text-themeText">{txDetails.valetStaffId?.name || 'Staff'}</span>
                      </div>
                    </div>
                    {txDetails.qrCodeUrl && (
                      <div className="mt-4 flex flex-col items-center p-3 bg-white rounded-xl">
                        <img src={txDetails.qrCodeUrl} alt="QR Code" className="w-28 h-28" />
                        <p className="text-[11px] text-gray-700 font-bold mt-1">Ticket QR Code</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <Button 
                      onClick={handleRequestRetrieval} 
                      disabled={actionLoading}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
                    >
                      Request Vehicle Retrieval
                    </Button>
                    <Button 
                      onClick={handleForceCheckout} 
                      disabled={actionLoading}
                      variant="secondary"
                      className="w-full text-red-400 hover:bg-red-500/10 border-red-500/30"
                    >
                      Force Check-Out / Release
                    </Button>
                  </div>

                </div>
              ) : (
                /* Orphan Occupied Slot Recovery */
                <div className="space-y-6">
                  <div className="text-center py-8 bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-themeText mb-1">No Active Transaction Linked</h3>
                    <p className="text-xs text-themeText-secondary max-w-xs mx-auto">
                      This bay is marked as Occupied in the database, but no active transaction record was found.
                    </p>
                  </div>
                  <Button 
                    onClick={handleResetOrphanSlot} 
                    disabled={actionLoading}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
                  >
                    Reset Bay to Available
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlots;
