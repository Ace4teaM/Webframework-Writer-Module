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
 * Modifie le contenu d'un document
 * Rôle : Visiteur
 * UC   : user_activate_account
 */

// Résultat de la requete
RESULT(cResult::Ok,cApplication::Information,array("message"=>"WFW_MSG_POPULATE_FORM"));
$result = cResult::getLast();

// Champs requis
if(!$app->makeFiledList(
        $fields,
        array( 'doc_content','writer_document_id' ),
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

    //verifie le format du contenu
/*    if($doc->contentType == "text/xml"){
        //parse xml and check...
    }*/
    
    //actualise
    $doc->docContent = $p->doc_content;
    if(!WriterDocumentMgr::update( $doc ))
        goto failed;
    
    
    // retourne le resultat de cette fonction
    $result = cResult::getLast();
}

goto success;
failed:
// redefinit le resultat avec l'erreur en cours
$result = cResult::getLast();

success:
;;

?>