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
Ext.define('MyApp.Writer.Html', {});

/*------------------------------------------------------------------------------------------------------------------*/
//
// Initialise le layout
//
/*------------------------------------------------------------------------------------------------------------------*/
MyApp.Writer.Html.onInitEditorLayout_ = function(Y){
    var g = MyApp.global.Vars;
    var editor = Ext.create('MyApp.Writer.Html.Editor', {layout:'vbox'});
    //var editor = Ext.create('Ext.panel.Panel');

    g.contentPanel.removeAll();
    g.contentPanel.add(editor);
}
Ext.onReady(function(){
Ext.define('MyApp.Writer.Html.Editor', {
    name: 'Unknown',
    extend: 'Ext.panel.Panel',

    config:{
        autoScroll:false,
        title:"Editeur HTML",
        border:false,
        bodyPadding:6,
        items:[],
        tbar: []
    },
    
    constructor: function(config) {
        var obj=this;
        this.newBtn = Ext.create('Ext.Button',{
              id: 'newBtn',
              text: 'Nouveau',
              iconCls: 'wfw_icon new',
              handler:function(){
                  MyApp.Writer.Html.createDialog(Y,function(data){
                      Ext.getCmp('writer_document_id').setValue(data.writer_document_id);
                      Ext.getCmp('doc_content').setValue("");
                      Ext.getCmp('doc_title').setValue(data.doc_title);
                      MyApp.Writer.Html.unlockLayout();
                  });
              }
         });
        this.openBtn = Ext.create('Ext.Button',{
                id: 'openBtn',
                text: 'Ouvrir',
                iconCls: 'wfw_icon open',
                handler:function(){
                    obj.openDialog(Y,function(dataModel){
                        wfw.puts(dataModel.getAssociatedData());
                        obj.docIdField.setValue(dataModel.get("writer_document_id"));
                        obj.docContentField.setValue(dataModel.get("doc_content"));
                        obj.docTitleField.setValue(dataModel.get("doc_title"));
                        obj.unlockLayout();
                    });
                }
           });
        this.saveBtn = Ext.create('Ext.Button',{
             id: 'saveBtn',
             text: 'Sauvegarder',
             iconCls: 'wfw_icon save',
             handler:function(){
                // appel le controleur
                wfw.Request.Add(null,wfw.Navigator.getURI("write"),
                    {
                        output:'xml',
                        writer_document_id : Ext.getCmp('writer_document_id').value,
                        doc_content : Ext.getCmp('doc_content').value
                    },
                    wfw.Xml.onCheckRequestResult,
                    {
                        onsuccess:function(req,doc,root){
                            MyApp.showResultToMsg(wfw.Result.fromXML(root));
                        },
                        onfailed:function(req,doc,root){
                            MyApp.showResultToMsg(wfw.Result.fromXML(root));
                        }
                    },
                    false
                );
             }
        });
        this.printBtn = Ext.create('Ext.Button',{
             id: 'printBtn',
             text: 'Imprimer',
             iconCls: 'wfw_icon print',
            handler:function(){
                var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                    writer_document_id : Ext.getCmp('writer_document_id').value
                });
                window.open(uri, 'view').print();
            }
        });
        this.publishBtn = Ext.create('Ext.Button',{
             id: 'publishBtn',
             text: 'Publier',
             iconCls: 'wfw_icon publish'
        });
        this.showBtn = Ext.create('Ext.Button',{
            id: 'showBtn',
            text: 'Afficher dans le navigateur',
            iconCls: 'wfw_icon view',
            handler:function(){
               var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                   writer_document_id : Ext.getCmp('writer_document_id').value
               });
               window.open(uri, 'view');
            }
        });
        
        //content
        this.docIdField = Ext.create('Ext.form.field.Hidden',{
            id:'writer_document_id',
            name:'writer_document_id'
        });
        this.config.items.push(this.docIdField);
        this.config.items.push({
            border:false,
            html:'Titre :',
            bodyPadding:6
        });
        this.docTitleField = Ext.create('Ext.form.field.Text',{
            id:'doc_title',
            name:'doc_title'
        });
        this.config.items.push(this.docTitleField);
        this.config.items.push({
            border:false,
            html:'Contenu :',
            bodyPadding:6
        });
        this.docContentField = Ext.create('Ext.form.field.HtmlEditor',{
            xtype: 'htmleditor',
            id:'doc_content',
            name:'doc_content',
            flex:1,
            autoScroll:true
        });
        this.config.items.push(this.docContentField);
        
        //Toolbar
        this.config.tbar.push(this.newBtn);
        this.config.tbar.push('-');
        this.config.tbar.push(this.openBtn);
        this.config.tbar.push('-');
        this.config.tbar.push(this.saveBtn);
        this.config.tbar.push(this.publishBtn);
        this.config.tbar.push(this.printBtn);
        this.config.tbar.push('->');
        this.config.tbar.push(this.showBtn);
        
        this.superclass.constructor.call(this,config);
        return this;
    },

    newBtn:null,
    openBtn:null,
    saveBtn:null,//Ext.create('Ext.Button'),
    publishBtn:null,
    printBtn:null,
    showBtn:null,
    
    docIdField:null,
    docTitleField:null,
    docContentField:null,
