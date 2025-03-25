import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination, Column, Row } from 'react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Updated interfaces
interface User {
  user_id: number;
  name: string;
  email: string;
  status: string;
}

interface AdSlot {
  ad_slot_id: number;
  ad_type: string;
}

interface Booking {
  booking_id: number;
  total_cost: string;
  status: string;
  ad_slot_id: number;
  ad_slot: AdSlot;
  created_at: string;
}

interface InvoiceData {
  invoice_id: number;
  user_id: number;
  booking_id: number;
  total_amount: string;
  status: string;
  invoice_number: string;
  created_at: string;
  updated_at: string;
  user: User;
  booking: Booking;
}

const Invoices: React.FC = () => {
  const [data, setData] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<{ data: InvoiceData[] }>('/api/invoices');
      setData(response.data.data || []);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Unknown error occurred';
      setError('Failed to fetch invoices: ' + errorMessage);
      toast.error('Failed to fetch invoices', { position: "top-right" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const columns: Column<InvoiceData>[] = useMemo(() => [
    {
      Header: '#',
      id: 'count',
      Cell: ({ row }: { row: Row<InvoiceData> }) => <span>{row.index + 1}</span>,
      width: 50
    },
    { 
      Header: 'User Name', 
      accessor: 'user.name' 
    },
    { 
      Header: 'Invoice Number', 
      accessor: 'invoice_number' 
    },
    { 
      Header: 'Ad Type', 
      accessor: 'booking.ad_slot.ad_type',
      Cell: ({ value }: { value: string }) => value || 'N/A'
    },
    { 
      Header: 'Total Amount', 
      accessor: 'total_amount',
      Cell: ({ value }: { value: string }) => value
    },
    { 
      Header: 'Status', 
      accessor: 'status',
      Cell: ({ value }: { value: string }) => (
        <button 
          className={`px-2 py-1 text-white text-xs rounded ${
            value === 'paid' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </button>
      )
    },
    { 
      Header: 'Created At', 
      accessor: 'created_at',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
    },
  ], []);

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
  } = useTable<InvoiceData>(
    { 
      columns, 
      data, 
      initialState: { pageIndex: 0, pageSize: 10 } 
    },
    useGlobalFilter,
    usePagination
  );

  const exportToPDF = (): void => {
    const doc = new jsPDF();
    doc.text('Invoices Data', 20, 10);
    autoTable(doc, {
      head: [['#', 'User Name', 'Invoice Number', 'Ad Type', 'Total Amount', 'Status', 'Created At']],
      body: data.map((row, index) => [
        index + 1,
        row.user.name,
        row.invoice_number,
        row.booking.ad_slot?.ad_type || 'N/A',
        row.total_amount,
        row.status,
        new Date(row.created_at).toLocaleDateString()
      ]),
    });
    doc.save('invoices_data.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToExcel = (): void => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        count: index + 1,
        user_name: row.user.name,
        invoice_number: row.invoice_number,
        ad_type: row.booking.ad_slot?.ad_type || 'N/A',
        total_amount: row.total_amount,
        status: row.status,
        created_at: new Date(row.created_at).toLocaleDateString()
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'invoices_data.xlsx');
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
          <h2 className="text-lg text-gray-800">Invoices Management</h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 w-full">
          <input
            value={globalFilter || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(e.target.value)}
            placeholder="Search invoices..."
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
          <table 
            {...getTableProps()} 
            className="w-full divide-y divide-gray-200 bg-white rounded-lg table-auto"
          >
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

export default Invoices;