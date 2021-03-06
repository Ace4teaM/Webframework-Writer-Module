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
class WriterPublished
{
   public function getId(){
      return $this->writerPublishedId;
  }
   public function setId($id){
      return $this->writerPublishedId = $id;
  }

    
    /**
    * @var      int
    */
    public $writerPublishedId;
    
    /**
    * @var      String
    */
    public $parentPageId;
    
    /**
    * @var      String
    */
    public $pageId;
    
    /**
    * @var      boolean
    */
    public $setInDefault;
    
    /**
    * @var      boolean
    */
    public $setInCache;    

}

/*
   writer_published Class manager
   
   This class is optimized for use with the Webfrmework project (www.webframework.fr)
*/
class WriterPublishedMgr
{
    /**
     * @brief Convert existing instance to an associative array
     * @param $inst Entity instance (WriterPublished)
     * @return New associative array
     */
    public static function toArray(&$inst) {
        $ar = array();
        
        $ar["writer_published_id"] = $inst->writerPublishedId;
        $ar["parent_page_id"] = $inst->parentPageId;
        $ar["page_id"] = $inst->pageId;
        $ar["set_in_default"] = $inst->setInDefault;
        $ar["set_in_cache"] = $inst->setInCache;       

          
        return $ar;
    }
    
    /**
     * @brief Convert existing instance to XML element
     * @param $inst Entity instance (WriterPublished)
     * @param $doc Parent document
     * @return New element node
     */
    public static function toXML(&$inst,$doc) {
        $node = $doc->createElement(strtolower("WriterPublished"));
        
        $node->appendChild($doc->createTextElement("writer_published_id",$inst->writerPublishedId));
        $node->appendChild($doc->createTextElement("parent_page_id",$inst->parentPageId));
        $node->appendChild($doc->createTextElement("page_id",$inst->pageId));
        $node->appendChild($doc->createTextElement("set_in_default",$inst->setInDefault));
        $node->appendChild($doc->createTextElement("set_in_cache",$inst->setInCache));       

          
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
       $query = "SELECT * from writer_published where $cond";
       if(!$db->execute($query,$result))
          return false;
       
      //extrait les instances
       $i=0;
       while( $result->seek($i,iDatabaseQuery::Origin) ){
        $inst = new WriterPublished();
        WriterPublishedMgr::bindResult($inst,$result);
        array_push($list,$inst);
        $i++;
       }
       
       return RESULT_OK();
    }
    
    /*
      @brief Get single entry
      @param $inst WriterPublished instance pointer to initialize
      @param $cond SQL Select condition
      @param $db iDataBase derived instance
    */
    public static function bindResult(&$inst,$result){
          $inst->writerPublishedId = $result->fetchValue("writer_published_id");
          $inst->parentPageId = $result->fetchValue("parent_page_id");
          $inst->pageId = $result->fetchValue("page_id");
          $inst->setInDefault = $result->fetchValue("set_in_default");
          $inst->setInCache = $result->fetchValue("set_in_cache");          

       return true;
    }
    
    /*
      @brief Get single entry
      @param $inst WriterPublished instance pointer to initialize
      @param $cond SQL Select condition
      @param $db iDataBase derived instance
    */
    public static function get(&$inst,$cond,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
      //execute la requete
       $query = "SELECT * from writer_published where $cond";
       if($db->execute($query,$result)){
            $inst = new WriterPublished();
             if(!$result->rowCount())
                 return RESULT(cResult::Failed,iDatabaseQuery::EmptyResult);
          return WriterPublishedMgr::bindResult($inst,$result);
       }
       return false;
    }
    
    /*
      @brief Get single entry by id
      @param $inst WriterPublished instance pointer to initialize
      @param $id Primary unique identifier of entry to retreive
      @param $db iDataBase derived instance
    */
    public static function getById(&$inst,$id,$db=null){
       //obtient la base de donnees courrante
       global $app;
       if(!$db && !$app->getDB($db))
         return false;
      
      //execute la requete
       $query = "SELECT * from writer_published where writer_published_id=".$db->parseValue($id);
       if($db->execute($query,$result)){
            $inst = new WriterPublished();
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
       if(!isset($inst->writerPublishedId))
           return RESULT(cResult::Failed, cApplication::EntityMissingId);
      
      //execute la requete
       $query = "INSERT INTO writer_published (";
       $query .= " writer_published_id,";
       $query .= " parent_page_id,";
       $query .= " page_id,";
       $query .= " set_in_default,";
       $query .= " set_in_cache,";
       if(is_array($add_fields))
           $query .= implode(',',array_keys($add_fields)).',';
       $query = substr($query,0,-1);//remove last ','
       $query .= ")";
       
       $query .= " VALUES(";
       $query .= $db->parseValue($inst->writerPublishedId).",";
       $query .= $db->parseValue($inst->parentPageId).",";
       $query .= $db->parseValue($inst->pageId).",";
       $query .= $db->parseValue($inst->setInDefault).",";
       $query .= $db->parseValue($inst->setInCache).",";
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
       if(!isset($inst->writerPublishedId))
           return RESULT(cResult::Failed, cApplication::EntityMissingId);
      
      //execute la requete
       $query = "UPDATE writer_published SET";
       $query .= " writer_published_id =".$db->parseValue($inst->writerPublishedId).",";
       $query .= " parent_page_id =".$db->parseValue($inst->parentPageId).",";
       $query .= " page_id =".$db->parseValue($inst->pageId).",";
       $query .= " set_in_default =".$db->parseValue($inst->setInDefault).",";
       $query .= " set_in_cache =".$db->parseValue($inst->setInCache).",";
       $query = substr($query,0,-1);//remove last ','
       $query .= " where writer_published_id=".$db->parseValue($inst->writerPublishedId);
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
      @param $inst WriterPublished instance pointer to initialize
      @param $obj An another entry class object instance
      @param $db iDataBase derived instance
    */
    public static function getByRelation(&$inst,$obj,$db=null){
        $objectName = get_class($obj);
        $objectTableName  = WriterPublishedMgr::nameToCode($objectName);
        $objectIdName = lcfirst($objectName)."Id";
        
        /*print_r($objectName.", ");
        print_r($objectTableName.", ");
        print_r($objectIdName.", ");
        print_r($obj->$objectIdName);*/
        
        $select;
        if(is_string($obj->$objectIdName))
            $select = ("writer_published_id = (select writer_published_id from $objectTableName where ".$objectTableName."_id='".$obj->$objectIdName."')");
        else
            $select = ("writer_published_id = (select writer_published_id  from $objectTableName where ".$objectTableName."_id=".$obj->$objectIdName.")");

        return WriterPublishedMgr::get($inst,$select,$db);
    }

}

?>