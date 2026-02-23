-- 5. Create storage bucket for medical reports
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports', 'reports', true)
ON CONFLICT DO NOTHING;

-- Drop policy if exists then recreate to allow all operations by anon for this bucket
DROP POLICY IF EXISTS "Allow public full access" ON storage.objects;
CREATE POLICY "Allow public full access" ON storage.objects FOR ALL USING (bucket_id = 'reports') WITH CHECK (bucket_id = 'reports');
