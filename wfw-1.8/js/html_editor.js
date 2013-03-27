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

/*------------------------------------------------------------------------------------------------------------------*/
//
// Initialise le layout
//
/*------------------------------------------------------------------------------------------------------------------*/
MyApp.onInitEditorLayout = function(Y){

    var g = MyApp.global.Vars;
    //contenu
    g.contentPanel.add(Ext.create('Ext.Panel', {
        xtype:'panel',
        layout: "fit",
        border:false,
        id:"editor",flex:1, 
        layoutConfig: {
            align : 'stretch',
            pack  : 'start'
        },
        items:[
            {
                layout: "fit",
                xtype: 'htmleditor',
                id:'doc_content',
                name:'doc_content',
                enableColors: false,
                enableAlignments: false
            }
        ],
        tbar: [{
             text: 'Ouvrir',
             iconCls: 'icon-send'
        },'-',{
             text: 'Sauvegarder',
             iconCls: 'icon-save'
        },{
             text: 'Publier',
             iconCls: 'icon-spell'
        },'-',{
             text: 'Imprimer',
             iconCls: 'icon-print'
        },'->',{
             text: 'Afficher dans le navigateur',
             iconCls: 'icon-attach'
        }]
    }));
}

//ajoute la fonction a l'initialisation de l'application'
MyApp.Loading.callback_list.push( MyApp.onInitEditorLayout );
