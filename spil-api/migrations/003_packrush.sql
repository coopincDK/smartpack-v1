-- 003_packrush.sql
-- Packrush-ombygningen: spillet blev omdøbt fra "Pluk. Pak. Send." til
-- "Packrush" i commit ec81ec6e1 (spil/index.html), hvilket medførte ægte
-- regelændringer i liv-/samtykke-logikken. Se API.md, afsnit
-- "Packrush-ændringer", for den fulde begrundelse.

-- ---------------------------------------------------------------------------
-- Liv: nyt dagligt grundtal (perDay 5 -> 3). MAX_LIVES-loftet (7) er en
-- ren kode-konstant (src/rules/constants.js) og kræver ingen skemaændring.
-- Rammer KUN 'perDay' i den eksisterende config-række — andre
-- admin-tilpasninger i offentlig-kolonnen bevares.
-- ---------------------------------------------------------------------------
UPDATE config SET offentlig = jsonb_set(offentlig, '{perDay}', '3'::jsonb) WHERE id = 1;

-- ---------------------------------------------------------------------------
-- Dagens flueben: NYT koncept, adskilt fra den varige tilmelding
-- (spiller.marketing/mail_to/notify). Svarer til klientens p.tick =
-- {day, keys}. Bemærk: L.g (hvilke lister der allerede har givet liv i dag)
-- genbruger UÆNDRET spiller.ekstra_01 — det blev allerede taget i brug til
-- præcis dette i fase 1 (se ekstrafelt-tabellen), så der er ikke brug for
-- endnu en kolonne til det.
-- ---------------------------------------------------------------------------
ALTER TABLE spiller ADD COLUMN tick_dag date;
ALTER TABLE spiller ADD COLUMN tick_keys jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- Samtykke: omlægges fra "én række = ét abonnement, med et evt.
-- trukket_tilbage-tidspunkt sat på samme række" til en ren, append-only
-- HÆNDELSESLOG: én række = én hændelse (enten en bekræftelse eller en
-- tilbagetrækning), tidsstemplet i `tidspunkt`. Den afledte VARIGE status
-- pr. (spiller, liste) er nu "hvilken type har den SENESTE hændelse" — se
-- samtykke_status-viewet nedenfor.
--
-- Der er (efter aftale) ingen substantielle rigtige spillerdata at bevare
-- i denne tabel endnu (kun en allerede slettet testspiller) — men vi
-- migrerer robust alligevel: enhver historisk afmeldt række (trukket_tilbage
-- IS NOT NULL) splittes til to hændelsesrækker, så ingen historik tabes,
-- hvis der alligevel skulle ligge noget.
-- ---------------------------------------------------------------------------
ALTER TABLE samtykke ADD COLUMN type text;
UPDATE samtykke SET type = 'bekraeftet' WHERE type IS NULL;

INSERT INTO samtykke (spiller_id, liste, givet, tekst, tekst_version, kilde, ip, user_agent, type)
SELECT spiller_id, liste, trukket_tilbage, tekst, tekst_version, kilde, ip, user_agent, 'trukket_tilbage'
FROM samtykke
WHERE trukket_tilbage IS NOT NULL;

ALTER TABLE samtykke ALTER COLUMN type SET NOT NULL;
ALTER TABLE samtykke ADD CONSTRAINT samtykke_type_check CHECK (type IN ('bekraeftet', 'trukket_tilbage'));

-- Byggede på "trukket_tilbage IS NULL = aktiv"-modellen, giver ikke mening
-- for en hændelseslog (flere rækker pr. spiller+liste er nu forventet).
DROP INDEX IF EXISTS samtykke_aktiv_unik;
ALTER TABLE samtykke DROP COLUMN trukket_tilbage;
ALTER TABLE samtykke RENAME COLUMN givet TO tidspunkt;

CREATE INDEX samtykke_spiller_liste_tid_idx ON samtykke (spiller_id, liste, tidspunkt DESC);

-- ---------------------------------------------------------------------------
-- Afledt VARIG status pr. (spiller, liste): den seneste hændelse afgør om
-- listen er aktiv. Bevidst en almindelig VIEW (ikke en materialiseret eller
-- separat vedligeholdt tabel) — nemmest at forstå og altid korrekt uden
-- transaktionel bogføring; datamængden (én messes samtykke-hændelser) er
-- lille nok til at DISTINCT ON-scanningen er billig. Bruges af GET /me,
-- admin-CSV-eksporterne, og det natlige GDPR-oprydningsjob (src/retention.js).
-- ---------------------------------------------------------------------------
CREATE VIEW samtykke_status AS
SELECT DISTINCT ON (spiller_id, liste)
  spiller_id, liste, type AS seneste_type, tidspunkt AS seneste_tidspunkt
FROM samtykke
ORDER BY spiller_id, liste, tidspunkt DESC, id DESC;

-- ---------------------------------------------------------------------------
-- Admin/stand-sessioner: 'stand' er en ny, langtlevende sessionstype der
-- KUN giver ret til at se fulde spillernavne (GET /state, WS-broadcasts,
-- duel-presence) — ingen andre admin-rettigheder. Se API.md, afsnit
-- "Stand-login-flow", og src/middleware/adminAuth.js.
-- ---------------------------------------------------------------------------
ALTER TABLE admin_session ADD COLUMN rolle text NOT NULL DEFAULT 'admin' CHECK (rolle IN ('admin', 'stand'));

-- Ét-gangs-koder udstedt fra adminpanelet (POST /admin/stand-login-kode),
-- tastet ind på standtablettens egen browser (POST /stand-login), som ved
-- match udsteder en 'stand'-session til DEN forbindelse.
CREATE TABLE stand_login_kode (
  kode        text PRIMARY KEY,
  udloeber    timestamptz NOT NULL,
  brugt       boolean NOT NULL DEFAULT false,
  oprettet    timestamptz NOT NULL DEFAULT now()
);
