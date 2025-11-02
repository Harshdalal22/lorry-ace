import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LRFormProps {
  initialData?: any;
  onSuccess: () => void;
}

interface ItemRow {
  id: number;
  description: string;
  pcs: string;
  weight: string;
}

const LRForm = ({ initialData, onSuccess }: LRFormProps) => {
  const { toast } = useToast();
  const [lrType, setLrType] = useState<"dummy" | "original">("original");
  const [lrNo, setLrNo] = useState("");
  const [truckNo, setTruckNo] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [fromPlace, setFromPlace] = useState("");
  const [toPlace, setToPlace] = useState("");
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [poDate, setPoDate] = useState<Date>(new Date());
  const [ewayBillDate, setEwayBillDate] = useState<Date>(new Date());
  const [ewayExDate, setEwayExDate] = useState<Date>(new Date());
  const [items, setItems] = useState<ItemRow[]>([{ id: 1, description: "", pcs: "", weight: "" }]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setLrType(initialData.lr_type || "original");
      setLrNo(initialData.lr_no || "");
      setTruckNo(initialData.truck_no || "");
      setFromPlace(initialData.from_place || "");
      setToPlace(initialData.to_place || "");
      if (initialData.date) setDate(new Date(initialData.date));
      if (initialData.items) {
        try {
          const parsedItems = typeof initialData.items === 'string' 
            ? JSON.parse(initialData.items) 
            : initialData.items;
          setItems(parsedItems);
        } catch (e) {
          console.error('Error parsing items:', e);
        }
      }
    } else {
      // Generate new LR number
      const generateLRNo = async () => {
        const prefix = "DEL";
        const { count } = await supabase
          .from('lr_details')
          .select('*', { count: 'exact', head: true });
        const newNumber = (count || 0) + 1;
        setLrNo(`${prefix}/${String(newNumber).padStart(5, '0')}`);
      };
      generateLRNo();
    }
  }, [initialData]);

  const addItem = () => {
    setItems([...items, { id: items.length + 1, description: "", pcs: "", weight: "" }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const lrData = {
        lr_no: lrNo,
        lr_type: lrType,
        truck_no: truckNo,
        date: format(date, 'yyyy-MM-dd'),
        from_place: fromPlace,
        to_place: toPlace,
        invoice: formData.get('invoice') as string,
        invoice_amount: formData.get('invoiceAmount') ? parseFloat(formData.get('invoiceAmount') as string) : null,
        invoice_date: format(invoiceDate, 'yyyy-MM-dd'),
        eway_bill_no: formData.get('ewayBillNo') as string,
        eway_bill_date: format(ewayBillDate, 'yyyy-MM-dd'),
        eway_ex_date: format(ewayExDate, 'yyyy-MM-dd'),
        po_no: formData.get('poNo') as string,
        po_date: format(poDate, 'yyyy-MM-dd'),
        method_of_packing: formData.get('methodOfPacking') as string,
        address_of_delivery: formData.get('addressOfDelivery') as string,
        charged_weight: formData.get('chargedWeight') ? parseFloat(formData.get('chargedWeight') as string) : null,
        lorry_type: formData.get('lorryType') as string,
        items: JSON.stringify(items),
        weight_mt: formData.get('weightMT') ? parseFloat(formData.get('weightMT') as string) : null,
        actual_weight_mt: formData.get('actualWeightMT') ? parseFloat(formData.get('actualWeightMT') as string) : null,
        height: formData.get('height') ? parseFloat(formData.get('height') as string) : null,
        extra_height: formData.get('extraHeight') ? parseFloat(formData.get('extraHeight') as string) : null,
        freight: formData.get('freight') ? parseFloat(formData.get('freight') as string) : null,
        rate: formData.get('rate') ? parseFloat(formData.get('rate') as string) : null,
      };

      let error;
      if (initialData?.id) {
        // Update existing LR
        ({ error } = await supabase
          .from('lr_details')
          .update(lrData)
          .eq('id', initialData.id));
      } else {
        // Insert new LR
        ({ error } = await supabase
          .from('lr_details')
          .insert([lrData]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `LR ${initialData ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error saving LR:', error);
      toast({
        title: "Error",
        description: "Failed to save LR. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        {/* Basic Details Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">LR TYPE*</Label>
            <RadioGroup value={lrType} onValueChange={(val) => setLrType(val as "dummy" | "original")} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dummy" id="dummy" />
                <Label htmlFor="dummy" className="font-normal cursor-pointer">Dummy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="original" id="original" />
                <Label htmlFor="original" className="font-normal cursor-pointer">Original</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="truckNo">TRUCK NO*</Label>
            <Input 
              id="truckNo" 
              name="truckNo"
              placeholder="TRUCK NO" 
              value={truckNo}
              onChange={(e) => setTruckNo(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lrNo">LR NO*</Label>
            <Input 
              id="lrNo" 
              name="lrNo"
              placeholder="LR NO" 
              value={lrNo}
              onChange={(e) => setLrNo(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label>DATE*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromPlace">FROM PLACE*</Label>
            <Input 
              id="fromPlace" 
              name="fromPlace"
              placeholder="FROM PLACE" 
              value={fromPlace}
              onChange={(e) => setFromPlace(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="toPlace">TO PLACE*</Label>
            <Input 
              id="toPlace" 
              name="toPlace"
              placeholder="TO PLACE" 
              value={toPlace}
              onChange={(e) => setToPlace(e.target.value)}
              required 
            />
          </div>
        </div>

        {/* Invoice and Eway Details */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="invoice">INVOICE</Label>
            <Input id="invoice" placeholder="INVOICE" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceAmount">INVOICE AMOUNT</Label>
            <Input id="invoiceAmount" placeholder="INVOICE AMOUNT" type="number" />
          </div>

          <div className="space-y-2">
            <Label>INVOICE DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(invoiceDate, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={invoiceDate} onSelect={(date) => date && setInvoiceDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ewayBillNo">EWAY BILL NO</Label>
            <Input id="ewayBillNo" placeholder="EWAY BILL NO" />
          </div>

          <div className="space-y-2">
            <Label>EWAY BILL DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(ewayBillDate, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={ewayBillDate} onSelect={(date) => date && setEwayBillDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>EWAY EX. DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(ewayExDate, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={ewayExDate} onSelect={(date) => date && setEwayExDate(date)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* PO and Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="poNo">P.O. NO</Label>
            <Input id="poNo" placeholder="P.O. NO" />
          </div>

          <div className="space-y-2">
            <Label>P.O. DATE</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(poDate, "dd-MM-yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={poDate} onSelect={(date) => date && setPoDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="methodOfPacking">METHOD OF PACKING</Label>
            <Input id="methodOfPacking" placeholder="METHOD OF PACKING" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressOfDelivery">ADDRESS OF DELIVERY</Label>
            <Input id="addressOfDelivery" placeholder="ADDRESS OF DELIVERY" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chargedWeight">CHARGED WEIGHT</Label>
            <Input id="chargedWeight" placeholder="CHARGED WEIGHT" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lorryType">LORRY TYPE</Label>
            <Input id="lorryType" placeholder="LORRY TYPE" />
          </div>
        </div>

        {/* Billing Party and GST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="billingParty">BILLING PARTY</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Billing Party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="party1">Party 1</SelectItem>
                <SelectItem value="party2">Party 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstPaidBy">GST PAID BY</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select GST Paid By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consignor">Consignor</SelectItem>
                <SelectItem value="consignee">Consignee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Consignor, Consignee, Billing To Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Consignor */}
          <Card className="p-4 bg-[hsl(var(--logistics-red))] text-white">
            <h3 className="font-bold mb-3">CONSIGNOR</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="consignorName" className="text-white">NAME</Label>
                <Select>
                  <SelectTrigger className="bg-white text-foreground">
                    <SelectValue placeholder="Select Consignor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">Consignor 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="ADDRESS" className="bg-white text-foreground min-h-[80px]" />
              <Input placeholder="CITY" className="bg-white text-foreground" />
              <Input placeholder="CONTACT" className="bg-white text-foreground" />
              <Input placeholder="PAN" className="bg-white text-foreground" />
              <Input placeholder="GST" className="bg-white text-foreground" />
            </div>
          </Card>

          {/* Consignee */}
          <Card className="p-4 bg-[hsl(var(--logistics-red))] text-white">
            <h3 className="font-bold mb-3">CONSIGNEE</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="consigneeName" className="text-white">NAME</Label>
                <Select>
                  <SelectTrigger className="bg-white text-foreground">
                    <SelectValue placeholder="Select Consignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c1">Consignee 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="ADDRESS" className="bg-white text-foreground min-h-[80px]" />
              <Input placeholder="CITY" className="bg-white text-foreground" />
              <Input placeholder="CONTACT" className="bg-white text-foreground" />
              <Input placeholder="PAN" className="bg-white text-foreground" />
              <Input placeholder="GST" className="bg-white text-foreground" />
            </div>
          </Card>

          {/* Billing To */}
          <Card className="p-4 bg-[hsl(var(--logistics-red))] text-white">
            <h3 className="font-bold mb-3">BILLING TO</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="billingToName" className="text-white">NAME</Label>
                <Select>
                  <SelectTrigger className="bg-white text-foreground">
                    <SelectValue placeholder="Select Billing Party" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="b1">Billing Party 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea placeholder="ADDRESS" className="bg-white text-foreground min-h-[80px]" />
              <Input placeholder="CITY" className="bg-white text-foreground" />
              <Input placeholder="CONTACT" className="bg-white text-foreground" />
              <Input placeholder="PAN" className="bg-white text-foreground" />
              <Input placeholder="GST" className="bg-white text-foreground" />
            </div>
          </Card>
        </div>

        {/* Agent */}
        <div className="mb-6">
          <Label htmlFor="agent">AGENT</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agent1">Agent 1</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <Label className="text-lg font-semibold">Item Details</Label>
            <Button type="button" onClick={addItem} size="sm" variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-3 text-left font-semibold w-16">#</th>
                  <th className="p-3 text-left font-semibold">DESCRIPTION</th>
                  <th className="p-3 text-left font-semibold w-32">PCS</th>
                  <th className="p-3 text-left font-semibold w-32">WEIGHT</th>
                  <th className="p-3 text-left font-semibold w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2 text-center">{item.id}</td>
                    <td className="p-2">
                      <Input 
                        placeholder="Description" 
                        value={item.description}
                        onChange={(e) => {
                          const newItems = items.map(i => 
                            i.id === item.id ? { ...i, description: e.target.value } : i
                          );
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        placeholder="PCS" 
                        type="number"
                        value={item.pcs}
                        onChange={(e) => {
                          const newItems = items.map(i => 
                            i.id === item.id ? { ...i, pcs: e.target.value } : i
                          );
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        placeholder="Weight" 
                        type="number"
                        value={item.weight}
                        onChange={(e) => {
                          const newItems = items.map(i => 
                            i.id === item.id ? { ...i, weight: e.target.value } : i
                          );
                          setItems(newItems);
                        }}
                      />
                    </td>
                    <td className="p-2 text-center">
                      {items.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weight and Freight Details */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="weightMT">WEIGHT (MT)</Label>
            <Input id="weightMT" placeholder="WEIGHT (MT)" type="number" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualWeightMT">ACTUAL WEIGHT (MT)</Label>
            <Input id="actualWeightMT" placeholder="WEIGHT (MT)" type="number" step="0.01" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">HEIGHT</Label>
            <Input id="height" placeholder="HEIGHT" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extraHeight">EXTRA HEIGHT</Label>
            <Input id="extraHeight" placeholder="EX HEIGHT" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freight">FREIGHT</Label>
            <Input id="freight" placeholder="FREIGHT" type="number" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">RATE</Label>
            <Input id="rate" placeholder="RATE" type="number" />
          </div>
        </div>

        {/* Rate On, Employee, Driver */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="rateOn">RATE ON</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Rate Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="perkg">Per KG</SelectItem>
                <SelectItem value="permt">Per MT</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee">EMPLOYEE</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emp1">Employee 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="truckDriverNo">TRUCK DRIVER NO</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Driver" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="driver1">Driver 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Remark */}
        <div className="mb-6">
          <Label htmlFor="remark">REMARK</Label>
          <Textarea id="remark" placeholder="Enter remarks..." rows={4} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button type="submit" size="lg" className="px-8">
            UPDATE & SAVE
          </Button>
          <Button type="button" variant="destructive" size="lg" className="px-8" onClick={onSuccess}>
            CANCEL
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default LRForm;
