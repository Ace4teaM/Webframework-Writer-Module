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
 * Gestionnaire de courriers électroniques
 * Librairie PHP5
 */


require_once("php/class/bases/iModule.php");
require_once("php/class/bases/socket.php");
require_once("php/xml_default.php");

    
class WriterModule implements iModule
{
    const documentNotExists = "WRITER_DOCUMENT_NOT_EXISTS";
    
    public static function makeView($name,$attributes,$template_file){ 
    }
    
    /** 
     * Cree un nouveau document
     * 
     * @param type $title
     * @param type $content_type
     */
    public static function createDocument($title,$content_type){ 
        global $app;
        $db=null;
        
        if(!$app->getDB($db))
            return RESULT(cResult::Failed, Application::DatabaseConnectionNotFound);

        if(!$db->call($app->getCfgValue("database","schema"), "writer_create_document", func_get_args(), $result))
            return false;
        
        $row = $result->fetchRow();

        //return $result;
        return RESULT($row["err_code"], $row["err_str"], stra_to_array($row["ext_fields"]));
    }
    
    /** 
     * Publie un document
     * 
     * @param type $name
     * @param type $attributes
     * @param type $template_file
     */
    public static function publishDocument($doc_id,$page_id,$parent_page_id){ 
        global $app;
        $db=null;
        
        if(!$app->getDB($db))
            return RESULT(cResult::Failed, Application::DatabaseConnectionNotFound);

        if(!$db->call($app->getCfgValue("database","schema"), "writer_document_publish", func_get_args(), $result))
            return false;
        
        $row = $result->fetchRow();

        //return $result;
        return RESULT($row["err_code"], $row["err_str"], stra_to_array($row["ext_fields"]));
    }
    
    /** 
     * Fabrique un document HTML
     * 
     * @param WriterDocument $doc Document a convertir
     * @return XMLDocument Instance du document XML
     * @retval false Une erreur est survenue (voir cResult::getLast())
     */
    public static function docToXML(WriterDocument $doc){ 
        global $app;
        $db=null;
        
        $doc = new XMLDocument("1.0", "utf-8");
        
        //HTML -> XML
        if($doc->contentType == "text/html")
        {
            $content = $doc->docContent;
            
            //ajuste les chemins d'accès
            //$content = str_replace('src="', "src=\"$doc->path/", $content);//fix images path

            //parse le contenu
            if($doc->loadHTML($content) === FALSE)
                return RESULT(cResult::Failed,XMLDocument::loadHTML);
        }
        else{
            return RESULT(cResult::Failed, cApplication::UnsuportedFeature);
        }

        RESULT_OK();
        return $doc;
    }
    
}

?>