/*
    constructor: function(docId) {
        this.docTitleField = Ext.create({
            xtype: 'textfield'
        });
        /*this.docContentField = Ext.create({
            xtype: 'htmleditor',
            flex:1,
            autoScroll:true
        });
        /*if (docId) {
            this.loadDoc(docId);
        }
    },*/

    lockLayout : function(){
        this.saveBtn.disable();
        this.publishBtn.disable();
        this.printBtn.disable();
        this.showBtn.disable();
        this.docTitle.disable();
        this.docContent.disable();
    },

    unlockLayout : function(){
        this.saveBtn.enable();
        //this.publishBtn.enable();
        this.printBtn.enable();
        this.showBtn.enable();
        this.docTitle.enable();
        this.docContent.enable();
    }
});
});

MyApp.Writer.Html.onInitEditorLayout = function(Y){

    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;

    //contenu
    g.contentPanel.removeAll();
    g.contentPanel.add({
        id:'writer_html_layout',
        name:'writer_html_layout',
        xtype:'panel',
        layout:'vbox',
        layoutConfig: {
            align : 'stretch',
            pack  : 'start'
        },
        defaults:{
                width:"100%"
        },
        autoScroll:false,
        title:"Editeur HTML",
        border:false,
        id:"editor",
        bodyPadding:6,
        items:[
            {
                xtype: 'hiddenfield',
                id:'writer_document_id',
                name:'writer_document_id'
            },
            {
                border:false,
                html:'Titre :',
                bodyPadding:6
            },
            {
                xtype: 'textfield',
                id:'doc_title',
                name:'doc_title'
            },
            {
                border:false,
                html:'Contenu :',
                bodyPadding:6
            },
            {
                xtype: 'htmleditor',
                id:'doc_content',
                name:'doc_content',
                flex:1,
                autoScroll:true
            }
        ],
        tbar: [
            {
                id: 'newBtn',
                text: 'Nouveau',
                iconCls: 'wfw_icon new',
                handler:function(){
                    MyApp.Writer.Html.createDialog(Y,function(data){
                        Ext.getCmp('writer_document_id').setValue(data.writer_document_id);
                        Ext.getCmp('doc_content').setValue("");
                        Ext.getCmp('doc_title').setValue(data.doc_title);
                    });
                }
           },
           '-',
           {
                id: 'openBtn',
                text: 'Ouvrir',
                iconCls: 'wfw_icon open',
                handler:function(){
                    MyApp.Writer.Html.openDialog(Y,function(dataModel){
                        wfw.puts(dataModel.getAssociatedData());
                        Ext.getCmp('writer_document_id').setValue(dataModel.get("writer_document_id"));
                        Ext.getCmp('doc_content').setValue(dataModel.get("doc_content"));
                        Ext.getCmp('doc_title').setValue(dataModel.get("doc_title"));
                    });
                }
           },
           '-',
           {
             id: 'saveBtn',
             text: 'Sauvegarder',
             iconCls: 'wfw_icon save',
             handler:function(){
                // appel le controleur
                wfw.Request.Add(null,wfw.Navigator.getURI("write"),
                    {
                        output:'xml',
                        writer_document_id : Ext.getCmp('writer_document_id').value,
                        doc_content : Ext.getCmp('doc_content').value/*,
                        doc_title : Ext.getCmp('doc_title').value*/
                    },
                    wfw.Xml.onCheckRequestResult,
                    {
                        onsuccess:function(req,doc,root){
                            MyApp.showResultToMsg(wfw.Result.fromXML(root));
                        },
                        onfailed:function(req,doc,root){
                            MyApp.showResultToMsg(wfw.Result.fromXML(root));
                        }
                    },
                    false
                );
             }
        },{
             id: 'publishBtn',
             text: 'Publier',
             iconCls: 'wfw_icon publish'
        },'-',{
             id: 'printBtn',
             text: 'Imprimer',
             iconCls: 'wfw_icon print',
            handler:function(){
                var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                    writer_document_id : Ext.getCmp('writer_document_id').value
                });
                window.open(uri, 'view').print();
                
            }
        },'->',{
             id: 'showBtn',
             text: 'Afficher dans le navigateur',
             iconCls: 'wfw_icon view',
            handler:function(){
                var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                    writer_document_id : Ext.getCmp('writer_document_id').value
                });
                window.open(uri, 'view');
                
            }
        }]
    });
    
    //MyApp.Writer.Html.lockLayout();
}

/*------------------------------------------------------------------------------------------------------------------*/
//
// Ouvre le dialogue de selection du document
//
/*------------------------------------------------------------------------------------------------------------------*/

MyApp.Writer.Html.openDialog = function(Y,callback){
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;

   //liste les fichier HTML
   var myData=[];
   wfw.Request.Add(
        null,
        wfw.Navigator.getURI("list"),
        {content_type:'text/html'},
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
      return Ext.MessageBox.alert('Ouvrir un document HTML...','Aucun document disponible');

    // crée la grille de selection
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
        title: 'Ouvrir un document HTML...',
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

MyApp.Writer.Html.createDialog = function(Y,callback){
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;

    var form = Ext.create('Ext.form.Panel', {
        defaults:{
            width:'100%'
        },
        bodyPadding:6,
        items: [
            MyApp.makeField(Y,'doc_title','string')
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
                            output:'xarg',
                            content_type:'text/html'
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

//ajoute la fonction a l'initialisation de l'application'
MyApp.Loading.callback_list.push( MyApp.Writer.Html.onInitEditorLayout );
