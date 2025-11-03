-- Create storage bucket for LR assets (logos, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('lr_assets', 'lr_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to LR assets
CREATE POLICY "Public read access to LR assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'lr_assets');

-- Create policy for authenticated upload to LR assets
CREATE POLICY "Authenticated users can upload LR assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lr_assets');

-- Create policy for authenticated update to LR assets
CREATE POLICY "Authenticated users can update their LR assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lr_assets');

-- Create policy for authenticated delete of LR assets
CREATE POLICY "Authenticated users can delete their LR assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'lr_assets');