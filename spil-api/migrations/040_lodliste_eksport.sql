-- 040_lodliste_eksport.sql
-- Hver eksport af den samlede lodliste gemmes som en låst kopi (indhold + SHA-256),
-- så det kan dokumenteres, præcis hvilken lodliste der lå til grund for lodtrækningen.
CREATE TABLE IF NOT EXISTS lodliste_eksport (
  id               bigserial PRIMARY KEY,
  tidspunkt        timestamptz NOT NULL DEFAULT now(),
  admin_session_id text,
  sha256           text NOT NULL,
  antal_raekker    integer NOT NULL,
  csv              text NOT NULL
);
