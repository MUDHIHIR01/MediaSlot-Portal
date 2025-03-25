import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Interface for the dispatched assets data based on the API response
interface DispatchData {
  dispatch_id: number;
  request_id: number;
  user_id: number;
  is_dispatched: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    user_id: number;
    name: string;
    role_id: string;
    department_id: string;
    status: string;
    email: string;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
  request: {
    request_id: number;
    user_id: number;
    item: string;
    amount_requested: string;
    department_id: number;
    is_approved: string;
    vender: string;
    item_type: string;
    vendor_account_number: string;
    vender_account_name: string;
    created_at: string;
    updated_at: string;
  };
}

// Remove the ActionButtons component since we're not showing any action buttons anymore
export default function Dispatches() {
  const [data, setData] = useState<DispatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dispatched assets from the API
  const fetchDispatches = async () => {
    try {
      const response = await axiosInstance.get('/api/loggedUserDispatches');
      setData(response.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch dispatched assets: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to fetch dispatched assets', { position: "top-right" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatches();
  }, []);

  // Function to parse the item string from JSON format to a readable list
  const parseItemString = (itemString: string) => {
    try {
      return JSON.parse(itemString).join(', ');
    } catch (e) {
      return itemString;
    }
  };

  // Define table columns (no actions column anymore)
  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'count',
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
      width: 50
    },
    { Header: 'User Name', accessor: 'user.name' },
    { 
      Header: 'Item', 
      accessor: 'request.item',
      Cell: ({ value }: { value: string }) => parseItemString(value)
    },
    {
      Header: 'Status',
      accessor: 'is_dispatched',
      Cell: ({ value }) => {
        const displayText = value === 'dispatched' ? 'Dispatched' : 'Not Dispatched';
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              value === 'dispatched' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {displayText}
          </span>
        );
      }
    },
    { 
      Header: 'Created At', 
      accessor: 'created_at',
      Cell: ({ value }: { value: string }) => value || 'N/A'
    },
  ], []);

  // Initialize react-table instance
  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
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

  // Export to PDF function
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Dispatched Assets Data', 20, 10);
    autoTable(doc, {
      head: [['#', 'User Name', 'Item', 'Status', 'Created At']],
      body: data.map((row, index) => [
        index + 1,
        row.user.name,
        parseItemString(row.request.item),
        row.is_dispatched,
        row.created_at || 'N/A'
      ]),
    });
    doc.save('dispatched_assets.pdf');
    toast.success('PDF exported successfully');
  };

  // Export to Excel function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        count: index + 1,
        user_name: row.user.name,
        item: parseItemString(row.request.item),
        is_dispatched: row.is_dispatched,
        created_at: row.created_at || 'N/A'
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dispatches');
    XLSX.writeFile(workbook, 'dispatched_assets.xlsx');
    toast.success('Excel exported successfully');
  };

  // Loading and error states
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  // Render the component
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
          <h2 className="text-lg text-gray-800">User Assets </h2>
         
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 w-full">
          <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search dispatched assets..."
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

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-2">
            <button onClick={previousPage} disabled={!canPreviousPage} className="btn">
              Previous
            </button>
            <button onClick={nextPage} disabled={!canNextPage} className="btn">
              Next
            </button>
          </div>
          <span className="text-sm">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            {[5,10, 25, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
