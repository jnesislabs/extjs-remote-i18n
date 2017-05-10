/* 
 * Copyright (c) 23/08/2015, aaugen.
 * 
 * JNESIS, All rights reserved.
 */
Ext.define('Jnesis.mixin.Locale', function (Locale) { return {
    extend: 'Ext.mixin.Mashup',
    alternateClassName: 'Ext.Locale',
    
    requires: ['overrides.localized.Base'],
    
    mixinConfig: {
        id: 'locale',

        extended: function (baseClass, derivedClass) {
            Locale.process(derivedClass);
        }
    },

    statics: {
        translations: {},
        
        process: function (targetClass) {
            var body = targetClass.prototype,
                requiredResources = body.requiredResources,
                lang = body.getLang(),
                translationsPath = body.translationsPath,
                hooks = targetClass._classHooks,
                onCreated = hooks.onCreated;

            if (translationsPath) {
                Locale.translations = Ext.isString(translationsPath) 
                    ? eval(translationsPath) 
                    : translationsPath;
            }
            if (requiredResources) {
                if (lang) {
                    requiredResources = [];
                    for(var i=0;i<body.requiredResources.length;i++){
                        var resource = body.requiredResources[i];
                        resource.source = new Ext.Template(resource.source).apply({lang:lang})
                        requiredResources.push(resource);
                    }
                }
                delete body.requiredResources;
                hooks.onCreated = function () {
                    var me = this,
                        args = Ext.Array.slice(arguments);
                
                    Locale.loadFiles({
                        sources: requiredResources,
                        callback: function (statutes) {
                            for (var index in statutes) {
                                var statut = statutes[index];
                                if (statut.success) {
                                    var response = statut.response,
                                        type = statut.requestType;
                                    if (type === 'service') {
                                        var data = Ext.decode(response.responseText, true);
                                        if (data) {
                                            Ext.apply(Locale.translations, data);
                                        }
                                    } else {
                                        eval(response.responseText);
                                    }
                                } else {
                                    throw 'Fail to load required resources for language {' + lang 
                                            + '}: ' + requiredResources[index].source;
                                }
                            }
                            hooks.onCreated = onCreated;
                            hooks.onCreated.call(me, args);
                        }
                    });
                };
            }
        },
        
        loadFiles: function (options) {
            var me = this,
                    sources = (Ext.isArray(options.sources) ? options.sources : [options.sources]) || [],
                    responses = {},
                    callbackFn = options.callback,
                    scope = options.scope || me,
                    i = 0,
                    returns = 0;

            for (; i < sources.length; i++) {
                var source = sources[i].source,
                    type = sources[i].type;
                responses[i] = {};
                Ext.Ajax.request({
                    url: source,
                    requestType: type,
                    callback: function (options, success, response) {
                        responses[returns].success = success;
                        responses[returns].response = response;
                        responses[returns].requestType = response.request.requestType;
                        returns++;
                        if (returns === sources.length) {
                            callbackFn.call(scope, responses);
                        }
                    }
                });
            }
        }
    },

    onClassMixedIn: function (targetClass) {
        Locale.process(targetClass);
    },
    
    getLang: function() {
        return 'en';
    }
    
}});