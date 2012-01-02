Ext.ns('app.image.tools.glfx');

Ext.define('app.image.tools.glfx.Ink', {
    toolLabel: 'Ink',
    extend: 'app.image.tools.glfx.Common',
    createControls: function() {
        return [
            {
                xtype: 'slider',
                fieldLabel: 'Intensidad',
                itemId: 'value',
                width: 350,
                value: 0,
                minValue: -100,
                maxValue: 100
            }
        ];
    },
    previewFilter: function(values) {
        this.fxCanvas.draw(this.texture).ink(values.value / 100).update();
    }
});