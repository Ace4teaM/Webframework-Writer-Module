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
  Crée un nouveau document
  
  Role   : Tous
  UC     : Publish
  Module : writer
 
  Champs:
    doc_title    : Titre du document
    content_type : Type Mime du document
 */
class writer_module_create_ctrl extends cApplicationCtrl{
    public $fields    = array('doc_title','content_type');
    public $op_fields = null;

    function main(iApplication $app, $app_path, $p) {
        // crée le compte utilisateur
        return WriterModule::createDocument( $p->doc_title, $p->content_type );
    }
};
?>