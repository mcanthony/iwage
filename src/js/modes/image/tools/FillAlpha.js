Ext.ns('iwage.image.tools');

Ext.define('iwage.image.tools.FillAlpha', {
    extend:'iwage.tools.Common',
    mode:iwage.MODES.IMAGE,
    persist:true,
    unique:true,
    toolLabel:'Rellenar Transparencia',
    componentWidth:390,
    createControls:function () {
        var tool = this;
        return [
            Ext.create('Ext.ux.colorpicker.ColorPicker', {
                //floating : true,
                width:370,
                itemId:'color',
                baseCls:Ext.baseCSSPrefix + 'colorpicker',
                listeners:{
                    scope:tool,
                    select:function (picker, value) {
                        if (!value) {
                            value = 'transparent';
                        }

                        if (value != 'transparent') {
                            value = '#' + value;
                        }

                        this.refresh(value);
                    }
                }
            })
        ];
    },
    refresh:function (value) {
        // Remover las imagenes de prueba
        $('.result.rounded').remove();

        // Crear la imagen
        var filled = iwage().utils.fillAlpha($('.result').get(0), value);

        // TODO usar metodos estandar
        $(filled)
            .addClass('result')
            .addClass('rounded')
            .appendTo($('.result').parent());
    },
    use:function (options) {
        this.callParent(arguments);

        // TODO usar metodos estandar
        $('.result').hide();

        this.refresh('transparent');
    },
    applyTool:function () {
        // Reemplazar la imagen
        iwage.file.set(
            iwage.file.imageToDataUri($('.result.rounded').get(0))
        );

        this.destroy();
    },
    destroy:function () {
        this.callParent(arguments);

        // TODO usar metodos estandar
        $('.result').show();

        // Remover las imagenes de prueba
        $('.result.rounded').remove();
    }
});