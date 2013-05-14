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
 * Obtient les informations de publication d'un document
 * Rôle : Administrateur
 * UC   : get_publish
 */

class writer_module_get_publish_ctrl extends cApplicationCtrl{
    public $fields    = array( 'writer_document_id' );
    public $op_fields = null;
    
    private $publish = null;

    function main(iApplication $app, $app_path, $p) {
        
        if(!$app->getDB($db))
            return false;
        
        if(!WriterPublishedMgr::get($this->publish, "writer_document_id=".$db->parseValue($p->writer_document_id)))
                return false;
        
        return RESULT_OK();
    }
    
    function output(iApplication $app, $format, $att, $result)
    {
        if(!$result->isOK())
            return parent::output($app, $format, $att, $result);
        
        switch($format){
            case "xml":
                $doc = new XMLDocument("1.0", "utf-8");
                $dataEl = $doc->appendChild( $doc->createElement('data') );
                $dataEl->appendChild( WriterPublishedMgr::toXML($this->publish, $doc) );
                return '<?xml version="1.0" encoding="UTF-8" ?>'.$doc->saveXML( $doc->documentElement );
            case "xarg":
                return xarg_encode_array( WriterPublishedMgr::toArray($this->publish) ) . xarg_encode_array($result->toArray());
        }
        return parent::output($app, $format, $att, $result);
    }
};
?>