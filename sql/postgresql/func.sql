/*
  (C)2013 AUGUEY Thomas
  PL/pgSQL
  Module Writer (WFW_MAILING)
  
  PostgreSQL v8.3 (version minimum requise)
*/

/*
  Crée un document
  Retourne:
     [RESULT] Un des résultats suivant:
        'ERR_OK, WRITER_DOCUMENT_CREATED (WRITER_DOCUMENT_ID)'   -> Document créé

*/

CREATE OR REPLACE FUNCTION writer_create_document(
       p_title writer_document.doc_title%type,
       p_content_type writer_document.content_type%type
)
RETURNS RESULT AS
$$
DECLARE
	v_result RESULT;
	v_id INT;
BEGIN
  /* verifie si le mail ou l'id est déjà utilisé par un autre compte */
  select coalesce(max(writer_document_id),0)+1 from writer_document into v_id;

  /* insert l'entree */
  insert into writer_document (writer_document_id,doc_title,content_type) values(v_id,p_title,lower(p_content_type));
  select 'ERR_OK', 'WRITER_DOCUMENT_CREATED', 'WRITER_DOCUMENT_ID:'||v_id||';' into v_result;
  return v_result;

END;
$$
LANGUAGE plpgsql;
