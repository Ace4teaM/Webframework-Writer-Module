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

/*------------------------------------------------------------------------------------------------------------------*/
//
// Initialise le layout
//
/*------------------------------------------------------------------------------------------------------------------*/
MyApp.Writer.onInit = function(Y){
    var wfw = Y.namespace("wfw");
    
    
    /*------------------------------------------------------------------------------------------------------------------*/
    //
    // Ouvre un document et retourne son contenu
    //
    /*------------------------------------------------------------------------------------------------------------------*/
    Ext.define('MyApp.Writer.OpenDialog', {
        extend: 'Ext.window.Window',

        closeBtn:null,
        openBtn:null,

        grid:null,
        store:null,

        config:{
            title: 'Ouvrir un document...',
            width: 600,
            height: 350,
            layout: 'fit',
            closable: true,
            modal:true,
            items: [],
            buttons: [],
            callback:function(dataModel){},
            filter_type: false
        },

        initComponent: function() {
            this.callParent();
        },
        
        constructor: function(config) {
            config = object_merge(this.config,config);
            var wnd=this;
            
            // onClose
            this.closeBtn = Ext.create('Ext.Button',{
                text:"Annuler",
                handler:function(){
                    wnd.close();
                }
            });
             
            // onOpen
            this.openBtn = Ext.create('Ext.Button',{
                text: 'Ouvrir',
                handler:function(){
                    var s = wnd.grid.getSelectionModel().getSelection();
                    if(!s.length)
                        return;
                    var data={
                        writer_document_id : s[0].get("writer_document_id"),
                        /*doc_content        : s[0].get("doc_content"),*/
                        doc_title          : s[0].get("doc_title")
                    };
                    //obtient le contenu
                    wfw.Request.Add(
                        null,
                        wfw.Navigator.getURI("view"),
                        {
                            writer_document_id:data.writer_document_id
                        },
                        wfw.Request.onCheckRequestStatus,
                        {
                            oncontent:function(req,content){
                                data.doc_content=content;
                            }
                        },false);
                    //appel le callback
                    config.callback(data);
                    wnd.close();
                }
            });

            //obtient la liste des documents
            var myData=[];
            var param={};
            if(config.filter_type){
                param.content_type = config.filter_type;
            }
            wfw.Request.Add(
                null,
                wfw.Navigator.getURI("list"),
                param,
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

            // crée le model de données
            this.store = Ext.create('Ext.data.ArrayStore', {
                fields: [
                {
                    name: 'writer_document_id', 
                    type:'int'
                },

                {
                    name: 'doc_title',      
                    type: 'string'
                },

                {
                    name: 'content_type',      
                    type: 'string'
                },

                {
                    name: 'doc_content',      
                    type: 'string'
                }
                ],
                data: myData
            });

            if(!this.store.data.length)
                return Ext.MessageBox.alert('Ouvrir un document HTML...','Aucun document disponible');

            // crée la grille de selection
            this.grid = {
                title: false,
                store: this.store,
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
                }
                ],
                viewConfig: {
                    stripeRows: true
                }
            };
            if(!config.filter_type){
                this.grid.columns.push({
                    text     : 'Type',
                    width    : 65,
                    sortable : true,
                    dataIndex: 'content_type'
                });
            }
            this.grid = Ext.create('Ext.grid.Panel', this.grid);
            config.items.push(this.grid);
            
            //Boutons
            config.buttons.push(this.closeBtn);
            config.buttons.push('->');
            config.buttons.push(this.openBtn);

            //ok
            this.superclass.constructor.call(this,config);
            return this;
        }
    });
}
MyApp.Loading.callback_list.push( MyApp.Writer.onInit );