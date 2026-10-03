-- Partnere uden egen privatlivspolitik kan vælge Packrush' standardpolitik.
-- Så peger privatlivspolitik på /spil/partnerprivatliv/?p=<slug>, som bygges
-- af partnerens firmanavn, CVR, adresse og afmeldingsmail.
ALTER TABLE partner ADD COLUMN IF NOT EXISTS privatliv_standard boolean NOT NULL DEFAULT false;
ALTER TABLE partner ADD COLUMN IF NOT EXISTS privatliv_standard_tid timestamptz;
