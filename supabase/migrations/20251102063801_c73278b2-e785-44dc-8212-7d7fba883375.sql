-- Create LR table for storing lorry receipts
CREATE TABLE IF NOT EXISTS public.lr_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lr_no TEXT NOT NULL UNIQUE,
  lr_type TEXT NOT NULL CHECK (lr_type IN ('dummy', 'original')),
  truck_no TEXT NOT NULL,
  date DATE NOT NULL,
  from_place TEXT NOT NULL,
  to_place TEXT NOT NULL,
  invoice TEXT,
  invoice_amount NUMERIC,
  invoice_date DATE,
  eway_bill_no TEXT,
  eway_bill_date DATE,
  eway_ex_date DATE,
  po_no TEXT,
  po_date DATE,
  method_of_packing TEXT,
  address_of_delivery TEXT,
  charged_weight NUMERIC,
  lorry_type TEXT,
  billing_party TEXT,
  gst_paid_by TEXT,
  
  -- Consignor details
  consignor_name TEXT,
  consignor_address TEXT,
  consignor_city TEXT,
  consignor_contact TEXT,
  consignor_pan TEXT,
  consignor_gst TEXT,
  
  -- Consignee details
  consignee_name TEXT,
  consignee_address TEXT,
  consignee_city TEXT,
  consignee_contact TEXT,
  consignee_pan TEXT,
  consignee_gst TEXT,
  
  -- Billing To details
  billing_to_name TEXT,
  billing_to_address TEXT,
  billing_to_city TEXT,
  billing_to_contact TEXT,
  billing_to_pan TEXT,
  billing_to_gst TEXT,
  
  agent TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  weight_mt NUMERIC,
  actual_weight_mt NUMERIC,
  height NUMERIC,
  extra_height NUMERIC,
  freight NUMERIC,
  rate NUMERIC,
  rate_on TEXT,
  employee TEXT,
  truck_driver_no TEXT,
  remark TEXT,
  
  -- Design customization
  template_design TEXT DEFAULT 'standard',
  custom_logo_url TEXT,
  
  created_by TEXT DEFAULT 'SSK',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lr_details ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later with auth)
CREATE POLICY "Allow public read access to LR details" 
ON public.lr_details 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to LR details" 
ON public.lr_details 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to LR details" 
ON public.lr_details 
FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to LR details" 
ON public.lr_details 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lr_details_updated_at
BEFORE UPDATE ON public.lr_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_lr_details_lr_no ON public.lr_details(lr_no);
CREATE INDEX idx_lr_details_date ON public.lr_details(date);
CREATE INDEX idx_lr_details_truck_no ON public.lr_details(truck_no);