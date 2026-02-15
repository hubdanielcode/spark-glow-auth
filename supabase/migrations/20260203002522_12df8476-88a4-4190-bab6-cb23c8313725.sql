-- Fix the overly permissive audit_logs INSERT policy
DROP POLICY IF EXISTS "System can create audit logs" ON public.audit_logs;

-- Create a more specific policy - only authenticated users can create their own logs
CREATE POLICY "Users can create their own audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);