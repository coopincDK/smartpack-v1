# Partnerportal til Packrush: hvad der skal til for at gå live

Alt ligger i repoet og er testet lokalt (120/120 tests, plus en browsertest af admin, partnerlogin og præmieside).
Der skal ikke åbnes noget i CRM'et eller andre databaser. Partnerne ligger i spil-api'ets egen Postgres.

1. **spil-api skal køre på serveren.** `infra/nginx.conf` har ingen `/api/spil`-proxy endnu, så hverken spillets
   backend eller partnersiderne kan nå API'et i dag. Migrationen `008_partnere.sql` køres automatisk ved opstart.
2. **Ingen nye miljøvariabler.** Partner-admin bruger samme `ADMIN_PASSWORD_HASH` som spillets admin.
3. **Ingen mail i denne omgang.** Martin opretter partnerbrugere med en startkode, som partneren selv skifter ved
   første login. Glemt kode = Martin giver en ny startkode i admin.
4. **Senere:** mail til invitationer/nulstilling, og at partnernes nyhedslister (`config.mailPartners`) kobles på
   partner-tabellen i stedet for navne.

Sider: `/spil/partner/admin.html`, `/spil/partner/`, `/spil/praemier/`. I spillet hedder linket nederst nu "Login" og fører til partnerportalen og arrangør-login. Se `spil-api/API.md`, afsnit "Partnere".
