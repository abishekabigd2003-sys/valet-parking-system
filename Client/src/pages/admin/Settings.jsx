import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import { Edit2, CheckCircle2, RefreshCw, X } from 'lucide-react';

const AdminSettings = () => {
  const [tariffs, setTariffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTariff, setEditingTariff] = useState(null);
  const [formData, setFormData] = useState({ hourlyRate: '', dailyRate: '' });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Preference toggles
  const [autoAssign, setAutoAssign] = useState(() => {
    return localStorage.getItem('pref_auto_assign') !== 'false';
  });
  const [digitalReceipts, setDigitalReceipts] = useState(() => {
    return localStorage.getItem('pref_digital_receipts') !== 'false';
  });

  const fetchTariffs = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/tariffs');
      setTariffs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tariffs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  const openEditModal = (tariff) => {
    setEditingTariff(tariff);
    setFormData({
      hourlyRate: tariff.hourlyRate,
      dailyRate: tariff.dailyRate,
    });
    setSaveSuccess('');
  };

  const handleUpdateTariff = async (e) => {
    e.preventDefault();
    if (!editingTariff) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/admin/tariffs/${editingTariff._id}`, {
        hourlyRate: Number(formData.hourlyRate),
        dailyRate: Number(formData.dailyRate),
      });
      setTariffs(prev => prev.map(t => t._id === data._id ? data : t));
      setEditingTariff(null);
      setSaveSuccess(`Tariff for ${data.vehicleType} updated successfully!`);
      setTimeout(() => setSaveSuccess(''), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating tariff');
    } finally {
      setSaving(false);
    }
  };

  const toggleAutoAssign = () => {
    const newVal = !autoAssign;
    setAutoAssign(newVal);
    localStorage.setItem('pref_auto_assign', newVal.toString());
  };

  const toggleDigitalReceipts = () => {
    const newVal = !digitalReceipts;
    setDigitalReceipts(newVal);
    localStorage.setItem('pref_digital_receipts', newVal.toString());
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">System Settings</h1>
          <p className="text-themeText-secondary">Manage master tariffs, parking rates, and system configurations.</p>
        </div>
        <Button onClick={fetchTariffs} variant="secondary" className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        
        {/* Tariff & Pricing Card */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-themeText">Vehicle Tariffs & Pricing</h3>
              <p className="text-xs text-themeText-secondary">Set hourly rates and daily caps applied during checkout.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-themeBg-paper text-themeText-secondary text-xs tracking-wider uppercase border-b border-themeBorder">
                  <th className="px-6 py-4 font-semibold">Vehicle Type</th>
                  <th className="px-6 py-4 font-semibold">Hourly Rate (₹)</th>
                  <th className="px-6 py-4 font-semibold">Daily Max (₹)</th>
                  <th className="px-6 py-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-themeBorder">
                {tariffs.map(tariff => (
                  <tr key={tariff._id} className="hover:bg-themeBg transition-colors">
                    <td className="px-6 py-4 font-bold text-themeText">{tariff.vehicleType}</td>
                    <td className="px-6 py-4 text-primary font-bold">₹{tariff.hourlyRate} / hr</td>
                    <td className="px-6 py-4 text-themeText font-medium">₹{tariff.dailyRate} / day</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => openEditModal(tariff)}
                        className="flex items-center gap-1.5 ml-auto text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit Rate
                      </Button>
                    </td>
                  </tr>
                ))}
                {tariffs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-themeText-secondary">
                      {loading ? 'Loading tariffs...' : 'No tariffs found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* System Preferences Card */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-themeText mb-1">System Preferences</h3>
          <p className="text-xs text-themeText-secondary mb-6">Configure runtime policies for slot allocation and notifications.</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
              <div>
                <p className="font-bold text-themeText text-sm">Auto-assign Parking Slots</p>
                <p className="text-xs text-themeText-secondary mt-0.5">Automatically select the nearest optimal available slot during check-in.</p>
              </div>
              <button
                type="button"
                onClick={toggleAutoAssign}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                  autoAssign ? 'bg-primary' : 'bg-gray-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                    autoAssign ? 'translate-x-7 bg-gray-900' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
              <div>
                <p className="font-bold text-themeText text-sm">Enable Digital Receipts & Email Notifications</p>
                <p className="text-xs text-themeText-secondary mt-0.5">Send electronic receipts to registered customer email upon payment completion.</p>
              </div>
              <button
                type="button"
                onClick={toggleDigitalReceipts}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
                  digitalReceipts ? 'bg-primary' : 'bg-gray-700'
                }`}
              >
                <div 
                  className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                    digitalReceipts ? 'translate-x-7 bg-gray-900' : 'translate-x-1'
                  }`} 
                />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Tariff Modal */}
      {editingTariff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6 relative">
            <button 
              onClick={() => setEditingTariff(null)} 
              className="absolute right-4 top-4 text-themeText-secondary hover:text-themeText"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-themeText mb-1">Edit {editingTariff.vehicleType} Tariff</h2>
            <p className="text-xs text-themeText-secondary mb-6">Update billing rates for {editingTariff.vehicleType} vehicles.</p>
            
            <form onSubmit={handleUpdateTariff} className="space-y-4">
              <Input
                label="Hourly Rate (₹)"
                type="number"
                min="0"
                required
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              />
              <Input
                label="Daily Maximum Cap (₹)"
                type="number"
                min="0"
                required
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
              />

              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setEditingTariff(null)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Update Tariff'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
