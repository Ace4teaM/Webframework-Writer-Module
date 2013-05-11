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

//loading functions
//ajoutez à ce global les fonctions d'initialisations
Ext.define('MyApp.Writer', {});

/**
 *------------------------------------------------------------------------------------------------------------------
 * @brief Ouvre un document et retourne son contenu
 * 
 * # Example
 *
 *     @code{.js}
 *     Ext.create('MyApp.Writer.OpenDialog', {
 *         callback:function(data){
 *              data.writer_document_id;
 *              data.doc_title;
 *              data.doc_content;
 *              data.content_type;
 *         },
 *         filter_type : 'text/html' // proposer uniquement les documents HTML
 *     });
 *     @endcode
 *------------------------------------------------------------------------------------------------------------------
 */
Ext.define('MyApp.Writer.OpenDialog', {
    /**
     * @param {String} filter_type
     * Specifie le type de contenu à ouvrir
     */
    require:[
        'Ext.grid.*',
        'Ext.data.*'
    ],
    
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
        callback:function(data){},
        filter_type: false
    },

    constructor: function(config) {
        Ext.apply(this, this.config);
        this.superclass.constructor.call(this,config);
        return this;
    },

    initComponent: function()
    {
        var wfw = Y.namespace("wfw");
        var me=this;
            
        // onClose
        this.closeBtn = Ext.create('Ext.Button',{
            text:"Annuler",
            handler:function(){
                me.close();
            }
        });
             
        // onOpen
        this.openBtn = Ext.create('Ext.Button',{
            text: 'Ouvrir',
            handler:function(){
                var s = me.grid.getSelectionModel().getSelection();
                if(!s.length)
                    return;
                var data={
                    writer_document_id : s[0].get("writer_document_id"),
                    /*doc_content        : s[0].get("doc_content"),*/
                    doc_title          : s[0].get("doc_title"),
                    content_type       : s[0].get("content_type")
                };
                //obtient le contenu
                wfw.Request.Add(
                    null,
                    wfw.Navigator.getURI("read"),
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
                me.callback(data);
                me.close();
            }
        });

        //obtient la liste des documents
        var myData=[];
        var param={};
        if(me.filter_type){
            param.content_type = me.filter_type;
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
            },false
        );

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
        if(!me.filter_type){
            this.grid.columns.push({
                text     : 'Type',
                width    : 65,
                sortable : true,
                dataIndex: 'content_type'
            });
        }
        this.grid = Ext.create('Ext.grid.Panel', this.grid);
            
        //Boutons
        Ext.apply(this, {
            items: [
                this.grid
            ]
        });
        
        //Boutons
        Ext.apply(this, {
            buttons: [
                this.closeBtn,
                '-',
                this.openBtn
            ]
        });

        //ok
        this.superclass.initComponent.apply(this, arguments);
    }
});
