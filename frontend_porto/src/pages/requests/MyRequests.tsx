import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Link } from 'react-router';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RequestData {
  user: { name: string };
  department: { name: string };
  item: string;
  item_type: string;
  amount_requested: string;
  vender: string;
  vender_account_name: string;
  vendor_account_number: string;
  created_at: string;
  is_approved: string;
}

export default function Requests() {
  const [data, setData] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/my-requests');
      setData(response.data.data || []);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch requests: ' + (err.response?.data?.message || err.message));
      toast.error('Failed to fetch requests', { position: "top-right" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'count',
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
      width: 50
    },
    { Header: 'User', accessor: 'user.name' },
    { Header: 'Department', accessor: 'department.name' },
    { 
      Header: 'Items', 
      accessor: 'item',
      Cell: ({ value }: { value: string }) => {
        const items = JSON.parse(value);
        return items.join(', ');
      }
    },
    { Header: 'Item Type', accessor: 'item_type' },
    { 
      Header: 'Amount', 
      accessor: 'amount_requested',
      Cell: ({ value }: { value: string }) => value ? `${parseFloat(value).toLocaleString()} KES` : 'N/A'
    },
    { Header: 'Vendor', accessor: 'vender' },
    { Header: 'Vendor Account Name', accessor: 'vender_account_name' },
    { Header: 'Vendor Account Number', accessor: 'vendor_account_number' },
    { 
      Header: 'Created At', 
      accessor: 'created_at',
      Cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString()
    },
    {
      Header: 'Status',
      accessor: 'is_approved',
      Cell: ({ value }: { value: string }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    }
  ], []);

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

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Requests Data', 20, 10);
    autoTable(doc, {
      head: [['#', 'User', 'Department', 'Items', 'Item Type', 'Amount', 'Vendor', 'Vendor Account Name', 'Vendor Account Number', 'Created At', 'Status']],
      body: data.map((row, index) => [
        index + 1,
        row.user.name,
        row.department.name,
        JSON.parse(row.item).join(', '),
        row.item_type,
        row.amount_requested ? `${parseFloat(row.amount_requested).toLocaleString()} KES` : 'N/A',
        row.vender,
        row.vender_account_name,
        row.vendor_account_number,
        new Date(row.created_at).toLocaleDateString(),
        row.is_approved
      ]),
    });
    doc.save('requests_data.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        count: index + 1,
        user: row.user.name,
        department: row.department.name,
        items: JSON.parse(row.item).join(', '),
        item_type: row.item_type,
        amount: row.amount_requested ? `${parseFloat(row.amount_requested).toLocaleString()} KES` : 'N/A',
        vendor: row.vender,
        vendor_account_name: row.vender_account_name,
        vendor_account_number: row.vendor_account_number,
        created_at: new Date(row.created_at).toLocaleDateString(),
        status: row.is_approved
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Requests');
    XLSX.writeFile(workbook, 'requests_data.xlsx');
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
          <h2 className="text-lg text-gray-800">My Requests </h2>
          <Link
            to="/apply-for/request"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Request
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 w-full">
          <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search requests..."
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
            onChange={e => setPageSize(Number(e.target.value))}
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
}