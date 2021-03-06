Ext.define('Planche.controller.connection.Connect', {
    extend: 'Ext.app.Controller',

    initWindow : function(){

        var columns = this.makeListColumns();

        var fields = [];
        Ext.each(columns, function(obj){

            fields.push(obj.dataIndex);
        });

        var store = Ext.create('Ext.data.Store', {
            fields:fields
        });

        var grid = Ext.create('Ext.grid.Panel', {
            id : 'connect-grid',
            border : false,
            columnLines: true,
            width : '100%',
            flex  : 1,
            columns : columns,
            store: store,
            listeners : {
                scope : this,
                itemdblclick : function(view, record){

                    var win = view.up("window");
                    var config = record.raw;

                    Ext.require('Planche.engine.MySQL', function(){

                        Ext.apply(config, {
                            engine : Planche.engine.MySQL
                        });

                        this.getApplication().initConnectTab(config);
                        win.hide();
                    }, this);
                }
            }
        });

        store.on('refresh', function(store, records, successful, eOpts){

            this.getSelectionModel().select(store.getAt(0));
            //debugger;
        }, grid);

        Ext.create('Planche.lib.Window', {
            id : 'window-'+this.id,
            stateful: true,
            title : 'Connect to MySQL Host',
            layout : 'fit',
            bodyStyle:"background-color:#FFFFFF",
            width : 900,
            height: 500,
            overflowY: 'auto',
            autoScroll : true,
            modal : true,
            plain: true,
            fixed : true,
            shadow : false,
            autoShow : true,
            constrain : true,
            items : grid,
            buttons : [{
                text : 'Connect',
                scope : this,
                handler : function(btn, e){
                    
                    var win = btn.up('window');
                    var sel = win.down('grid').getSelectionModel().getSelection();

                    if(!sel) return;

                    this.getApplication().initConnectTab(sel[0].raw);
                    win.hide();
                }
            },{
                text : 'Test Connect',
                disabled: true
            }],
            listeners : {
                boxready : function(){

                    store.loadData(Planche.config.hosts);
                }
            }
        });
    },

    makeListColumns : function(){   
        
        return [
            { text: 'Host Name', dataIndex: 'host_name', width : 200, renderer: function(value, p, record){
                
                return Ext.String.format('<img src=\'./images/icon_database24x24.png\'> {0}', value);
            }},
            { text: 'Host', dataIndex: 'host', width : 100, renderer: function(value, p, record){
                
                return Ext.String.format('<img src=\'./images/icon_server24x24.png\'> {0}', value);
            }},
            { text: 'User', dataIndex: 'user', width : 100, renderer: function(value, p, record){
                
                return Ext.String.format('<img src=\'./images/icon_user24x24.png\'> {0}', value);
            }},
            { text: 'Charset', dataIndex: 'charset', width : 100 },
            { text: 'Port', dataIndex: 'port', width : 60 },
            { text: 'HTTP Tunneling URL', dataIndex: 'http_tunneling', flex : 1 }
        ];
    }
});