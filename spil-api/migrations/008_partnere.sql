-- 008_partnere.sql
-- Partnere til Packrush: partnerprofil, præmie, power-up-kobling, partnerbrugere
-- (login med startkode, der skal skiftes første gang) og én konkurrence med
-- dato for lodtrækning og tekster, som admin selv kan rette.
--
-- Partnere slettes ikke fysisk fra admin: "slet" arkiverer (status='arkiveret'),
-- så spillernes samtykke til en partners nyhedsmail stadig kan dokumenteres.
-- `slug` er partnerens faste id og må ikke skifte, selv om navnet rettes.

CREATE TABLE partner (
  id                  uuid PRIMARY KEY,
  slug                text NOT NULL UNIQUE,
  status              text NOT NULL DEFAULT 'aktiv'
                        CHECK (status IN ('ansoegt', 'aktiv', 'afvist', 'arkiveret')),
  vist_i_spil         boolean NOT NULL DEFAULT false,
  -- Hvilken power-up-type i spillet partneren er knyttet til (NULL = ingen).
  powerup             text,

  navn                text NOT NULL,          -- visningsnavn, fx "Herodesk"
  firmanavn           text NOT NULL DEFAULT '',
  cvr                 text NOT NULL DEFAULT '',
  adresse             text NOT NULL DEFAULT '',
  hjemmeside          text NOT NULL DEFAULT '',
  kort_beskrivelse    text NOT NULL DEFAULT '',  -- hvad de kan hjælpe en webshop med
  beskrivelse         text NOT NULL DEFAULT '',  -- længere tekst til partnersiden
  kontakt_navn        text NOT NULL DEFAULT '',
  kontakt_email       text NOT NULL DEFAULT '',
  kontakt_telefon     text NOT NULL DEFAULT '',

  giver_praemie       boolean NOT NULL DEFAULT false,
  praemie_titel       text NOT NULL DEFAULT '',
  praemie_vaerdi      integer CHECK (praemie_vaerdi IS NULL OR praemie_vaerdi >= 0), -- kr.
  praemie_vaerdi_type text NOT NULL DEFAULT 'fast' CHECK (praemie_vaerdi_type IN ('fast', 'op_til')),
  praemie_moms        text NOT NULL DEFAULT 'ekskl' CHECK (praemie_moms IN ('ekskl', 'inkl')),
  praemie_beskrivelse text NOT NULL DEFAULT '',  -- præcis hvad præmien er
  praemie_udbytte     text NOT NULL DEFAULT '',  -- hvad vinderen får ud af den
  praemie_betingelser text NOT NULL DEFAULT '',  -- påkrævet ved 'op_til' / løbende værdi
  praemie_indloesning text NOT NULL DEFAULT '',  -- hvordan og hvornår præmien indløses

  -- Fra ansøgningsformularen (kun læst af admin).
  ansoegning_besked   text NOT NULL DEFAULT '',

  logo                bytea,
  logo_type           text,

  oprettet            timestamptz NOT NULL DEFAULT now(),
  opdateret           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX partner_status_idx ON partner (status);

CREATE TABLE partner_bruger (
  id                uuid PRIMARY KEY,
  partner_id        uuid NOT NULL REFERENCES partner(id) ON DELETE CASCADE,
  email             text NOT NULL UNIQUE,     -- gemmes i små bogstaver
  navn              text NOT NULL DEFAULT '',
  password_hash     text NOT NULL,
  skal_skifte_kode  boolean NOT NULL DEFAULT true,
  oprettet          timestamptz NOT NULL DEFAULT now(),
  sidst_login       timestamptz
);

CREATE INDEX partner_bruger_partner_idx ON partner_bruger (partner_id);

CREATE TABLE partner_session (
  id          uuid PRIMARY KEY,
  bruger_id   uuid NOT NULL REFERENCES partner_bruger(id) ON DELETE CASCADE,
  token_hash  text NOT NULL UNIQUE,
  udloeber    timestamptz NOT NULL,
  oprettet    timestamptz NOT NULL DEFAULT now()
);

-- Én aktuel konkurrence (samme mønster som config: id = 1).
CREATE TABLE konkurrence (
  id                 integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  navn               text NOT NULL DEFAULT 'Packrush på E-handelskonferencen',
  lodtraekning       timestamptz,               -- hvornår vinderen trækkes
  tekst_aktiv        text NOT NULL DEFAULT '',  -- vises mens konkurrencen kører
  tekst_slut         text NOT NULL DEFAULT 'Lige nu er der ingen aktiv konkurrence.',
  opdateret          timestamptz NOT NULL DEFAULT now()
);

INSERT INTO konkurrence (id) VALUES (1);
