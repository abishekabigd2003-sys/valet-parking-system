import { Card } from '../../components/Card';
import { CarFront } from 'lucide-react';

const CustomerDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-themeText">My Dashboard</h1>
      <p className="text-themeText-secondary">Welcome to your customer portal.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col items-center justify-center p-12 text-center group border-primary/20">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-themeText mb-2">My Vehicles</h2>
          <p className="text-themeText-secondary text-sm">You have no active parking sessions at the moment.</p>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
