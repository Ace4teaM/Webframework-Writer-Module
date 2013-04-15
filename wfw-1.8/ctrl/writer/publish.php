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

class Ctrl extends cApplicationCtrl{
    public $fields    = array( 'writer_document_id', 'parent_page_id' );
    public $op_fields = array( 'page_id', 'set_in_default', 'set_in_cache' );

    function main(iApplication $app, $app_path, $p) {

        if(!$app->getDefaultFile($def))
            return false;

        if(!$def->getTreeNode($p->parent_page_id))
            return false;

        if(!$p->page_id)
            $p->page_id =  "uid_".uniqid();

        $link = $app->makeCtrlURI("writer_module","view","writer_document_id=$p->writer_document_id&templatize=true");

        //ajoute une entrée au fichier default.xml ?
        if($p->set_in_default){
            if(!$def->setIndex("page",$p->page_id,$link))
                return false;

            if(!$def->addTreeNode($p->parent_page_id,$p->page_id))
                return false;

            if(!$def->save())
                return false;
        }

        //entregistre le document en cache
        if($p->set_in_cache){
            if (!WriterDocumentMgr::getById($doc, $p->writer_document_id))
                return RESULT(cResult::Failed,"WRITER_DOCUMENT_NOT_FOUND");
            $filename = $app->getCfgValue("writer_module", "output_doc_path") . "/$p->page_id.html";
            $header = '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /></head>';
            if(!file_put_contents($filename, "<!DOCTYPE html>\n<html>\n$header\n<body>\n".$doc->docContent."\n</body>\n</html>"))
                return RESULT(cResult::Failed,"WRITER_CANT_WRITE_CACHE_FILE",array("message"=>TRUE,"FILE"=>$filename));
        }
        
        //definit le document comme publié
        if(!WriterModule::publishDocument($p->writer_document_id,$p->page_id,$p->parent_page_id,$p->set_in_default,$p->set_in_cache))
            return false;

        // Résultat de la requete
        return RESULT(cResult::Ok,cApplication::Success,array("link"=>$link,"page_id"=>$p->page_id));
    }
};
?>