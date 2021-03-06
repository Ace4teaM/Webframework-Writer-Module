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
  Affiche le contenu d'un document
  
  Role   : Tous
  UC     : Read
  Module : writer
 
  Champs:
    writer_document_id : Identifiant du document
 */
class writer_module_read_ctrl extends cApplicationCtrl{
    public $fields    = array( 'writer_document_id' );
    public $op_fields = null;

    function main(iApplication $app, $app_path, $p) {

        // obtient le document
        if(!WriterDocumentMgr::getById( $doc, $p->writer_document_id ))
            return RESULT(cResult::Failed,WriterModule::documentNotExists);

        //affiche le document
        header("content-type:$doc->contentType");
        echo($doc->docContent);
        exit;
    }
};
?>