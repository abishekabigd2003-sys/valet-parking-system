import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './Button';
import { Download } from 'lucide-react';
import moment from 'moment';

export const ExportButton = ({ data, filename = 'Export' }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    try {
      if (!data || data.length === 0) {
        alert('No data available to export.');
        setLoading(false);
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Auto-size columns
      const colWidths = Object.keys(data[0]).map(key => ({ wch: Math.max(key.length, 15) }));
      worksheet['!cols'] = colWidths;

      const finalFilename = `${filename}_${moment().format('YYYY-MM-DD')}.xlsx`;
      XLSX.writeFile(workbook, finalFilename);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    }
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={loading}
      className="bg-primary hover:bg-primary-dark text-black font-bold flex items-center gap-2 px-4 py-2"
    >
      <Download className="w-4 h-4 text-blue-500 bg-themeBg-paper p-0.5 rounded" />
      {loading ? 'Exporting...' : 'Export to Excel (CSV)'}
    </Button>
  );
};
