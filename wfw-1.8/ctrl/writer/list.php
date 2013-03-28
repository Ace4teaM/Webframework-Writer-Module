<?php
/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2012-2013 Thomas AUGUEY <contact@aceteam.org>
    ---------------------------------------------------------------------------------------------------------------------------------------
    This file is part of WebFrameWork.

    WebFrameWork is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    WebFrameWork is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with WebFrameWork.  If not, see <http://www.gnu.org/licenses/>.
    ---------------------------------------------------------------------------------------------------------------------------------------
*/

/**
 * @page writer_document_list Writer Document List
 * 
 * # Liste les documents existants
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | list
 * | Rôle         | Administrateur
 * | UC           | writer_document_list
 * 
 * ## Arguments optionels:
 *  @param content_type   Type de contenu accepté
 *  @param published_only Inclue uniquement les documents publiées
 * 
 * ## Sortie:
 * Retourne les objets WriterDocument et le résultat de la procédure dans un document XML.
 * @code{.xml}
    <data>
        <writerdocument>
            <writer_document_id>542</writer_document_id>
            <doc_title>Document Title</doc_title>
            <content_type>text/plain</content_type>
            <doc_content>
                Document content
            </doc_content>
        </writerdocument>

        <writerdocument>
            <writer_document_id>45</writer_document_id>
            <doc_title>Document Title</doc_title>
            <content_type>text/plain</content_type>
            <doc_content>
                Document content
            </doc_content>
        </writerdocument>

        <result>ERR_OK</result>
        <error>SUCCESS</error>
    </data>
 * @endcode
 * 
 */

// Résultat de la requete
RESULT(cResult::Ok,cApplication::Information,array("message"=>"WFW_MSG_POPULATE_FORM"));
$result = cResult::getLast();

// Champs requis
if(!$app->makeFiledList(
        $op_fields,
        array( 'content_type' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

$cond = "1=1";

//champs optionels
$p=array();
if(!cInputFields::checkArray(NULL,$op_fields,$_REQUEST,$p))
        goto failed;

//filtre par type ?
if($p->content_type !== NULL)
    $cond .= " and (content_type=lower('$p->content_type'))";

// Traite la requête
if(!WriterDocumentMgr::getAll($list,$cond))
        goto failed;

//charge le contenu en selection
$doc = new XMLDocument("1.0", "utf-8");
$rootEl = $doc->createElement('data');
$doc->appendChild($rootEl);
foreach($list as $key=>$inst)
    $rootEl->appendChild(WriterDocumentMgr::toXML($inst, $doc));

//
failed:
// redefinit le resultat avec l'erreur en cours
$result = cResult::getLast();

success:
$doc->appendAssocArray($rootEl,$result->toArray());
header("content-type: text/xml");
echo '<?xml version="1.0" encoding="UTF-8" ?>'.$doc->saveXML( $doc->documentElement );
exit;

?>