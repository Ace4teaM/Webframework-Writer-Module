/*
  (C)2014 Thomas AUGUEY
  PL/pgSQL
  Module IO
  
  Index, Sequences et autres objets
*/

/*
    Sequences
    Liste des sequences d'auto incrementation pour les identifiants 
*/
DROP SEQUENCE IF EXISTS writer_document_seq;
CREATE SEQUENCE writer_document_seq START 1;

DROP SEQUENCE IF EXISTS writer_published_seq;
CREATE SEQUENCE writer_published_seq START 1;