import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Button } from '../Button';
import axios from 'axios';

const BookingCard = () => {
  const [formData, setFormData] = useState({
    location: 'Los Angeles Parking',
    checkInDate: '',
    checkInTime: '09:00',
    checkOutDate: '',
    checkOutTime: '17:00',
    promoCode: '',
  });

  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBook = async () => {
    try {
      setStatus('loading');
      // Using full URL or proxy if configured. Assuming relative /api works if proxy is set or we use api instance
      await axios.post('http://localhost:5000/api/bookings', formData);
      setStatus('success');
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="bg-themeBg-paper backdrop-blur-2xl border border-themeBorder rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Book Now</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-primary uppercase tracking-wider">Select Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary" />
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-themeBg border border-themeBorder rounded-xl pl-10 pr-4 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none transition-all"
            >
              <option value="Los Angeles Parking">Los Angeles Parking</option>
              <option value="New York Downtown">New York Downtown</option>
              <option value="Chicago Central">Chicago Central</option>
            </select>
          </div>
        </div>

        {/* Check In */}
        <div className="flex flex-col gap-2 lg:col-span-1">
          <label className="text-xs font-bold text-themeText uppercase tracking-wider">Check In</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary pointer-events-none" />
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                className="w-full bg-themeBg border border-themeBorder rounded-xl px-3 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </div>
            <div className="relative w-24">
              <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary pointer-events-none" />
              <input
                type="time"
                name="checkInTime"
                value={formData.checkInTime}
                onChange={handleChange}
                className="w-full bg-themeBg border border-themeBorder rounded-xl pl-2 pr-6 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </div>
          </div>
        </div>

        {/* Check Out */}
        <div className="flex flex-col gap-2 lg:col-span-1">
          <label className="text-xs font-bold text-themeText uppercase tracking-wider">Check Out</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary pointer-events-none" />
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                className="w-full bg-themeBg border border-themeBorder rounded-xl px-3 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </div>
            <div className="relative w-24">
              <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary pointer-events-none" />
              <input
                type="time"
                name="checkOutTime"
                value={formData.checkOutTime}
                onChange={handleChange}
                className="w-full bg-themeBg border border-themeBorder rounded-xl pl-2 pr-6 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-themeText uppercase tracking-wider flex items-center gap-1">
            Promo Code <span className="text-themeText-secondary normal-case font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-themeText-secondary" />
            <input
              type="text"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
              placeholder="Enter code"
              className="w-full bg-themeBg border border-themeBorder rounded-xl pl-10 pr-4 py-4 text-sm text-themeText focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleBook}
            disabled={status === 'loading'}
            className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-4 rounded-xl text-lg h-full transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            {status === 'loading' ? 'Booking...' : status === 'success' ? 'Confirmed!' : 'Book Now'}
          </Button>
          {status === 'error' && <p className="text-red-500 text-xs absolute -bottom-5">Failed to book. Try again.</p>}
        </div>

      </div>
    </motion.div>
  );
};

export default BookingCard;
