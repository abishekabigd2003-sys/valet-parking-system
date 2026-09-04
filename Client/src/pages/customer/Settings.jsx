import { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { CheckCircle2, Bell, Mail, Smartphone } from 'lucide-react';

const CustomerSettings = () => {
  const [emailReceipts, setEmailReceipts] = useState(() => {
    return localStorage.getItem('cust_email_receipts') !== 'false';
  });
  const [smsAlerts, setSmsAlerts] = useState(() => {
    return localStorage.getItem('cust_sms_alerts') !== 'false';
  });
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = () => {
    localStorage.setItem('cust_email_receipts', emailReceipts.toString());
    localStorage.setItem('cust_sms_alerts', smsAlerts.toString());
    setSavedMessage('Notification preferences saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-themeText flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" /> Account Settings
        </h1>
        <p className="text-themeText-secondary">Manage your preferences and notification alerts.</p>
      </div>

      {savedMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}
      
      <Card className="p-6">
        <h3 className="text-lg font-bold text-themeText mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-themeText text-sm">Email Receipts & Check-In Confirmations</p>
                <p className="text-xs text-themeText-secondary mt-0.5">Receive instant QR code pass and digital payment receipts to your email.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmailReceipts(!emailReceipts)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                emailReceipts ? 'bg-primary' : 'bg-gray-700'
              }`}
            >
              <div 
                className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  emailReceipts ? 'translate-x-7 bg-gray-900' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-themeText text-sm">SMS Pickup Ready Alerts</p>
                <p className="text-xs text-themeText-secondary mt-0.5">Get an SMS message when your valet attendant is ready with your vehicle.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSmsAlerts(!smsAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                smsAlerts ? 'bg-primary' : 'bg-gray-700'
              }`}
            >
              <div 
                className={`w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                  smsAlerts ? 'translate-x-7 bg-gray-900' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="bg-primary text-black font-bold">
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerSettings;
