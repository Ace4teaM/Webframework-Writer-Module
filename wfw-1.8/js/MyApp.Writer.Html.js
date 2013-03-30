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
Ext.define('MyApp.Writer.Html', {});

/*------------------------------------------------------------------------------------------------------------------*/
//
// Ouvre un document est retourne son contenu
//
/*------------------------------------------------------------------------------------------------------------------*/
Ext.define('MyApp.Writer.Html.Editor', {
    name: 'Unknown',
    extend: 'Ext.panel.Panel',

    newBtn:null,
    openBtn:null,
    saveBtn:null,//Ext.create('Ext.Button'),
    publishBtn:null,
    printBtn:null,
    showBtn:null,

    docIdField:null,
    docTitleField:null,
    docContentField:null,
    
    config:{
        autoScroll:false,
        title:"Editeur HTML",
        border:false,
        bodyPadding:6,
        closeAction:'destroy',
        layout:'vbox',
        defaults:{
            width:'100%'
        }
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

        this.newBtn = Ext.create('Ext.Button',{
            text: 'Nouveau',
            iconCls: 'wfw_icon new',
            handler:function(){
                var form = Ext.create('MyApp.DataModel.FieldsDialog',{
                    title: 'Nouveau',
                    fieldsform:Ext.create('MyApp.DataModel.FieldsForm',{
                        wfw_fields:[{ id:'doc_title' }]
                    }),
                    callback:function(data){
                        //appel le controleur
                        wfw.Request.Add(null,wfw.Navigator.getURI("create"),
                            object_merge({
                                output:'xarg',
                                content_type:'text/html'
                            },data,false),
                            wfw.XArg.onCheckRequestResult_XARG,
                            {
                                onsuccess:function(req,args){
                                    me.docIdField.setValue(args.writer_document_id);
                                    me.docContentField.setValue(args.doc_content);
                                    me.docTitleField.setValue(args.doc_title);
                                    me.unlockLayout();
                                    MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                },
                                onfailed:function(req,args){
                                    MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                }
                            },
                            false
                            );
                    }
                }).show();

            }
        });

        this.openBtn = Ext.create('Ext.Button',{
            text: 'Ouvrir',
            iconCls: 'wfw_icon open',
            handler:function(){
                var wnd = Ext.create('MyApp.Writer.OpenDialog',{
                    title:'Ouvrir un document HTML...',
                    filter_type:'text/html',
                    callback:function(data){
                        me.docIdField.setValue(data.writer_document_id);
                        me.docContentField.setValue(data.doc_content);
                        me.docTitleField.setValue(data.doc_title);
                        me.unlockLayout();
                    }
                });
                wnd.show();
            }
        });

        this.saveBtn = Ext.create('Ext.Button',{
            text: 'Sauvegarder',
            iconCls: 'wfw_icon save',
            handler:function(){
                // appel le controleur
                wfw.Request.Add(null,wfw.Navigator.getURI("write"),
                {
                    output:'xml',
                    writer_document_id : me.docIdField.value,
                    doc_content : me.docContentField.value
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
            text: 'Imprimer',
            iconCls: 'wfw_icon print',
            handler:function(){
                var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                    writer_document_id : me.docIdField.value
                });
                window.open(uri, 'view').print();
            }
        });

        this.publishBtn = Ext.create('Ext.Button',{
            text: 'Publier',
            iconCls: 'wfw_icon publish',
            handler:function(){
                var form = Ext.create('MyApp.DataModel.FieldsDialog',{
                    title: 'Nouveau',
                    fieldsform:Ext.create('MyApp.DataModel.FieldsForm',{
                        wfw_fields:[{id:'page_id',optional:true},{id:'parent_page_id'},{id:'set_default_file_page_entry'},{id:'show_doc_after_publish'}]
                    }),
                    callback:function(data){
                        //appel le controleur
                        wfw.Request.Add(null,wfw.Navigator.getURI("publish"),
                            object_merge({
                                output:'xarg',
                                writer_document_id : me.docIdField.value
                            },data,false),
                            wfw.XArg.onCheckRequestResult_XARG,
                            {
                                onsuccess:function(req,args){
                                    MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                },
                                onfailed:function(req,args){
                                    MyApp.showResultToMsg(wfw.Result.fromXArg(args));
                                }
                            },
                            false
                            );
                    }
                }).show();

            }
        });

        this.showBtn = Ext.create('Ext.Button',{
            text: 'Afficher dans le navigateur',
            iconCls: 'wfw_icon view',
            handler:function(){
                var uri = wfw.URI.remakeURI(wfw.Navigator.getURI('view'),{
                    writer_document_id : me.docIdField.value
                });
                window.open(uri, 'view');
            }
        });

        //content
        this.docIdField = Ext.create('Ext.form.field.Hidden',{
            name:'writer_document_id'
        });
        this.docTitleField = Ext.create('Ext.form.field.Text',{
            name:'doc_title'
        });
        this.docContentField = Ext.create('Ext.form.field.HtmlEditor',{
            xtype: 'htmleditor',
            name:'doc_content',
            flex:1,
            autoScroll:true
        });

        //Toolbar
        Ext.apply(this, {
            items: [
            this.docIdField,
            {
                border:false,
                html:'Titre :',
                bodyPadding:6
            },
            this.docTitleField,
            {
                border:false,
                html:'Contenu :',
                bodyPadding:6
            },
            this.docContentField
            ]
        });

        //Toolbar
        Ext.apply(this, {
            tbar: [
            this.newBtn,
            '-',
            this.openBtn,
            '-',
            this.saveBtn,
            this.publishBtn,
            this.printBtn,
            '->',
            this.showBtn
            ]
        });

        this.superclass.initComponent.apply(this, arguments);
    },

    lockLayout : function(){
        this.saveBtn.disable();
        this.publishBtn.disable();
        this.printBtn.disable();
        this.showBtn.disable();
        this.docTitleField.disable();
        this.docContentField.disable();
    },

    unlockLayout : function(){
        this.saveBtn.enable();
        //this.publishBtn.enable();
        this.printBtn.enable();
        this.showBtn.enable();
        this.docTitleField.enable();
        this.docContentField.enable();
    }

});

MyApp.Writer.Html.onInitEditorLayout = function(Y){
    var wfw = Y.namespace("wfw");
    var g = MyApp.global.Vars;
    
    //var form = Ext.create('MyApp.DataModel.FieldsForm',{wfw_fields:[{id:'content_type'}]});
    var editor = Ext.create('MyApp.Writer.Html.Editor');
    //var editor = Ext.create('Ext.panel.Panel');

    g.contentPanel.removeAll();
    //g.contentPanel.add(form);
    g.contentPanel.add(editor);
}

MyApp.Writer.Html.onInitEditorLayout_ = function(Y){

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

//ajoute la fonction a l'initialisation de l'application'
MyApp.Loading.callback_list.push( MyApp.Writer.Html.onInitEditorLayout );
