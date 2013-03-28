/*
    ---------------------------------------------------------------------------------------------------------------------------------------
    (C)2013 Thomas AUGUEY <contact@aceteam.org>
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

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*'
]);


//loading functions
//ajoutez à ce global les fonctions d'initialisations
Ext.define('MyApp.Writer', {});

/*------------------------------------------------------------------------------------------------------------------*/
//
// Ouvre le dialogue de selection du document
//
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.Writer.openDocDialog = function(Y,callback){
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;

   //load data
   var myData=[];
   wfw.Request.Add(
        null,
        wfw.Navigator.getURI("list"),
        null,
        wfw.Xml.onCheckRequestResult,{
        onsuccess:function(req,doc,root){
            root.all("writerdocument").each(function(node){
                myData.push([
                    node.one(">writer_document_id").get("text"),
                    node.one(">doc_title").get("text"),
                    node.one(">content_type").get("text"),
                    node.one(">doc_content").get("text")
                ]);
            });
        }
   },false);

    // create the data store
    var store = Ext.create('Ext.data.ArrayStore', {
        fields: [
           {name: 'writer_document_id', type:'int'},
           {name: 'doc_title',      type: 'string'},
           {name: 'content_type',      type: 'string'},
           {name: 'doc_content',      type: 'string'}
        ],
        data: myData
    });

   if(!store.data.length)
      return alert("no data");

    // create the Grid
    var grid = Ext.create('Ext.grid.Panel', {
        title: false,
        store: store,
        stateful: true,
        stateId: 'stateGrid',
        columns: [
            {
                text     : 'Id',
                width    : 45,
                sortable : true,
                dataIndex: 'writer_document_id'
            },
            {
                text     : 'Titre',
                flex     : 1,
                sortable : true,
                dataIndex: 'doc_title'
            },
            {
                text     : 'Type',
                width    : 85,
                sortable : true,
                dataIndex: 'content_type'
            }
        ],
        height: 350,
        width: 600,
        viewConfig: {
            stripeRows: true
        }
    });
    
   //dialogue
    var wnd = Ext.create('widget.window', {
        title: 'Ouvrir',
        closable: true,
        width: 600,
        height: 350,
        layout: 'fit',
        bodyStyle: 'padding: 5px;',
        modal:true,
        items: grid,
        buttons: [
            {
                text:"Annuler",
                handler: function() {
                    wnd.close();
                }
            },
            '->',
            {
                text:"Ouvrir",
                handler: function() {
                    var s = grid.getSelectionModel().getSelection();
                    if(!s.length)
                        return;
                    callback(s[0]);
                    wnd.close();
                }
            }
        ]
    });
    
    wnd.show();
    return true;
};

/*------------------------------------------------------------------------------------------------------------------*/
//
// Ouvre le dialogue de création d'un document
//
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.Writer.createDocDialog = function(Y,callback){
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;

    var form = Ext.create('Ext.form.Panel', {
        defaults:{
            width:'100%'
        },
        bodyPadding:6,
        items: [
            MyApp.makeField(Y,'doc_title','string'),
            MyApp.makeField(Y,'content_type','string')
        ]
    });
            
   //dialogue
    var wnd = Ext.create('widget.window', {
        title: 'Nouveau',
        closable: true,
        width: 600,
        height: 350,
        layout:'fit',
        bodyStyle: 'padding: 5px;',
        modal:true,
        items: form,
        buttons: [
            {
                text:"Annuler",
                handler: function() {
                    wnd.close();
                }
            },
            '->',
            {
                text:"Créer",
                handler: function() {
                    //appel le controleur
                    wfw.Request.Add(null,wfw.Navigator.getURI("create"),
                        object_merge({
                            output:'xarg'
                        },form.getValues(),false),
                        wfw.XArg.onCheckRequestResult_XARG,
                        {
                            onsuccess:function(req,args){
                                callback(args);
                                MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                            },
                            onfailed:function(req,args){
                                MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                            }
                        },
                        false
                    );
                    
                    //initialise l'interface
                    wnd.close();
                }
            }
        ]
    });

    wnd.show();
    return true;
};
