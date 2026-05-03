# Server infrastructure

Disse filer afspejler hvad der kører på produktionsserveren
(`168.119.186.156`, alias `smartpack-website`).

## Filer

- **`nginx.conf`** — kører i `nginx:alpine` containeren på `127.0.0.1:8000`.
  Auto-deployes ved push til `main` (workflow `.github/workflows/deploy.yml`)
  og nginx reloades efter scp.
- **`docker-compose.yml`** — definerer containeren. **Ikke auto-deployed**
  (manglende dependencies eller utilsigtet downtime ved ændring).
  Skal opdateres manuelt:
  ```bash
  scp infra/docker-compose.yml smartpack-website:/var/www/smartpack.dk/docker-compose.yml
  ssh smartpack-website "cd /var/www/smartpack.dk && docker-compose up -d"
  ```

## Aktiv server-layout

```
/var/www/smartpack.dk/
├── docker-compose.yml      # ↔ infra/docker-compose.yml
├── nginx.conf              # ↔ infra/nginx.conf (auto-deployed)
└── public/                 # ← rsync target fra repo-root
```

## Test af nginx-config lokalt

```bash
docker run --rm -v "$(pwd)/infra/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t
```
