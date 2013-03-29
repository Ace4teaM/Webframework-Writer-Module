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
 * @page writer_document_publish Writer Document Publish
 * 
 * # Publie un document
 * 
 * | Informations |                          |
 * |--------------|--------------------------|
 * | PageId       | publish
 * | Rôle         | Administrateur
 * | UC           | writer_document_publish
 * 
 * ## Arguments optionels:
 *  @param writer_document_id   Document à publier
 * 
 */

// Champs requis
if(!$app->makeFiledList(
        $fields,
        array( 'writer_document_id', 'parent_page_id' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

// Champs requis
if(!$app->makeFiledList(
        $op_fields,
        array( 'page_id', 'set_default_file_page_entry' ),
        cXMLDefault::FieldFormatClassName )
   ) $app->processLastError();

//champs optionels
$p=array();
if(!cInputFields::checkArray($fields,$op_fields,$_REQUEST,$p))
    goto failed;
  
if(!$app->getDefaultFile($def))
    goto failed;

if(!$def->getTreeNode($p->parent_page_id))
    goto failed;

if(!$p->page_id)
    $p->page_id =  "uid_".uniqid();

$link = "show.php?writer_document_id=$p->writer_document_id";

//ajoute une entree au fichier default.xml ?
if($p->set_default_file_page_entry){
    if(!$def->setIndex("page",$p->page_id,$link))
        goto failed;

    if(!$def->addTreeNode($p->parent_page_id,$p->page_id))
        goto failed;

    if(!$def->save())
        goto failed;
}

//definit le document comme publié
if(!WriterModule::publishDocument($p->writer_document_id,$p->page_id,$p->parent_page_id))
    goto failed;

// Résultat de la requete
RESULT(cResult::Ok,cApplication::Success,array("link"=>$link,"page_id"=>$p->page_id));
$result = cResult::getLast();

//
goto success;
failed:
// redefinit le resultat avec l'erreur en cours
$result = cResult::getLast();

success:
;;

?>