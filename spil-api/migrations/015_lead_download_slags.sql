-- Partnerens lead-download stemples, så næste download kan hentes "siden
-- sidst": kun nye samtykker og de afmeldinger, partneren skal fjerne fra sin
-- egen liste. slags: 'alle' (hele den aktive liste) eller 'aendringer'.
ALTER TABLE partner_lead_download ADD COLUMN IF NOT EXISTS slags text NOT NULL DEFAULT 'alle';
ALTER TABLE partner_lead_download ADD COLUMN IF NOT EXISTS siden timestamptz;
