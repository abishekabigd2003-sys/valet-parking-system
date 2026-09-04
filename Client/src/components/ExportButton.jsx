import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from './Button';
import { Download, Check, FileSpreadsheet } from 'lucide-react';
import moment from 'moment';

export const ExportButton = ({ data, filename = 'Export' }) => {
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);

  const flattenItem = (item, index) => {
    if (!item || typeof item !== 'object') return {};

    // 1. Payment Record
    if (item.paymentMethod !== undefined || (item.transactionId && item.amount !== undefined)) {
      return {
        'S.No': index + 1,
        'Ticket Number': item.transactionId?.ticketNumber || 'N/A',
        'Customer Name': item.transactionId?.customerId?.name || 'N/A',
        'Customer Mobile': item.transactionId?.customerId?.mobileNumber || 'N/A',
        'Vehicle Number': item.transactionId?.vehicleId?.vehicleNumber || 'N/A',
        'Vehicle Type': item.transactionId?.vehicleId?.vehicleType || 'N/A',
        'Parking Slot': item.transactionId?.slotId 
          ? `Floor ${item.transactionId.slotId.floor} - ${item.transactionId.slotId.slotNumber}` 
          : 'N/A',
        'Amount Paid (₹)': item.amount ?? item.transactionId?.feeCalculated ?? 0,
        'Payment Method': item.paymentMethod || 'Cash',
        'Payment Status': item.status || 'Completed',
        'Date & Time': item.createdAt ? moment(item.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A',
      };
    }

    // 2. Parking Transaction / Parking Record / Customer History
    if (item.ticketNumber !== undefined) {
      return {
        'S.No': index + 1,
        'Ticket Number': item.ticketNumber,
        'Vehicle Number': item.vehicleId?.vehicleNumber || item.vehicleId?.licensePlate || item.vehicleNumber || 'N/A',
        'Vehicle Type': item.vehicleId?.vehicleType || item.vehicleType || 'N/A',
        'Customer Name': item.customerId?.name || item.customerName || 'N/A',
        'Customer Mobile': item.customerId?.mobileNumber || item.mobileNumber || 'N/A',
        'Parking Slot': item.slotId 
          ? `Floor ${item.slotId.floor} - ${item.slotId.slotNumber}` 
          : 'N/A',
        'Attendant': item.valetStaffId?.name || 'Valet Staff',
        'Check-In Time': item.checkInTime ? moment(item.checkInTime).format('DD MMM YYYY, hh:mm A') : 'N/A',
        'Check-Out Time': item.checkOutTime ? moment(item.checkOutTime).format('DD MMM YYYY, hh:mm A') : '-',
        'Fee (₹)': item.feeCalculated ?? 0,
        'Payment Status': item.paymentStatus || 'Pending',
        'Status': item.status || 'Parked',
      };
    }

    // 3. Customer Profile
    if (item.mobileNumber && (item.name || item.email !== undefined)) {
      return {
        'S.No': index + 1,
        'Customer Name': item.name || 'N/A',
        'Mobile Number': item.mobileNumber,
        'Email Address': item.email || 'N/A',
        'Registration Date': item.createdAt ? moment(item.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A',
      };
    }

    // 4. Staff Profile
    if (item.role && item.email) {
      return {
        'S.No': index + 1,
        'Staff Name': item.name || 'N/A',
        'Email Address': item.email,
        'Role': item.role,
        'Account Status': item.status || 'Active',
        'Joined Date': item.createdAt ? moment(item.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A',
      };
    }

    // 5. Vehicle Profile
    if (item.vehicleNumber) {
      return {
        'S.No': index + 1,
        'Vehicle Number': item.vehicleNumber,
        'Vehicle Type': item.vehicleType || 'Car',
        'Brand': item.brand || 'N/A',
        'Color': item.color || 'N/A',
        'Owner Name': item.customerId?.name || 'Walk-in',
        'Owner Mobile': item.customerId?.mobileNumber || 'N/A',
        'Registered Date': item.createdAt ? moment(item.createdAt).format('DD MMM YYYY, hh:mm A') : 'N/A',
      };
    }

    // Generic fallback for any other collection
    const cleaned = { 'S.No': index + 1 };
    Object.keys(item).forEach(key => {
      if (['_id', '__v', 'password', 'firebaseUid'].includes(key)) return;
      const val = item[key];
      if (typeof val === 'object' && val !== null) {
        cleaned[key] = val.name || val.slotNumber || val.ticketNumber || val.vehicleNumber || JSON.stringify(val);
      } else {
        cleaned[key] = val;
      }
    });
    return cleaned;
  };

  const handleExport = () => {
    setLoading(true);
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        alert('No data records available to export.');
        setLoading(false);
        return;
      }

      // Format all items into clean tabular objects
      const formattedData = data.map((item, index) => flattenItem(item, index));

      // Create sheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      
      // Auto-fit column widths based on maximum string lengths in header and rows
      const headers = Object.keys(formattedData[0] || {});
      const colWidths = headers.map(header => {
        let maxLen = header.length;
        formattedData.forEach(row => {
          const valStr = (row[header] !== undefined && row[header] !== null) ? String(row[header]) : '';
          if (valStr.length > maxLen) {
            maxLen = Math.min(valStr.length, 40); // Cap at 40 chars
          }
        });
        return { wch: Math.max(maxLen + 3, 12) };
      });
      worksheet['!cols'] = colWidths;

      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
      
      // File generation
      const finalFilename = `${filename}_${moment().format('YYYY-MM-DD_HHmm')}.xlsx`;
      XLSX.writeFile(workbook, finalFilename);

      setExported(true);
      setTimeout(() => setExported(false), 2500);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={loading || !data || data.length === 0}
      variant="secondary"
      className="bg-primary hover:bg-primary/90 text-gray-950 font-bold flex items-center gap-2 px-4 py-2 border-0 shadow-sm"
      title="Export clean data to Excel (.xlsx / CSV)"
    >
      {exported ? (
        <>
          <Check className="w-4 h-4 text-green-800" />
          <span>Exported!</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4 text-gray-900" />
          <span>{loading ? 'Exporting...' : 'Export to Excel (CSV)'}</span>
        </>
      )}
    </Button>
  );
};

export default ExportButton;
