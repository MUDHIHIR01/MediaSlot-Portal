import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

const tableData: Order[] = [
  
];

export default function CompactTable() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-x-auto">
      <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          <TableRow>
            <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-xs dark:text-gray-400">User</TableCell>
            <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-xs dark:text-gray-400">Project</TableCell>
            <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-xs dark:text-gray-400">Team</TableCell>
            <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-xs dark:text-gray-400">Status</TableCell>
            <TableCell isHeader className="px-4 py-2 font-medium text-gray-500 text-xs dark:text-gray-400">Budget</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {tableData.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <img
                    width={32}
                    height={32}
                    src={order.user.image}
                    alt={order.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="block text-sm font-medium text-gray-800 dark:text-white/90">{order.user.name}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{order.user.role}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{order.projectName}</TableCell>
              <TableCell className="px-4 py-2">
                <div className="flex -space-x-1">
                  {order.team.images.map((teamImage, index) => (
                    <img
                      key={index}
                      width={20}
                      height={20}
                      src={teamImage}
                      alt={`Team member ${index + 1}`}
                      className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 object-cover"
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <Badge
                  size="sm"
                  color={
                    order.status === "Active" ? "success" :
                    order.status === "Pending" ? "warning" :
                    "error"
                  }
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{order.budget}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}