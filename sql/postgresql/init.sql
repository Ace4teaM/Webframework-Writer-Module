/*
  (C)2013 Thomass AUGUEY
  PL/pgSQL
  Module Writer (WFW_WRITER)
  
  Initialise les objets et le contenu de base avant utilisation
*/

/*
--------------------------------------------------------------------------
     Contraintes
--------------------------------------------------------------------------
*/

-- identifiant de page unique pour les documents publiés
ALTER TABLE writer_published ADD UNIQUE (page_id);
