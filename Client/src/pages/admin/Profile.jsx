import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, Mail, Shield, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const AdminProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await updateProfile(name);
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-themeText">My Profile</h1>
          <p className="text-themeText-secondary">View and manage your personal account settings.</p>
        </div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-2xl bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary text-5xl font-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-themeText-secondary flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-themeBg border border-themeBorder rounded-xl text-themeText focus:outline-none focus:border-primary transition-colors"
                  />
                ) : (
                  <p className="text-lg font-bold text-themeText">{user?.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-themeText-secondary flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                <p className="text-lg font-bold text-themeText">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-themeText-secondary flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Role
                </label>
                <div>
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm">
                    {user?.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-themeText-secondary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Account Status
                </label>
                <div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 font-bold text-sm">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-themeBorder flex gap-4">
              {isEditing ? (
                <>
                  <Button variant="primary" onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={() => { setIsEditing(false); setName(user?.name || ''); }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  <Button variant="secondary">Change Password</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
