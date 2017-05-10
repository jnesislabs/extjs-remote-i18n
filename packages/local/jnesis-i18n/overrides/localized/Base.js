/* 
 * Copyright (c) 2015, aaugen
 *
 * JNESIS, All rights reserved.
 */
Ext.define('overrides.localized.Base', {
    override: 'Ext.Base',
    
    config: {
        localized: {}
    },
    
    updateLocalized: function (newLocalized, oldLocalized) {
        this.doLocalized();
    },
    
    doLocalized: function () {
        var me = this,
            translate = me.getLocalized() || {},
            value, setter;
    
        if (!Ext.Object.isEmpty(translate)) {
            for (var prop in translate) {
                value = translate[prop];
                
                setter = me.getOrcreateTranslatedPropertySetter(prop);

                if (value) {
                    setter.call(me, value);
                }
            }
        }
    },
    
    translating: function (descriptor) {
        var data = Ext.Locale.translations || {};
        return new Ext.XTemplate(descriptor).apply(data);
    },
    
    privates: {
        
        getOrcreateTranslatedPropertySetter: function (property) {
            var me = this,
                    configurator = me.getConfigurator(),
                    config = configurator.configs[property],
                    setterName, oldSetter, newSetter;

            // create config methods for this property if not already existe
            if (!config) {
                config = configurator.configs[property] = new Ext.Config(property);
            }

            setterName = config.names.set;

            oldSetter = me[setterName] || function (value) {
                me[property] = value;
            };

            if (oldSetter && oldSetter.isTranslatedSetter) {
                return oldSetter;
            }

            newSetter = me[setterName] = function (value) {
                if (value) {
                    value = me.translating(value);
                }
                return oldSetter.call(me, value);
            };
            newSetter.isTranslatedSetter = true;
            
            return newSetter;
        }
    }
});