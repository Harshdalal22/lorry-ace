import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Palette, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseReady } from "@/integrations/supabase/safe-client";

interface DesignCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (design: { template: string; logoUrl?: string }) => void;
}

const DesignCustomizer = ({ open, onOpenChange, onSave }: DesignCustomizerProps) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const templates = [
    { id: "standard", name: "Standard SSK Template", preview: "Default red & blue design" },
    { id: "modern", name: "Modern Template", preview: "Clean minimalist design" },
    { id: "classic", name: "Classic Template", preview: "Traditional business style" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('lr_assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('lr_assets')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);

      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      template: selectedTemplate,
      logoUrl: logoUrl || undefined,
    });
    
    toast({
      title: "Design Saved",
      description: "Your LR design has been customized successfully",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Customize LR Design
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                type="url"
                placeholder="Enter logo URL or upload"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Logo will appear in the header of your LR document. Max size: 2MB
            </p>
            {logoUrl && (
              <div className="mt-2">
                <img src={logoUrl} alt="Logo preview" className="h-16 w-16 object-contain border rounded" />
              </div>
            )}
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Select Template Design</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate === template.id
                      ? "border-primary border-2 bg-primary/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted to-background rounded border flex items-center justify-center mb-3">
                    <div className="text-center text-xs text-muted-foreground">
                      Template Preview
                    </div>
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                  <p className="text-xs text-muted-foreground">{template.preview}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* AI Design Generator (Future Feature) */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">AI Design Generator</h4>
                <p className="text-xs text-muted-foreground">
                  Coming soon: Let AI create custom LR designs for you
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Try AI
              </Button>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Design
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignCustomizer;
