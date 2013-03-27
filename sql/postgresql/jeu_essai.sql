

/*---------------------------------------------------------------------------
 WRITER_DOCUMENT
----------------------------------------------------------------------------*/

/* Documents */
INSERT INTO WRITER_DOCUMENT VALUES(1, 'Texte simple', 'text/plain', 'Ceci est un texte brut. Aucun formatage ne peut être réalisé');
INSERT INTO WRITER_DOCUMENT VALUES(2, 'Document HTML', 'text/html', '<!DOCTYPE html><html><body><h1>Titre</h1><p>Plusieurs formatages comme: <i>l''italic</i>, <strong>le gras</strong> peuvent être réalisés</p></body></html>');
INSERT INTO WRITER_DOCUMENT VALUES(3, 'Document XML servant de base de données statique', 'text/xml', '<?xml version="1.0" encoding="UTF-8"?><data><books><entry>La bible du C++</entry></books></data>');
