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

class Ctrl extends cApplicationCtrl{
    public $fields    = array( 'writer_document_id' );
    public $op_fields = null;

    function main(iApplication $app, $app_path, $p) {

        // obtient le document
        if(!WriterDocumentMgr::getById( $doc, $p->writer_document_id ))
            return RESULT(cResult::Failed,WriterModule::documentNotExists);

        // obtient la publication
        if(!WriterPublishedMgr::getByRelation( $publish, $doc ))
            return RESULT(cResult::Failed,WriterModule::documentNotPublished);
        
        $content = $doc->docContent;
        if($publish->setInCache){
            $filename = $app->getCfgValue("writer_module", "output_doc_path") . "/$publish->pageId.html";
            $content = file_get_contents($filename);
            if(!$content)
                return RESULT(cResult::Failed,WriterModule::documentCacheNotFound);
        }

        //affiche le document
        header("content-type:$doc->contentType");
        echo($content);
        exit;
    }
};
?>