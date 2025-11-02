import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Truck as TruckIcon, Printer, Trash2, Search } from "lucide-react";

interface LRTableProps {
  onEdit: (lr: any) => void;
}

// Sample data
const sampleLRData = [
  {
    srNo: 1,
    lrNo: "DEL/22551",
    date: "28-07-2025",
    truckNo: "HR 46E 4180",
    from: "BARHANA",
    to: "KARNAL",
    consignor: "FALKON PREFAB",
    consignee: "FALKON PREFAB",
    agent: "",
    weight: 100,
    freight: 900.00,
    createdBy: "SSK"
  },
  {
    srNo: 2,
    lrNo: "DEL/1023",
    date: "08-10-2025",
    truckNo: "HR 63D 4473",
    from: "BERI",
    to: "DELHI",
    consignor: "MG EMBALLAGE PVT LTD",
    consignee: "AAKASH TRADERS",
    agent: "",
    weight: 5,
    freight: 7000.00,
    createdBy: "SSK"
  },
  {
    srNo: 3,
    lrNo: "DEL/1005",
    date: "27-10-2025",
    truckNo: "HR 38S 4615",
    from: "KHARAIWAR",
    to: "TKD",
    consignor: "SUDHIR AUTOMOTIVE INDUSTRIES PVT LTD",
    consignee: "SUDHIR AUTOMOTIVE INDUSTRIES PVT LTD",
    agent: "",
    weight: 20,
    freight: 23500.00,
    createdBy: "SSK"
  }
];

const LRTable = ({ onEdit }: LRTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("50");

  return (
    <Card className="p-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">entries</span>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[hsl(var(--table-header))] text-white">
              <th className="p-3 text-left font-semibold text-sm">SR.NO</th>
              <th className="p-3 text-left font-semibold text-sm">LR NO</th>
              <th className="p-3 text-left font-semibold text-sm">DATE</th>
              <th className="p-3 text-left font-semibold text-sm">TRUCK NO</th>
              <th className="p-3 text-left font-semibold text-sm">FROM</th>
              <th className="p-3 text-left font-semibold text-sm">TO</th>
              <th className="p-3 text-left font-semibold text-sm">CONSIGNOR</th>
              <th className="p-3 text-left font-semibold text-sm">CONSIGNEE</th>
              <th className="p-3 text-left font-semibold text-sm">AGENT</th>
              <th className="p-3 text-left font-semibold text-sm">WEIGHT</th>
              <th className="p-3 text-left font-semibold text-sm">FRIGHT</th>
              <th className="p-3 text-left font-semibold text-sm">CREATED BY</th>
              <th className="p-3 text-left font-semibold text-sm">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sampleLRData.map((lr) => (
              <tr key={lr.srNo} className="border-t hover:bg-muted/50 transition-colors">
                <td className="p-3 text-sm">{lr.srNo}</td>
                <td className="p-3 text-sm">
                  <span className="text-primary font-medium">{lr.lrNo}</span>
                </td>
                <td className="p-3 text-sm">{lr.date}</td>
                <td className="p-3 text-sm">{lr.truckNo}</td>
                <td className="p-3 text-sm">{lr.from}</td>
                <td className="p-3 text-sm">{lr.to}</td>
                <td className="p-3 text-sm text-xs">{lr.consignor}</td>
                <td className="p-3 text-sm text-xs">{lr.consignee}</td>
                <td className="p-3 text-sm">{lr.agent}</td>
                <td className="p-3 text-sm">{lr.weight}</td>
                <td className="p-3 text-sm">{lr.freight.toFixed(2)}</td>
                <td className="p-3 text-sm">{lr.createdBy}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(lr)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0 bg-[hsl(var(--logistics-blue))] hover:bg-[hsl(var(--logistics-blue))]/90"
                      title="Track"
                    >
                      <TruckIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-8 w-8 p-0 bg-[hsl(var(--logistics-blue))] hover:bg-[hsl(var(--logistics-blue))]/90"
                      title="Print"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-muted-foreground">
        Showing 1 to {sampleLRData.length} of {sampleLRData.length} entries
      </div>
    </Card>
  );
};

export default LRTable;
