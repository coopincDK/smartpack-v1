-- 037_sandhed_tekst.sql
-- Sandheds gave i puljen: gør det synligt, at Sandhed giver 10 adgange i alt (ni som timepræmier).
UPDATE partner
   SET praemie_beskrivelse = 'Vinderen får 6 måneders gratis adgang til Sandhed, den digitale tvilling-platform med live 3D-overblik over lager og drift. Sandhed giver i alt 10 adgange til Packrush: én her i puljen og resten til timens boss hver time på konferencen.',
       opdateret = now()
 WHERE slug = 'sandhed';
