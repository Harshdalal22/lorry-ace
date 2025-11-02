import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lrData: any;
  pdfBlob: Blob | null;
}

const ShareDialog = ({ open, onOpenChange, lrData, pdfBlob }: ShareDialogProps) => {
  const { toast } = useToast();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWhatsAppShare = async () => {
    if (!whatsappNumber) {
      toast({
        title: "Error",
        description: "Please enter a WhatsApp number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const message = `LR Details - ${lrData.lr_no}\nFrom: ${lrData.from_place}\nTo: ${lrData.to_place}\nTruck: ${lrData.truck_no}\nDate: ${new Date(lrData.date).toLocaleDateString('en-GB')}`;
      
      // Format phone number (remove spaces and add country code if needed)
      const formattedNumber = whatsappNumber.replace(/\s/g, '');
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/${formattedNumber}?text=${encodedMessage}`, '_blank');
      
      toast({
        title: "Success",
        description: "WhatsApp opened with LR details",
      });
      
      setLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error('WhatsApp share error:', error);
      toast({
        title: "Error",
        description: "Failed to share via WhatsApp",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleEmailShare = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const subject = `LR Document - ${lrData.lr_no}`;
      const body = `Please find the LR details:\n\nLR No: ${lrData.lr_no}\nFrom: ${lrData.from_place}\nTo: ${lrData.to_place}\nTruck: ${lrData.truck_no}\nDate: ${new Date(lrData.date).toLocaleDateString('en-GB')}\n\nRegards,\nSSK India Logistics`;
      
      // Open default email client
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      toast({
        title: "Success",
        description: "Email client opened with LR details",
      });
      
      setLoading(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Email share error:', error);
      toast({
        title: "Error",
        description: "Failed to share via Email",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share LR Document</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whatsapp" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                placeholder="91XXXXXXXXXX"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter number with country code (e.g., 919876543210)
              </p>
            </div>
            <Button 
              onClick={handleWhatsAppShare} 
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              Share on WhatsApp
            </Button>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleEmailShare} 
              className="w-full gap-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Share via Email
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
