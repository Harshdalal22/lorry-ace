import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Truck as TruckIcon, Printer, Trash2, Search, Share2, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import LRPDFTemplate from "./LRPDFTemplate";
import ShareDialog from "./ShareDialog";
import DesignCustomizer from "./DesignCustomizer";

interface LRTableProps {
  onEdit: (lr: any) => void;
}

const LRTable = ({ onEdit }: LRTableProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("50");
  const [lrData, setLrData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [designDialogOpen, setDesignDialogOpen] = useState(false);
  const [selectedLR, setSelectedLR] = useState<any>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Fetch LR data from database
  useEffect(() => {
    fetchLRData();
  }, []);

  const fetchLRData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lr_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLrData(data || []);
    } catch (error) {
      console.error('Error fetching LR data:', error);
      toast({
        title: "Error",
        description: "Failed to load LR data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this LR?')) return;

    try {
      const { error } = await supabase
        .from('lr_details')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "LR deleted successfully",
      });

      fetchLRData();
    } catch (error) {
      console.error('Error deleting LR:', error);
      toast({
        title: "Error",
        description: "Failed to delete LR",
        variant: "destructive",
      });
    }
  };

  const handlePrint = async (lr: any) => {
    try {
      setSelectedLR(lr);
      
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your LR document...",
      });

      // Wait for the template to render with the new data
      setTimeout(async () => {
        if (!pdfTemplateRef.current) {
          toast({
            title: "Error",
            description: "PDF template not found",
            variant: "destructive",
          });
          return;
        }

        try {
          // Capture the template as canvas
          const canvas = await html2canvas(pdfTemplateRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: 794, // A4 width in pixels at 96 DPI
            windowHeight: 1123, // A4 height in pixels at 96 DPI
          });

          // Validate canvas dimensions
          if (!canvas || canvas.width === 0 || canvas.height === 0) {
            throw new Error('Invalid canvas dimensions');
          }

          // Create PDF
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          // A4 size in mm
          const pdfWidth = 210;
          const pdfHeight = 297;
          
          // Calculate dimensions to fit on A4
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasHeight / canvasWidth;
          
          let imgWidth = pdfWidth;
          let imgHeight = pdfWidth * ratio;
          
          // If height exceeds page, scale down
          if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = pdfHeight / ratio;
          }

          // Validate final dimensions
          if (!isFinite(imgWidth) || !isFinite(imgHeight) || imgWidth <= 0 || imgHeight <= 0) {
            throw new Error('Invalid image dimensions calculated');
          }

          // Convert canvas to image
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          
          // Add image to PDF - center it if needed
          const xOffset = (pdfWidth - imgWidth) / 2;
          const yOffset = 0;
          
          pdf.addImage(imgData, 'JPEG', xOffset, yOffset, imgWidth, imgHeight);
          
          // Save PDF with automatic download
          pdf.save(`LR_${lr.lr_no}.pdf`);
          
          // Also create blob for sharing
          const blob = pdf.output('blob');
          setPdfBlob(blob);

          toast({
            title: "Success",
            description: `PDF downloaded as LR_${lr.lr_no}.pdf`,
          });
        } catch (error) {
          console.error('Error in PDF generation:', error);
          toast({
            title: "Error",
            description: "Failed to generate PDF. Please try again.",
            variant: "destructive",
          });
        }
      }, 800);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const handleShare = (lr: any) => {
    setSelectedLR(lr);
    setShareDialogOpen(true);
  };

  const handleDesign = (lr: any) => {
    setSelectedLR(lr);
    setDesignDialogOpen(true);
  };

  const handleSaveDesign = async (design: { template: string; logoUrl?: string }) => {
    if (!selectedLR) return;

    try {
      const { error } = await supabase
        .from('lr_details')
        .update({
          template_design: design.template,
          custom_logo_url: design.logoUrl,
        })
        .eq('id', selectedLR.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Design preferences saved",
      });

      fetchLRData();
    } catch (error) {
      console.error('Error saving design:', error);
      toast({
        title: "Error",
        description: "Failed to save design",
        variant: "destructive",
      });
    }
  };

  const filteredData = lrData.filter((lr) =>
    Object.values(lr).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
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
                <th className="p-3 text-left font-semibold text-sm">FREIGHT</th>
                <th className="p-3 text-left font-semibold text-sm">CREATED BY</th>
                <th className="p-3 text-left font-semibold text-sm">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-muted-foreground">
                    Loading LR data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-muted-foreground">
                    No LR records found
                  </td>
                </tr>
              ) : (
                filteredData.map((lr, index) => (
                  <tr key={lr.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3 text-sm">{index + 1}</td>
                    <td className="p-3 text-sm">
                      <span className="text-primary font-medium">{lr.lr_no}</span>
                    </td>
                    <td className="p-3 text-sm">{new Date(lr.date).toLocaleDateString('en-GB')}</td>
                    <td className="p-3 text-sm">{lr.truck_no}</td>
                    <td className="p-3 text-sm">{lr.from_place}</td>
                    <td className="p-3 text-sm">{lr.to_place}</td>
                    <td className="p-3 text-sm text-xs">{lr.consignor_name}</td>
                    <td className="p-3 text-sm text-xs">{lr.consignee_name}</td>
                    <td className="p-3 text-sm">{lr.agent}</td>
                    <td className="p-3 text-sm">{lr.weight_mt}</td>
                    <td className="p-3 text-sm">{lr.freight}</td>
                    <td className="p-3 text-sm">{lr.created_by}</td>
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
                          title="Customize Design"
                          onClick={() => handleDesign(lr)}
                        >
                          <Palette className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 w-8 p-0 bg-[hsl(var(--logistics-blue))] hover:bg-[hsl(var(--logistics-blue))]/90"
                          title="Print PDF"
                          onClick={() => handlePrint(lr)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                          title="Share"
                          onClick={() => handleShare(lr)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          title="Delete"
                          onClick={() => handleDelete(lr.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredData.length > 0 ? 1 : 0} to {filteredData.length} of {filteredData.length} entries
        </div>
      </Card>

      {/* Hidden PDF Template for rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        {selectedLR && (
          <LRPDFTemplate ref={pdfTemplateRef} data={selectedLR} logoUrl={selectedLR?.custom_logo_url} />
        )}
      </div>

      {/* Share Dialog */}
      {selectedLR && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          lrData={selectedLR}
          pdfBlob={pdfBlob}
        />
      )}

      {/* Design Customizer */}
      {selectedLR && (
        <DesignCustomizer
          open={designDialogOpen}
          onOpenChange={setDesignDialogOpen}
          onSave={handleSaveDesign}
        />
      )}
    </>
  );
};

export default LRTable;
