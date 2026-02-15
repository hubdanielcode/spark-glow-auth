
-- Remove the overly permissive INSERT policy on audit_logs
DROP POLICY IF EXISTS "Users can create their own audit logs" ON public.audit_logs;

-- Create a SECURITY DEFINER function for trusted audit logging
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_data, new_data)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_old_data, p_new_data);
$$;
