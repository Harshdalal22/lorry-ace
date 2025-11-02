import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Truck, Package, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Truck className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--logistics-blue))] to-[hsl(var(--logistics-red))] bg-clip-text text-transparent">
                SSK India Logistics
              </h1>
              <p className="text-sm text-muted-foreground">Fleet Owner & Contractor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Welcome to LR Management System</h2>
            <p className="text-xl text-muted-foreground">
              Complete Lorry Receipt management solution for logistics operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate("/lr-management")}>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">LR Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Create, edit, and manage Lorry Receipts with ease
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[hsl(var(--logistics-red))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--logistics-red))]/20 transition-colors">
                  <Truck className="h-8 w-8 text-[hsl(var(--logistics-red))]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Fleet Tracking</h3>
                  <p className="text-muted-foreground text-sm">
                    Real-time tracking and monitoring of your fleet
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-[hsl(var(--logistics-blue))]/10 flex items-center justify-center group-hover:bg-[hsl(var(--logistics-blue))]/20 transition-colors">
                  <Package className="h-8 w-8 text-[hsl(var(--logistics-blue))]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Consignment Management</h3>
                  <p className="text-muted-foreground text-sm">
                    Track and manage all your consignments
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-[hsl(var(--logistics-blue))] to-[hsl(var(--logistics-red))] rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Get Started with LR Management</h3>
            <p className="mb-6 text-white/90">
              Streamline your logistics operations with our comprehensive LR management system
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/lr-management")}
              className="gap-2"
            >
              <FileText className="h-5 w-5" />
              Go to LR Management
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 SSK India Logistics. All rights reserved.</p>
          <p className="mt-1">Subject to Delhi Jurisdiction</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
