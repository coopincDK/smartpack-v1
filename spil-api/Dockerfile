# Fase 1-leverance — udrulning sker først i fase 2, men imaget bygges her,
# så det er klart til den dag docker-compose.yml tages i brug.
FROM node:20-alpine

# postgresql16-client: giver `pg_dump` (matchende db-servicens postgres:16)
# inde i api-containeren, brugt af POST /admin/nulstil's sikkerhedsnet (se
# src/backup.js) — containeren har hverken docker-socketen eller
# docker-CLI'en, kun netværksadgang til db-servicen, så vi kan ikke genbruge
# det natlige backup.sh's `docker compose exec db pg_dump`-tilgang direkte.
RUN apk add --no-cache postgresql16-client

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src
COPY migrations ./migrations

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
