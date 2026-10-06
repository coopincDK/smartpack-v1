-- 028_nye_partnere_kristian.sql
-- Clarefy og FikPay (forslag fra Kristian Konradsen, Zignifikant, 5. okt. 2026).
-- Oprettes SKJULT (vist_i_spil = false), indtil kontaktperson og gavens værdi er bekræftet.
-- Firmadata er hentet fra deres egne hjemmesider. Gaven: 6 mdr. gratis abonnement.
-- Kun oprettelse, hvis slug ikke findes i forvejen.
-- Smart Send er fravalgt (laver også pluk og pak, overlapper med SmartPack).

INSERT INTO partner (id, slug, status, vist_i_spil, navn, firmanavn, cvr, adresse, hjemmeside,
                     kort_beskrivelse, produktkategori, privatlivspolitik, afmeld_email,
                     giver_praemie, praemie_titel, praemie_beskrivelse, praemie_flyt)
SELECT gen_random_uuid(), v.slug, 'aktiv', false, v.navn, v.firmanavn, v.cvr, v.adresse, v.hjemmeside,
       v.kort, v.kategori, v.privatliv, v.afmeld,
       true, v.titel, v.beskr, 'nej'
FROM (VALUES
  ('clarefy', 'Clarefy', 'Clarefy.ai ApS', '46239121', 'Ved Stranden 11D, 2. th., 9000 Aalborg', 'https://clarefy.ai/',
   'AI-lagerplanlægning til e-commerce: undgå udsolgte bestsellere og overstock, og automatisér indkøbet.',
   'AI-lagerplanlægning og indkøb til webshops', 'https://clarefy.ai/privatliv', 'pls@clarefy.ai',
   '6 måneders gratis Clarefy', 'Vinderen får 6 måneders gratis abonnement på Clarefy, AI-lagerplanlægning og automatiseret indkøb.'),
  ('fikpay', 'FikPay', 'Fikpay', '', '', 'https://fikpay.com/',
   'Fakturaer med FI-kode til Shopify: erhvervskunder betaler på faktura, og betalingen matches automatisk i banken.',
   'fakturering og betaling for B2B-kunder i Shopify', 'https://fikpay.com/privacy', '',
   '6 måneders gratis FikPay', 'Vinderen får 6 måneders gratis abonnement på FikPay, fakturaer med FI-kode til Shopify.')
) AS v(slug, navn, firmanavn, cvr, adresse, hjemmeside, kort, kategori, privatliv, afmeld, titel, beskr)
WHERE NOT EXISTS (SELECT 1 FROM partner p WHERE p.slug = v.slug)
  -- Kun i den rigtige database (hvor Zignifikant findes), ikke i en tom testdatabase.
  AND EXISTS (SELECT 1 FROM partner z WHERE lower(z.navn) = 'zignifikant');
