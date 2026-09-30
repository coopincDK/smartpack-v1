-- 002_seed_config.sql
-- Seeder standardkonfigurationen (DEFAULT_CFG fra spillets klientkode).
-- `pin` ligger i `hemmelig`, alt andet i `offentlig`. Se src/rules/constants.js.

INSERT INTO config (id, offentlig, hemmelig)
VALUES (
  1,
  '{
    "perDay": 5,
    "bf": true,
    "crownOn": true,
    "crownTime": "16:00",
    "mission": "total",
    "goal": 0,
    "periodName": "Hele messen",
    "periodStart": "2000-01-01",
    "teams": true,
    "raffle": true,
    "eventName": "",
    "partners": true,
    "prize": "",
    "smsSponsor": "InMobile",
    "smsOn": true,
    "mailPartners": "Herodesk, Revershero, Active Promotion, Sprii, Element Logic",
    "lifeBonus": true,
    "referral": true,
    "fixed": true,
    "hourly": true,
    "hourPrize": "",
    "duel": true,
    "smsBoost": true,
    "boostLives": 2,
    "shareUrl": ""
  }'::jsonb,
  '{"pin": "8500"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
