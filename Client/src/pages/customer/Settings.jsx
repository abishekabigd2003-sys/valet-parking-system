import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const CustomerSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-themeText">Account Settings</h1>
      <p className="text-themeText-secondary">Manage your preferences and notification settings.</p>
      
      <Card className="p-6">
        <h3 className="text-lg font-bold text-themeText mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
            <div>
              <p className="font-bold text-themeText">Email Receipts</p>
              <p className="text-sm text-themeText-secondary">Receive digital receipts for your parking sessions.</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-gray-900 rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-themeBg-paper border border-themeBorder rounded-xl">
            <div>
              <p className="font-bold text-themeText">SMS Alerts</p>
              <p className="text-sm text-themeText-secondary">Get notified when your vehicle is ready for pickup.</p>
            </div>
            <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-gray-900 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
};

export default CustomerSettings;
