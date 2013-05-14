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
    'Ext.state.*',
    'Ext.ux.form.field.TinyMCE',
    'Wfw.Result',
    'Wfw.DataModel'
    ]);


//loading functions
//ajoutez à ce global les fonctions d'initialisations
Ext.define('Wfw.Writer.Html', {});

/*------------------------------------------------------------------------------------------------------------------*/
//
// Panneau d'edition principal
//
/*------------------------------------------------------------------------------------------------------------------*/
Ext.define('Wfw.Writer.Html.Editor', {
    name: 'Unknown',
    extend: 'Ext.panel.Panel',
    alias: 'widget.wfw_writer_html_editor',

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
                var form = Ext.create('Wfw.DataModel.FieldsDialog',{
                    title: 'Nouveau',
                    fieldsform:Ext.create('Wfw.DataModel.FieldsForm',{
                        wfw_fields:[{ id:'doc_title' }],
                        defaults_buttons:false
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
                                    Wfw.showResultToMsg(wfw.Result.fromXArg(args));
                                },
                                onfailed:function(req,args){
                                    Wfw.showResultToMsg(wfw.Result.fromXArg(args));
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
                var wnd = Ext.create('Wfw.Writer.OpenDialog',{
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
                    doc_content : me.docContentField.getValue()
                },
                wfw.Xml.onCheckRequestResult,
                {
                    onsuccess:function(req,doc,root){
                        Wfw.showResultToMsg(wfw.Result.fromXML(root));
                    },
                    onfailed:function(req,doc,root){
                        Wfw.showResultToMsg(wfw.Result.fromXML(root));
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
                var form = Ext.create('Wfw.DataModel.FieldsDialog',{
                    title: 'Publier',
                    fieldsform:Ext.create('Wfw.DataModel.FieldsForm',{
                        wfw_fields:[
                            {id:'page_id',optional:true},
                            {id:'parent_page_id'},
                            {id:'set_in_default'},
                            {id:'show_doc_after_publish'},
                            {id:'set_in_cache'}
                        ],
                        defaults_buttons:false
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
                                    if(data.show_doc_after_publish)
                                        window.open(args.link);
                                    Wfw.showResultToMsg(wfw.Result.fromXArg(args));
                                },
                                onfailed:function(req,args){
                                    Wfw.showResultToMsg(wfw.Result.fromXArg(args));
                                }
                            },
                            false
                            );
                    }
                });
                
                //obtient lees infos existantes
                form.getFieldsForm().loadFormData(wfw.Navigator.getURI("get_publish", {add_fields : {writer_document_id : me.docIdField.value}}));
                
                //affiche le formulaire
                form.show();
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
        this.docContentField = Ext.create('Ext.ux.form.field.TinyMCE',{
            anchor: '100%',
            name:'doc_content',
            flex:1,
            autoScroll:true,
            //disabled: true,
            tinymceConfig: {
                theme_advanced_buttons1: 'fullscreen,|,undo,redo,|,bold,italic,strikethrough,|,charmap,|,removeformat,code',
                theme_advanced_buttons2: '',
                theme_advanced_buttons3: '',
                theme_advanced_buttons4: ''
            }
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
