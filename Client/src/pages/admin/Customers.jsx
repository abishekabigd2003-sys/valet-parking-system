import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import moment from 'moment';
import { ExportButton } from '../../components/ExportButton';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', mobileNumber: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/admin/customers');
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', mobileNumber: '', email: '' });
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setIsEditing(true);
    setEditId(customer._id);
    setFormData({ name: customer.name, mobileNumber: customer.mobileNumber, email: customer.email || '' });
    setShowModal(true);
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/admin/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error('Error deleting customer', err);
        alert(err.response?.data?.message || 'Error deleting customer');
      }
    }
  };

  const handleSubmitCustomer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/admin/customers/${editId}`, formData);
      } else {
        await api.post('/admin/customers', formData);
      }
      setShowModal(false);
      setFormData({ name: '', mobileNumber: '', email: '' });
      fetchCustomers();
    } catch (err) {
      console.error('Error saving customer', err);
      alert(err.response?.data?.message || 'Error saving customer');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-themeText">Loading customers...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">Manage Customers</h1>
          <p className="text-themeText-secondary">View and manage all registered customers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={fetchCustomers} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <ExportButton data={customers} filename="Customers_Report" />
          <Button onClick={openAddModal}>+ Add Customer</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Mobile</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {customers.map(customer => (
                <tr key={customer._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-6 py-4 font-bold text-themeText">{customer.name}</td>
                  <td className="px-6 py-4 text-themeText-secondary">{customer.mobileNumber}</td>
                  <td className="px-6 py-4 text-themeText-secondary">{customer.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">{moment(customer.createdAt).format('MMM DD, YYYY')}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(customer)} className="text-themeText-secondary hover:text-themeText transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCustomer(customer._id)} className="text-themeText-secondary hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-themeText-secondary">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-themeText mb-4">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmitCustomer} className="space-y-4" autoComplete="off">
              <Input
                label="Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Mobile Number"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              />
              <Input
                label="Email (Optional)"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Customer')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
