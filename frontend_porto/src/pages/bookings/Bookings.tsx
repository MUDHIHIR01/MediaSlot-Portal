import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination, Column, Row } from 'react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AdSlot {
  ad_slot_id: number;
  ad_type: string;
  ad_unit: string;
  dimensions: string;
  device: string;
  platform: string;
  placement_type: string;
  rate: string;
  rate_unit: string;
  duration_limit: string;
  available: number;
  image: string;
  created_at: string;
  updated_at: string;
}

interface BookingData {
  booking_id: number;
  user_id: number;
  ad_slot_id: number;
  quantity: number;
  total_cost: string;
  duration_type: string;
  duration_value: number;
  status: string;
  ad_slot: AdSlot;
  created_at: string;
  updated_at: string;
}

interface UserData {
  user_id: number;
  name: string;
}

const ActionButtons: React.FC<{ bookingId: number }> = ({ bookingId }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(`/api/bookings/${bookingId}`);
      if (response.status === 200) {
        toast.success(response.data.message || 'Booking deleted successfully', {
          position: "top-right"
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete booking';
      toast.error(errorMessage, {
        position: "top-right"
      });
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    toast.info('Delete action cancelled', {
      position: "top-right"
    });
    setShowConfirm(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        <Link to={`/confirm-booking/${bookingId}`} className="p-1 text-blue-500 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </Link>
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1 text-red-500 hover:text-red-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this booking?
            </h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Bookings: React.FC = () => {
  const [data, setData] = useState<BookingData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [bookingsResponse, usersResponse] = await Promise.all([
        axiosInstance.get<{ data: BookingData[] }>('/api/bookings'),
        axiosInstance.get<{ users: UserData[] }>('/api/all/users')
      ]);
      setData(bookingsResponse.data.data || []);
      setUsers(usersResponse.data.users || []);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to fetch bookings or users', { position: "top-right" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUserName = (userId: number) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.name : 'Unknown';
  };

  const getTotalDuration = (row: BookingData) => {
    return row.quantity * row.duration_value;
  };

  const columns: Column<BookingData>[] = useMemo(() => [
    {
      Header: '#',
      accessor: 'count' as any,
      Cell: ({ row }: { row: Row<BookingData> }) => <span>{row.index + 1}</span>,
      width: 50
    },
    { 
      Header: 'User', 
      accessor: 'user_id',
      Cell: ({ value }: { value: number }) => getUserName(value)
    },
    { 
      Header: 'Ad Type', 
      accessor: 'ad_slot.ad_type',
      Cell: ({ value }: { value: string }) => value || 'N/A'
    },
    { 
      Header: 'Platform', 
      accessor: 'ad_slot.platform',
      Cell: ({ value }: { value: string }) => value || 'N/A'
    },
    { 
      Header: 'Quantity', 
      accessor: 'quantity',
      Cell: ({ value }: { value: number }) => value
    },
    { 
      Header: 'Total Cost', 
      accessor: 'total_cost',
      Cell: ({ value }: { value: string }) => `${value} TShs`
    },
    { 
      Header: 'Duration', 
      accessor: 'duration_value',
      Cell: ({ row }: { row: Row<BookingData> }) => `${row.original.duration_value} ${row.original.duration_type}`
    },
    { 
      Header: 'Total Duration', 
      accessor: 'total_duration' as any,
      Cell: ({ row }: { row: Row<BookingData> }) => `${getTotalDuration(row.original)} ${row.original.duration_type}`
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }: { value: string }) => {
        const statusStyles = {
          confirmed: 'bg-green-500 text-white px-2 py-1 text-xs rounded',
          rejected: 'bg-red-500 text-white px-2 py-1 text-xs rounded',
          default: 'bg-gray-500 text-white px-2 py-1 text-xs rounded'
        };
        
        const style = value.toLowerCase() === 'confirmed' 
          ? statusStyles.confirmed
          : value.toLowerCase() === 'rejected'
          ? statusStyles.rejected
          : statusStyles.default;

        return (
          <span className={style}>
            {value}
          </span>
        );
      }
    },
    { 
      Header: 'Created At', 
      accessor: 'created_at',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString() || 'N/A'
    },
    {
      Header: 'Actions',
      accessor: 'booking_id',
      Cell: ({ value }: { value: number }) => <ActionButtons bookingId={value} />,
    },
  ], [users]);

  const tableInstance = useTable<BookingData>(
    { 
      columns, 
      data, 
      initialState: { pageIndex: 0, pageSize: 10 } 
    },
    useGlobalFilter,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = tableInstance;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Bookings Data', 20, 10);
    autoTable(doc, {
      head: [['#', 'User', 'Ad Type', 'Platform', 'Quantity', 'Total Cost', 'Duration', 'Total Duration', 'Status', 'Created At']],
      body: data.map((row, index) => [
        index + 1,
        getUserName(row.user_id),
        row.ad_slot.ad_type,
        row.ad_slot.platform,
        row.quantity,
        `${row.total_cost} TShs`,
        `${row.duration_value} ${row.duration_type}`,
        `${getTotalDuration(row)} ${row.duration_type}`,
        row.status,
        new Date(row.created_at).toLocaleDateString() || 'N/A'
      ]),
    });
    doc.save('bookings_data.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        count: index + 1,
        user: getUserName(row.user_id),
        ad_type: row.ad_slot.ad_type,
        platform: row.ad_slot.platform,
        quantity: row.quantity,
        total_cost: `${row.total_cost} TShs`,
        duration: `${row.duration_value} ${row.duration_type}`,
        total_duration: `${getTotalDuration(row)} ${row.duration_type}`,
        status: row.status,
        created_at: new Date(row.created_at).toLocaleDateString() || 'N/A'
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    XLSX.writeFile(workbook, 'bookings_data.xlsx');
    toast.success('Excel exported successfully');
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="tailtable p-4 w-full mx-auto">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{ top: "70px" }}
        closeOnClick
        pauseOnHover
        draggable
        draggablePercent={60}
        hideProgressBar
        closeButton
      />
      <div className="bg-white rounded-xl shadow-lg p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-gray-800">Bookings Management</h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 w-full">
          <input
            value={globalFilter || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search bookings..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 shadow-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-md"
            >
              Export Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table {...getTableProps()} className="w-full divide-y divide-gray-200 bg-white rounded-lg table-auto">
            <thead className="bg-gray-50">
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
              {page.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="hover:bg-gray-50 transition">
                    {row.cells.map(cell => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 w-full">
          <div className="flex gap-2">
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition shadow-md"
            >
              Previous
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600 transition shadow-md"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Page <span className="font-medium">{pageIndex + 1} of {pageOptions.length}</span>
          </div>
          <select
            value={pageSize}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPageSize(Number(e.target.value))}
            className="px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            {[5, 10, 20, 30, 50].map(size => (
              <option key={size} value={size}>Show {size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Bookings;