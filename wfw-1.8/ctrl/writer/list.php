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
  Liste les documents existants
  
  Role   : Tous
  UC     : List
  Module : writer
 
  Champs complémentaires:
    content_type : Filtre par type Mime
	
  Remarque:
    Retourne les objets WriterDocument et le résultat de la procédure dans un document XML.
	Le contenu du document n'est pas retourné (l'élément *doc_content* est toujours vide).

  Exemple:
    <data>
        <writerdocument>
            <writer_document_id>542</writer_document_id>
            <doc_title>Document Title</doc_title>
            <content_type>text/plain</content_type>
            <doc_content/>
        </writerdocument>

        <writerdocument>
            <writer_document_id>45</writer_document_id>
            <doc_title>Document Title</doc_title>
            <content_type>text/plain</content_type>
            <doc_content/>
        </writerdocument>

        <result>ERR_OK</result>
        <error>SUCCESS</error>
    </data>

 */
class writer_module_list_ctrl extends cApplicationCtrl{
    public $fields    = null;
    public $op_fields = array('content_type');
    
    private $list = null;

    function main(iApplication $app, $app_path, $p) {

        // Initialise le document de sortie
        $doc = new XMLDocument("1.0", "utf-8");
        $rootEl = $doc->createElement('data');
        $doc->appendChild($rootEl);

        $cond = "1=1";

        //filtre par type ?
        if($p->content_type !== NULL)
            $cond .= " and (content_type=lower('$p->content_type'))";

        // Traite la requête
        if(!$app->getDB($db))
            return false;

        //execute la requete
         $query = "SELECT writer_document_id, doc_title, content_type from writer_document where $cond";
         if(!$db->execute($query,$query_result))
            return false;

        //extrait les instances
         $list = array();
         $i=0;
         while( $query_result->seek($i,iDatabaseQuery::Origin) ){
          $inst = new WriterDocument();
          WriterDocumentMgr::bindResult($inst,$query_result);
          array_push($list,$inst);
          $i++;
         }
         
        $this->list = $list;
        
        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        if(!$result->isOK())
            return parent::output($app, $format, $att, $result);
        
        switch($format){
            case "text/xml":
                $doc = new XMLDocument("1.0", "utf-8");
                $dataEl = $doc->appendChild( $doc->createElement('data') );
                //charge le contenu en selection
                foreach($this->list as $key=>$inst)
                    $dataEl->appendChild(WriterDocumentMgr::toXML($inst, $doc));
                return '<?xml version="1.0" encoding="UTF-8" ?>'.$doc->saveXML( $doc->documentElement );
            case "text/xarg":
                $ret="";
                foreach($this->list as $key=>$inst)
                    $ret .= xarg_encode_array($inst);
                return $ret;
        }
        return parent::output($app, $format, $att, $result);
    }
};

?>