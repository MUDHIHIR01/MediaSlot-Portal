import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useGlobalFilter, usePagination } from 'react-table';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosInstance from "../../axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Audit trail data interface
interface AuditTrailData {
  id: number;
  user_id: number;
  email: string;
  role_id: number;
  action: string;
  created_at: string;
  updated_at: string;
  category: string;
}

export default function AuditTrail() {
  const [data, setData] = useState<AuditTrailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch audit trail logs
  const fetchAuditTrail = async () => {
    try {
      const response = await axiosInstance.get('/api/audit-trail');
      setData(response.data.audit_trail || []);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to fetch audit trail: ' + (err.response?.data?.error || err.message));
      toast.error('Failed to fetch audit trail', { position: "top-right" });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditTrail();
  }, []);

  // Table columns (Removed User ID column)
  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'count',
      Cell: ({ row }: any) => <span>{row.index + 1}</span>,
      width: 50
    },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Role', accessor: 'category' },
    { Header: 'Action', accessor: 'action' },
    { Header: 'Created At', accessor: 'created_at' },
    { Header: 'Updated At', accessor: 'updated_at' }
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

  // Export functions (Updated to remove user_id)
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Audit Trail Logs', 20, 10);
    autoTable(doc, {
      head: [['#', 'Email', 'Role', 'Action', 'Created At', 'Updated At']],
      body: data.map((row, index) => [
        index + 1,
        row.email,
        row.category,
        row.action,
        row.created_at,
        row.updated_at
      ]),
    });
    doc.save('audit_trail_logs.pdf');
    toast.success('PDF exported successfully');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((row, index) => ({
        count: index + 1,
        email: row.email,
        role: row.category,
        action: row.action,
        created_at: row.created_at,
        updated_at: row.updated_at
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AuditTrail');
    XLSX.writeFile(workbook, 'audit_trail_logs.xlsx');
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
          <h2 className="text-lg text-gray-800">Audit Trail Logs</h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4 w-full">
          <input
            value={globalFilter || ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search audit logs..."
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