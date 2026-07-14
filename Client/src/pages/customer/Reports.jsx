import { Card } from '../../components/Card';

const CustomerReports = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-themeText">My Reports</h1>
      <p className="text-themeText-secondary">View your parking history and transactions.</p>
      
      <Card className="p-6">
        <h3 className="text-lg font-bold text-themeText mb-6">Recent Parking History</h3>
        <div className="text-center text-themeText-secondary py-8">
          No parking history found.
        </div>
      </Card>
    </div>
  );
};

export default CustomerReports;
