-- 056_partner_samler_mails.sql
-- Ikke alle partnere skal samle mails (Martin, 8. okt. 2026). FikPay og SmartPack Onboarding
-- giver kun en gave og må ikke stå som flueben i spillets tilmeldingslister eller i
-- oversigten over indsamlede mails. Eksisterende samtykker bevares uændret i samtykke-loggen.
ALTER TABLE partner ADD COLUMN IF NOT EXISTS samler_mails boolean NOT NULL DEFAULT true;

UPDATE partner SET samler_mails = false
 WHERE slug IN ('fikpay', 'smartpack-onboarding')
    OR regexp_replace(lower(navn), '[^a-z0-9æøå]', '', 'g') IN ('fikpay', 'smartpackonboarding');
