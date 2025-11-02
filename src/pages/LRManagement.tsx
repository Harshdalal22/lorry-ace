import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LRForm from "@/components/lr/LRForm";
import LRTable from "@/components/lr/LRTable";
import { Plus, FileText, Truck } from "lucide-react";

const LRManagement = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedLR, setSelectedLR] = useState<any>(null);

  const handleNewLR = () => {
    setSelectedLR(null);
    setActiveTab("create");
  };

  const handleEditLR = (lr: any) => {
    setSelectedLR(lr);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Truck className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">SSK India Logistics</h1>
                  <p className="text-sm text-muted-foreground">LR Management System</p>
                </div>
              </div>
            </div>
            <Button onClick={handleNewLR} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add New LR
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="list" className="gap-2">
              <FileText className="h-4 w-4" />
              View LR Details
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              {selectedLR ? "Edit LR" : "Create New LR"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <LRTable onEdit={handleEditLR} />
          </TabsContent>

          <TabsContent value="create" className="mt-0">
            <LRForm 
              initialData={selectedLR} 
              onSuccess={() => {
                setActiveTab("list");
                setSelectedLR(null);
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default LRManagement;
