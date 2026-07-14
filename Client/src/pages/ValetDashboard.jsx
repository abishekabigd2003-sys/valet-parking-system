import { Card } from '../components/Card';
import { CarFront, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ValetDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-themeText">Valet Workspace</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          onClick={() => navigate('/valet/check-in')}
          className="flex flex-col items-center justify-center p-12 text-center hover:bg-themeBg-paper transition-colors cursor-pointer group border-primary/20"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-themeText mb-2">Check-In Vehicle</h2>
          <p className="text-themeText-secondary text-sm">Register new vehicle and assign slot</p>
        </Card>

        <Card 
          onClick={() => navigate('/valet/retrieve')}
          className="flex flex-col items-center justify-center p-12 text-center hover:bg-themeBg-paper transition-colors cursor-pointer group border-blue-500/20"
        >
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Ticket className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-themeText mb-2">Retrieve / Check-Out</h2>
          <p className="text-themeText-secondary text-sm">Scan QR or enter ticket number to retrieve</p>
        </Card>

        <Card 
          onClick={() => navigate('/valet/slots')}
          className="flex flex-col items-center justify-center p-12 text-center hover:bg-themeBg-paper transition-colors cursor-pointer group border-green-500/20"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Ticket className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-themeText mb-2">Parking Slots</h2>
          <p className="text-themeText-secondary text-sm">View available and occupied slots</p>
        </Card>
      </div>
    </div>
  );
};

export default ValetDashboard;
