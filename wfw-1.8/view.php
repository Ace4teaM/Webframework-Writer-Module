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

/*
 * Affiche le contenu d'un document
 * Rôle : Visiteur
 * UC   : user_activate_account
 */

require_once("inc/globals.php");
global $app;

// Champs requis
if(!$app->makeFiledList(
        $fields,
        array( 'writer_document_id' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

// Traite la requête
if(!empty($_REQUEST))
{
    // vérifie la validitée des champs
    $p = array();
    if(!cInputFields::checkArray($fields,NULL,$_REQUEST,$p))
        goto failed;
    
    // obtient le document
    if(!WriterDocumentMgr::getById( $doc, $p->writer_document_id )){
        RESULT(cResult::Failed,WriterModule::documentNotExists);
        goto failed;
    }

    //affiche le document
    header("content-type:$doc->contentType");
    echo($doc->docContent);
    exit;
}

//affiche la liste des documents
if(!WriterDocumentMgr::getAll( $list,"1=1" ))
    goto failed;
header("content-type:text/html; charset=utf8");
foreach($list as $key=>$doc){
    echo("<div><pre>[$doc->contentType]</pre> <a href=\"?writer_document_id=$doc->writerDocumentId\">$doc->docTitle</a></div>");
}

goto success;
failed:
$app->processLastError();

success:
;;
    
?>