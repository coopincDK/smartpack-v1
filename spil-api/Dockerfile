# Fase 1-leverance — udrulning sker først i fase 2, men imaget bygges her,
# så det er klart til den dag docker-compose.yml tages i brug.
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY src ./src
COPY migrations ./migrations

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
