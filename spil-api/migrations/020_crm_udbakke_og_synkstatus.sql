-- 020_crm_udbakke_og_synkstatus.sql
-- 1) crm_udbakke: holdbar udgående kø til CRM'et. En slettet spiller, der havde
--    aktivt ja til SmartPack, lægges her som 'afmeld' i SAMME transaktion som
--    sletningen (src/playerDeletion.js), og src/crmSynk.js sender afmeldingen og
--    sletter derefter rækken. Kun e-mail + tidspunkt gemmes.
-- 2) samtykke.crm_synk_status: status pr. samtykke-række i stedet for kun en
--    id-markør (crm_synk.sidste_id), som kunne springe rækker over for altid,
--    når transaktioner committer i en anden rækkefølge end deres id'er.
--    NULL = ikke behandlet endnu, 'sendt' eller 'sprunget'.
-- Sikker på en DB med data: ny tabel, nullable kolonne uden default, og en
-- backfill, der kun markerer rækker op til den nuværende markør som behandlet.

CREATE TABLE IF NOT EXISTS crm_udbakke (
  id       bigserial PRIMARY KEY,
  email    citext NOT NULL,
  type     text NOT NULL DEFAULT 'afmeld' CHECK (type IN ('afmeld')),
  oprettet timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE samtykke ADD COLUMN IF NOT EXISTS crm_synk_status text CHECK (crm_synk_status IN ('sendt', 'sprunget'));

UPDATE samtykke SET crm_synk_status = 'sendt'
 WHERE liste = 'smartpack'
   AND crm_synk_status IS NULL
   AND id <= COALESCE((SELECT sidste_id FROM crm_synk WHERE navn = 'samtykke_smartpack'), 0);

CREATE INDEX IF NOT EXISTS samtykke_crm_ubehandlet_idx ON samtykke (id)
  WHERE liste = 'smartpack' AND crm_synk_status IS NULL;
