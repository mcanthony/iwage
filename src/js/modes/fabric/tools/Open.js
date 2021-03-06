Ext.ns('iwage.fabric.tools');

Ext.define('iwage.fabric.tools.Open', {
    extend: 'iwage.tools.Open',
    toolLabel: 'Abrir',
    use: function(options) {
        var self = this;

        Ext.Ajax.request({
            url: this.proxy || iwage.options.fabricProxy,
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);

                if (json && json.data) {
                    self.getComponent().loadList(json.data);
                }

                self.renderComponent();
                self.initEvents();
            }
        });
    },
    getComponent: function() {
        var openTool = this;

        if (this.component) {
            return this.component;
        }

        this.component = Ext.create('Ext.window.Window', {
            draggable: false,
            resizable: false,
            title: openTool.toolLabel,
            layout: 'hbox',
            width: 600,
            loadList: function(list) {
                list = list || [];

                this.list = list;

                var listCmp = this.down('#list');

                list.forEach(function(e) {
                    listCmp.add({
                        xtype: 'panel',
                        overCls: 'hover-active',
                        border: false,
                        padding: 5,
                        html: iwage('<div data-id="{id}">{name}</div>').tpl({
                            id: e.idLogoSave,
                            name: e.name
                        })
                    });
                });

                this.enable();
            },
            activeTpl: '<div class="logo_open">' +
                '<div class="field"><label>Archivo: </label><span>{name} ({w}x{h})</span></div>' +
                '<div class="preview"><div class="img-ct">{img}</div></div>' +
                '<div class="field last">Ultima fecha de modificaci&oacute;n: <span>{date}</span></div>' +
                '</div>',
            setActive: function(id) {
                var rec, preview = this.down('#preview');

                if (!preview) {
                    return;
                }

                preview.removeAll();

                if (!this.list) {
                    return;
                }

                rec = this.list.filter(function(e) {
                    return e.idLogoSave == id
                })[0];

                if (!rec) {
                    return;
                }

                this.active = rec;

                preview.add({
                    xtype: 'container',
                    padding: 10,
                    html: iwage(this.activeTpl).tpl({
                        name: rec.name,
                        date: rec.date,
                        w: rec.width,
                        h: rec.height,
                        img: iwage('<img src="{base}asset/logo_save/preview/{file}" alt="">').tpl({
                            base: '/',
                            file: rec.preview + '.png' + '?' + Math.random()
                        })
                    })
                });
            },
            buttons: [
                {
                    xtype: 'button',
                    text: 'Abrir',
                    icon: iwage.icon('tick'),
                    handler: function(self) {
                        var opener = openTool.getComponent();

                        var active = opener.active;

                        if (!active) {
                            return;
                        }

                        iwage.file.load(active.serialized);

                        openTool.destroy();
                    }
                },
                {
                    xtype: 'button',
                    text: 'Cancelar',
                    icon: iwage.icon('delete_cross'),
                    handler: function(self) {
                        try {
                            openTool.destroy();
                        } catch(e) {
                        }
                    }
                }
            ],
            items: [
                {
                    xtype: 'panel',
                    title: 'Archivo',
                    itemId: 'list',
                    width: 200,
                    height: 400,
                    listeners: {
                        afterrender: function(self) {
                            self.getEl().on('click', function(ev, target, opts) {
                                var id;

                                try {
                                    id = Ext.Element.get(target).getAttribute('data-id');
                                } catch(e) {
                                }

                                if (id) {
                                    openTool.getComponent().setActive(id);
                                }

                            }) // ev, target, opts
                        }
                    }
                },
                {
                    xtype: 'panel',
                    itemId: 'preview',
                    title: 'Vista previa',
                    width: 390,
                    height: 400
                }
            ]
        });

        return this.component;
    }
});