/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Localized.Application', {
    extend: 'Ext.app.Application',
    mixins: ['Jnesis.mixin.Locale'],
    name: 'Localized',
    //requires: ['Localized.Labels'],
   requiredResources: [
        // Try with web service request
//        {source: 'resources/data/labels-{lang}.json', type: 'service'},
        {source: 'resources/locale/label-{lang}.json', type: 'service'},
        {source: 'resources/locale/{lang}/ext-locale-{lang}.js', type: 'script'}
    ],
    //translationsPath: 'Localized.Labels',
    
    getLang: function () {
        var lang = location.href.match(/locale=([\w-]+)/);
        return (lang && lang[1]) || 'en';
    },
    
    stores: [
        // TODO: add global / shared stores here
    ],
    
    launch: function () {
        // TODO - Launch the application
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
