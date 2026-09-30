-- 004_opfoelgning.sql
-- Opfølgende sikkerheds-/funktionsrunde efter Packrush (se API.md,
-- "Opfølgende ændringer" og "Packrush-ændringer" for baggrunden). Kun
-- SKEMAÆNDRING nødvendig i denne runde er en varig audit-log til
-- POST /admin/nulstil — se nedenfor. De øvrige punkter (firma valgfrit,
-- admin/afmeld, TOCTOU-lås, anonymisering, WS-revalidering,
-- Europe/Copenhagen-dage) kræver ingen skemaændring.

-- ---------------------------------------------------------------------------
-- admin_audit_log: varigt (IKKE cascade-slettet, refererer ikke til
-- spiller-rækker) audit-spor for administrative handlinger med bred
-- konsekvens. Bruges lige nu KUN af POST /admin/nulstil (tidspunkt, antal
-- slettede spillere, og hvilken admin-session der udførte det — ALDRIG
-- adgangskoden). `admin_session_id` er bevidst UDEN fremmednøgle-constraint,
-- da selve admin_session-rækken kan være ryddet (session udløbet/logget ud)
-- længe efter at audit-loggen fortsat skal kunne læses.
-- ---------------------------------------------------------------------------
CREATE TABLE admin_audit_log (
  id                bigserial PRIMARY KEY,
  tidspunkt         timestamptz NOT NULL DEFAULT now(),
  admin_session_id  uuid,
  handling          text NOT NULL,
  antal             integer,
  detaljer          jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX admin_audit_log_tidspunkt_idx ON admin_audit_log (tidspunkt DESC);
