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
 *  Webframework Module
 *  PHP Data-Model Implementation
*/


/**
* @author       AceTeaM
*/
class WriterDocument
{
   public function getId(){
      return $this->writerDocumentId;
  }
   public function setId($id){
      return $this->writerDocumentId = $id;
  }

    
    /**
    * @var      int
    */
    public $writerDocumentId;
    
    /**
    * @var      String
    */
    public $docTitle;
    
    /**
    * @var      String
    */
    public $contentType;
    
    /**
    * @var      String
    */
    public $docContent;    

}

/*
   writer_document Class manager
   
   This class is optimized for use with the Webfrmework project (www.webframework.fr)
*/
class WriterDocumentMgr
{
    /**
     * @brief Convert existing instance to an associative array
     * @param $inst Entity instance (WriterDocument)
     * @return New associative array
     */
    public static function toArray(&$inst) {
        $ar = array();
        
        $ar["writer_document_id"] = $inst->writerDocumentId;
        $ar["doc_title"] = $inst->docTitle;
        $ar["content_type"] = $inst->contentType;
        $ar["doc_content"] = $inst->docContent;       

          
        return $ar;
    }
    
    /**
     * @brief Convert existing instance to XML element
     * @param $inst Entity instance (WriterDocument)
     * @param $doc Parent document
     * @return New element node
     */
    public static function toXML(&$inst,$doc) {
        $node = $doc->createElement(strtolower("WriterDocument"));
        
        $node->appendChild($doc->createTextElement("writer_document_id",$inst->writerDocumentId));
        $node->appendChild($doc->createTextElement("doc_title",$inst->docTitle));
        $node->appendChild($doc->createTextElement("content_type",$inst->contentType));
        $node->appendChild($doc->createTextElement("doc_content",$inst->docContent));       

          
        return $node;
    }
    
    
    /*
      @brief Get entry list
      @param $list Array to receive new instances
      @param $cond SQL Select condition
      @param $db iDataBase derived instance
    */
    public static function getAll(&$list,$cond,$db=null){
       $list = array();
      
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
      //execute la requete
       $query = "SELECT * from writer_document where $cond";
       if(!$db->execute($query,$result))
          return false;
       
      //extrait les instances
       $i=0;
       while( $result->seek($i,iDatabaseQuery::Origin) ){
        $inst = new WriterDocument();
        WriterDocumentMgr::bindResult($inst,$result);
        array_push($list,$inst);
        $i++;
       }
       
       return RESULT_OK();
    }
    
    /*
      @brief Get single entry
      @param $inst WriterDocument instance pointer to initialize
      @param $cond SQL Select condition
      @param $db iDataBase derived instance
    */
    public static function bindResult(&$inst,$result){
          $inst->writerDocumentId = $result->fetchValue("writer_document_id");
          $inst->docTitle = $result->fetchValue("doc_title");
          $inst->contentType = $result->fetchValue("content_type");
          $inst->docContent = $result->fetchValue("doc_content");          

       return true;
    }
    
    /*
      @brief Get single entry
      @param $inst WriterDocument instance pointer to initialize
      @param $cond SQL Select condition
      @param $db iDataBase derived instance
    */
    public static function get(&$inst,$cond,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
      //execute la requete
       $query = "SELECT * from writer_document where $cond";
       if($db->execute($query,$result)){
            $inst = new WriterDocument();
             if(!$result->rowCount())
                 return RESULT(cResult::Failed,iDatabaseQuery::EmptyResult);
          return WriterDocumentMgr::bindResult($inst,$result);
       }
       return false;
    }
    
    /*
      @brief Get single entry by id
      @param $inst WriterDocument instance pointer to initialize
      @param $id Primary unique identifier of entry to retreive
      @param $db iDataBase derived instance
    */
    public static function getById(&$inst,$id,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
      //execute la requete
       $query = "SELECT * from writer_document where writer_document_id=".$db->parseValue($id);
       if($db->execute($query,$result)){
            $inst = new WriterDocument();
             if(!$result->rowCount())
                 return RESULT(cResult::Failed,iDatabaseQuery::EmptyResult);
             self::bindResult($inst,$result);
          return true;
       }
       return false;
    }
    
