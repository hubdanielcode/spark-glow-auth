-- Store settings table (key-value)
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage store settings"
ON public.store_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can read store settings"
ON public.store_settings
FOR SELECT
USING (true);

-- Seed default settings
INSERT INTO public.store_settings (key, value) VALUES
  ('store_info', '{"name": "Flaré", "description": "Velas artesanais premium", "email": "contato@flare.com.br", "phone": "(11) 99999-9999", "instagram": "@flare.velas"}'::jsonb),
  ('shipping', '{"free_shipping_threshold": 199, "default_shipping_cost": 15, "estimated_days_min": 3, "estimated_days_max": 7}'::jsonb),
  ('notifications', '{"email_new_order": true, "email_low_stock": true, "low_stock_threshold": 5}'::jsonb);
