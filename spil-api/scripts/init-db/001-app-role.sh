#!/bin/sh
# Kører automatisk af det officielle postgres-image ved FØRSTE opstart (dvs.
# kun når datavolumet er tomt) via docker-entrypoint-initdb.d/. Formål:
# oprette en dedikeret, IKKE-superbruger app-rolle med kun de rettigheder
# selve appen skal bruge på POSTGRES_DB. Containerens bootstrap-superbruger
# (POSTGRES_USER, sat af docker-compose.yml's db-service) må ALDRIG bruges af
# api-servicen — den bruger DATABASE_URL, som peger på denne app-rolle i
# stedet (se .env.example).
set -e

: "${APP_DB_USER:?APP_DB_USER skal være sat i .env}"
: "${APP_DB_PASSWORD:?APP_DB_PASSWORD skal være sat i .env}"
: "${POSTGRES_DB:?POSTGRES_DB skal være sat i .env}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${APP_DB_USER}') THEN
      CREATE ROLE "${APP_DB_USER}" WITH LOGIN PASSWORD '${APP_DB_PASSWORD}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
    END IF;
  END
  \$\$;

  -- Kun rettigheder på DENNE database/skema, ingen superuser-beføjelser.
  -- CREATE på schema public er nødvendigt for at migrations (src/db.js)
  -- selv kan oprette tabeller ved serveropstart, og for "CREATE EXTENSION
  -- IF NOT EXISTS citext" (citext er en "trusted" extension i Postgres 16,
  -- så det kræver ikke superuser — kun CREATE på skemaet).
  GRANT CONNECT, CREATE ON DATABASE "${POSTGRES_DB}" TO "${APP_DB_USER}";
  GRANT USAGE, CREATE ON SCHEMA public TO "${APP_DB_USER}";
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${APP_DB_USER}";
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "${APP_DB_USER}";
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO "${APP_DB_USER}";
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO "${APP_DB_USER}";
EOSQL
