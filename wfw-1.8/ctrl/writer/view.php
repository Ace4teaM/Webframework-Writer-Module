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

class writer_module_view_ctrl extends cApplicationCtrl{
    public $fields    = array( 'writer_document_id' );
    public $op_fields = array( 'templatize' );
    
    private $doc = null;

    function main(iApplication $app, $app_path, $p) {

       //obtient la base de donnees courrante
       if(!$app->getDB($db))
         return false;
      
        // obtient le document
        if(!WriterDocumentMgr::getById( $doc, $p->writer_document_id ))
            return RESULT(cResult::Failed,WriterModule::documentNotExists);

        // obtient la publication
        if(!WriterPublishedMgr::get( $publish, "writer_document_id = ".$db->parseValue($p->writer_document_id) ))
            return RESULT(cResult::Failed,WriterModule::documentNotPublished);
        
        $content = $doc->docContent;
        if($publish->setInCache){
            $filename = $app->getCfgValue("writer_module", "output_doc_path") . "/$publish->pageId.html";
            $content = file_get_contents($filename);
            if(!$content)
                return RESULT(cResult::Failed,WriterModule::documentCacheNotFound);
            if($p->templatize){
                $app->showXMLView($filename,array());
                exit;
            }
        }
        
        $this->doc = $doc;

        //affiche le document
//        header("content-type:$doc->contentType");
//        echo($content);
//        exit;
        
        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        if(!$result->isOK())
            return parent::output($app, $format, $att, $result);

        if($this->doc->contentType != $format)
            return RESULT(cResult::Failed,"UNSUPORTED_OUTPUT_FORMAT");
        
        switch($format){
            case "text/html":
                //convertie le contenu en instance de fichier XML
                $doc = new XMLDocument();
                if(!$doc->loadHTML($this->doc->docContent))
                    return RESULT(cResult::Failed,XMLDocument::loadXML);
                
                // initialise à partir du template principale
                $template = $app->createXMLView($doc,$att);
                if(!$template)
                    return false;
                
                //sortie
                return $template->Make();
        }
        return parent::output($app, $format, $att, $result);
    }
};
?>