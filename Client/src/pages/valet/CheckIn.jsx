import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { User, Phone, Car, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const ValetCheckIn = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    color: '',
    brand: ''
  });
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTicket(null);
    try {
      const { data } = await api.post('/parking/check-in', formData);
      setTicket(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      mobileNumber: '',
      vehicleNumber: '',
      vehicleType: 'Car',
      color: '',
      brand: ''
    });
    setTicket(null);
  };

  if (ticket) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="max-w-xl mx-auto text-center py-12">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-themeText mb-2">Check-In Successful</h2>
          <p className="text-themeText-secondary mb-8">Vehicle has been assigned to a parking slot.</p>
          
          <div className="bg-themeBg-paper p-6 rounded-xl border border-themeBorder mb-8 text-left space-y-4">
            <div className="flex justify-between border-b border-themeBorder pb-4">
              <span className="text-themeText-secondary">Ticket Number:</span>
              <span className="text-xl font-bold text-primary">{ticket.transaction.ticketNumber}</span>
            </div>
            <div className="flex justify-between border-b border-themeBorder pb-4">
              <span className="text-themeText-secondary">Assigned Slot:</span>
              <span className="text-lg font-bold text-themeText">Floor {ticket.slot.floor} - {ticket.slot.slotNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-themeText-secondary">Vehicle:</span>
              <span className="text-themeText font-medium">{ticket.vehicle.vehicleNumber} ({ticket.vehicle.vehicleType})</span>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <img src={ticket.transaction.qrCodeUrl} alt="QR Code" className="w-48 h-48 bg-white p-2 rounded-lg" />
          </div>

          <Button onClick={resetForm} className="w-full bg-primary text-black">Check-In Another Vehicle</Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-themeText">Vehicle Check-In</h1>
        <p className="text-themeText-secondary">Register a new vehicle and assign a parking slot.</p>
      </div>

      <Card>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-9 w-5 h-5 text-gray-500" />
              <Input label="Customer Name" name="customerName" value={formData.customerName} onChange={handleChange} required className="pl-10" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-500" />
              <Input label="Mobile Number" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required className="pl-10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-themeBorder pt-6">
            <div className="relative">
              <Tag className="absolute left-3 top-9 w-5 h-5 text-gray-500" />
              <Input label="Vehicle Number (License Plate)" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required className="pl-10 uppercase" />
            </div>
            <div>
              <label className="text-sm font-medium text-themeText-secondary mb-1.5 block">Vehicle Type</label>
              <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full bg-themeBg-paper border border-themeBorder rounded-lg px-4 py-2.5 text-themeText focus:ring-2 focus:ring-primary focus:outline-none appearance-none">
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Bike">Bike</option>
              </select>
            </div>
            <div className="relative">
              <Car className="absolute left-3 top-9 w-5 h-5 text-gray-500" />
              <Input label="Brand / Model" name="brand" value={formData.brand} onChange={handleChange} className="pl-10" />
            </div>
            <div className="relative">
              <div className="absolute left-3 top-9 w-5 h-5 rounded-full border border-gray-500" style={{ backgroundColor: formData.color || 'transparent' }}></div>
              <Input label="Color" name="color" value={formData.color} onChange={handleChange} className="pl-10" placeholder="e.g. Black, White, Red" />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-lg bg-primary text-black" disabled={loading}>
            {loading ? 'Processing...' : 'Assign Slot & Check-In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ValetCheckIn;
