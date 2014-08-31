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
  select nextval(pg_get_serial_sequence('writer_document', 'writer_document_id')) into v_id;

  /* insert l'entree */
  insert into writer_document (writer_document_id,doc_title,content_type) values(v_id,p_title,lower(p_content_type));
  select 'ERR_OK', 'WRITER_DOCUMENT_CREATED', 'WRITER_DOCUMENT_ID:'||v_id||';' into v_result;
  return v_result;

END;
$$
LANGUAGE plpgsql;

/*
  Publie un document
  Retourne:
     [RESULT] Un des résultats suivant:
        'ERR_OK, WRITER_DOCUMENT_CREATED (WRITER_DOCUMENT_ID)'   -> Document créé

*/

CREATE OR REPLACE FUNCTION writer_document_publish(
       p_doc_id writer_document.writer_document_id%type,
       p_page_id varchar,
       p_parent_page_id writer_published.parent_page_id%type,
       p_set_in_default writer_published.set_in_default%type,
       p_set_in_cache writer_published.set_in_cache%type
)
RETURNS RESULT AS
$$
DECLARE
	v_result RESULT;
	v_id INT;
BEGIN
  /* actualise l'entree existante  */
  select writer_published_id from writer_published into v_id where writer_document_id=p_doc_id;
  if v_id is not null then
    update writer_published set parent_page_id = p_parent_page_id,  page_id = p_page_id,  set_in_default = p_set_in_default,  set_in_cache = p_set_in_cache where writer_published_id=v_id;
    select 'ERR_OK', 'WRITER_DOCUMENT_PUBLISHED', 'WRITER_PUBLISHED_ID:'||v_id||';' into v_result;
    return v_result;
  end if;

  /* insert une nouvelle entree */
  select nextval(pg_get_serial_sequence('writer_published', 'writer_published_id')) into v_id;

  insert into writer_published (writer_published_id,writer_document_id,parent_page_id,page_id,set_in_default,set_in_cache) values(v_id,p_doc_id,p_parent_page_id,p_page_id,p_set_in_default,p_set_in_cache);
  select 'ERR_OK', 'WRITER_DOCUMENT_PUBLISHED', 'WRITER_PUBLISHED_ID:'||v_id||';' into v_result;
  return v_result;
EXCEPTION
   WHEN unique_violation THEN --page_id
	select 'ERR_FAILED', 'WRITER_PUBLISHED_PAGE_ID_EXISTS' into v_result;
	RETURN v_result;
END;
$$
LANGUAGE plpgsql;
