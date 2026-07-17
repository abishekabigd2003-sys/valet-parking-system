import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import api from '../../services/api';
import moment from 'moment';
import { Edit2, Trash2, RefreshCw } from 'lucide-react';
import { ExportButton } from '../../components/ExportButton';

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Valet', status: 'Active' });
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const { data } = await api.get('/admin/staff');
      setStaff(data);
    } catch (err) {
      console.error('Error fetching staff', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ name: '', email: '', password: '', role: 'Valet', status: 'Active' });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setEditId(user._id);
    setFormData({ name: user.name, email: user.email, password: '', role: user.role, status: user.status || 'Active' });
    setShowModal(true);
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        await api.delete(`/admin/staff/${id}`);
        fetchStaff();
      } catch (err) {
        console.error('Error deleting staff', err);
        alert(err.response?.data?.message || 'Error deleting staff');
      }
    }
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        const dataToSend = { ...formData };
        if (!dataToSend.password) {
          delete dataToSend.password;
        }
        await api.put(`/admin/staff/${editId}`, dataToSend);
      } else {
        await api.post('/admin/staff', formData);
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) {
      console.error('Error saving staff', err);
      alert(err.response?.data?.message || 'Error saving staff');
    }
    setSubmitting(false);
  };

  if (loading) return <div className="text-themeText">Loading staff...</div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-themeText">Staff Management</h1>
          <p className="text-themeText-secondary">View and manage all system users.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button onClick={fetchStaff} variant="secondary" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <ExportButton data={staff} filename="Staff_Report" />
          <Button onClick={openAddModal}>+ Add Staff</Button>
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-themeBg-paper text-themeText-secondary text-sm tracking-wider uppercase border-b border-themeBorder">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder">
              {staff.map(user => (
                <tr key={user._id} className="hover:bg-themeBg transition-colors">
                  <td className="px-6 py-4 font-bold text-themeText">{user.name}</td>
                  <td className="px-6 py-4 text-themeText-secondary">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-purple-500/20 text-purple-500' : 'bg-blue-500/20 text-blue-500'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-themeText-secondary text-sm">{moment(user.createdAt).format('MMM DD, YYYY')}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(user)} className="text-themeText-secondary hover:text-themeText transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteStaff(user._id)} className="text-themeText-secondary hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {staff.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-themeText-secondary">No staff found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-themeText mb-4">{isEditing ? 'Edit Staff' : 'Add New Staff'}</h2>
            <form onSubmit={handleSubmitStaff} className="space-y-4" autoComplete="off">
              <Input
                label="Name"
                required
                value={formData.name}
                autoComplete="off"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                required
                value={formData.email}
                autoComplete="new-password"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label={isEditing ? "Password (leave blank to keep current)" : "Password"}
                type="password"
                required={!isEditing}
                value={formData.password}
                autoComplete="new-password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-themeText-secondary">Role</label>
                  <select
                    className="w-full bg-themeBg-paper border border-themeBorder rounded-lg px-4 py-2.5 text-themeText focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="Valet">Valet Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                {isEditing && (
                  <div className="w-full flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-themeText-secondary">Status</label>
                    <select
                      className="w-full bg-themeBg-paper border border-themeBorder rounded-lg px-4 py-2.5 text-themeText focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Staff')}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminStaff;
