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
    public $fields    = array( 'doc_content','writer_document_id' );
    public $op_fields = null;

    function main(iApplication $app, $app_path, $p) {

        // obtient le document
        if(!WriterDocumentMgr::getById( $doc, $p->writer_document_id ))
            return RESULT(cResult::Failed,WriterModule::documentNotExists);

        //verifie le format du contenu
    /*    if($doc->contentType == "text/xml"){
            //parse xml and check...
        }*/

        //actualise
        $doc->docContent = $p->doc_content;
        if(!WriterDocumentMgr::update( $doc ))
            return false;

        return RESULT_OK();
    }
};

?>