   /*
      @brief Insert single entry by id
      @param $inst WriterDocument instance pointer to initialize
      @param $add_fields Array of columns names/columns values of additional fields
      @param $db iDataBase derived instance
    */
    public static function insert(&$inst,$add_fields=null,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
       //id initialise ?
       if(!isset($inst->writerDocumentId))
           return RESULT(cResult::Failed, cApplication::EntityMissingId);
      
      //execute la requete
       $query = "INSERT INTO writer_document (";
       $query .= " writer_document_id,";
       $query .= " doc_title,";
       $query .= " content_type,";
       $query .= " doc_content,";
       if(is_array($add_fields))
           $query .= implode(',',array_keys($add_fields)).',';
       $query = substr($query,0,-1);//remove last ','
       $query .= ")";
       
       $query .= " VALUES(";
       $query .= $db->parseValue($inst->writerDocumentId).",";
       $query .= $db->parseValue($inst->docTitle).",";
       $query .= $db->parseValue($inst->contentType).",";
       $query .= $db->parseValue($inst->docContent).",";
       if(is_array($add_fields))
           $query .= implode(',',$add_fields).',';
       $query = substr($query,0,-1);//remove last ','
       $query .= ")";
       
       if($db->execute($query,$result))
          return true;

       return false;
    }
    
   /*
      @brief Update single entry by id
      @param $inst WriterDocument instance pointer to initialize
      @param $db iDataBase derived instance
    */
    public static function update(&$inst,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
       //id initialise ?
       if(!isset($inst->writerDocumentId))
           return RESULT(cResult::Failed, cApplication::EntityMissingId);
      
      //execute la requete
       $query = "UPDATE writer_document SET";
       $query .= " writer_document_id =".$db->parseValue($inst->writerDocumentId).",";
       $query .= " doc_title =".$db->parseValue($inst->docTitle).",";
       $query .= " content_type =".$db->parseValue($inst->contentType).",";
       $query .= " doc_content =".$db->parseValue($inst->docContent).",";
       $query = substr($query,0,-1);//remove last ','
       $query .= " where writer_document_id=".$db->parseValue($inst->writerDocumentId);
       if($db->execute($query,$result))
          return true;

       return false;
    }
    
   /** @brief Convert name to code */
    public static function nameToCode($name){
        for($i=strlen($name)-1;$i>=0;$i--){
            $c = substr($name, $i, 1);
            if(strpos("ABCDEFGHIJKLMNOPQRSTUVWXYZ",$c) !== FALSE){
                $name = substr_replace($name,($i?"_":"").strtolower($c), $i, 1);
            }
        }
        return $name;
    }
    
    /**
      @brief Get entry by id's relation table
      @param $inst WriterDocument instance pointer to initialize
      @param $obj An another entry class object instance
      @param $db iDataBase derived instance
    */
    public static function getByRelation(&$inst,$obj,$db=null){
        $objectName = get_class($obj);
        $objectTableName  = WriterDocumentMgr::nameToCode($objectName);
        $objectIdName = lcfirst($objectName)."Id";
        
        /*print_r($objectName.", ");
        print_r($objectTableName.", ");
        print_r($objectIdName.", ");
        print_r($obj->$objectIdName);*/
        
        $select;
        if(is_string($obj->$objectIdName))
            $select = ("writer_document_id = (select writer_document_id from $objectTableName where ".$objectTableName."_id='".$obj->$objectIdName."')");
        else
            $select = ("writer_document_id = (select writer_document_id  from $objectTableName where ".$objectTableName."_id=".$obj->$objectIdName.")");

        return WriterDocumentMgr::get($inst,$select,$db);
    }

}

?>