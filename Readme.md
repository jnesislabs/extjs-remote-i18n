JNESIS Remote Internationalization
==============================

This extension is part of our researches on remote i18n for ExtJS apps, which are illustrated in a [post on Sencha's blog](https://www.sencha.com/blog/internationalization-localization-with-sencha-ext-js/ "Internationalization &amp; Localization with Sencha Ext JS | Sencha")

  In some cases where language requirements are changing regularly, translations should be done outside the application, mostly managed by third party software and loaded into the application via one or several web services.
The advantages of this approach are:

 - Changing the language doesn’t require the developer to rebuild the application – the change is applied instantly after reloading.
 - Translation (localization) doesn’t necessarily have to be done by the same people who write the code.

That is why we wanted to provide the necessary resources to start implementing remote i18n inside ExtJS applications.

Get started
----------------
The provided ZIP file contains a ExtJS 6 workspace, with an **application** and a **local package** named `"jnesis-i18n"`. 
The package folder contains:

- A mixin extending `Ext.mixin.Mashup` that helps loading localization files before the application is initialized.
- An override of `Ext.Base` class, to call the setters of the specific attributes we want to translate during initializing of ExtJS components.

The application provides a simple way to:

-  Call remote JSON or JS files containing translations:
**`Localized.Application`** (app/Application.js file)
```js
requiredResources: [
  {source: 'resources/locale/label-{lang}.json', type: 'service'},
  {source: 'resources/locale/{lang}/ext-locale-{lang}.js', type: 'script'} // This file can originally be found in Ext sdk
]
```
**NOTE**: `type` attribute is meant to tell if the file is in JSON format, or is a plain javascript file.

- Determine the language that is requested
**`Localized.Application`** (app/Application.js file)
```js
getLang: function () {
  var lang = location.href.match(/locale=([\w-]+)/);
  return (lang && lang[1]) || 'en';
}
```
**NOTE**: `getLang` method is - in this sample - determining the current language by looking for a `locale` query parameter from the URL, but you can reimplement it as you need.

Let's assume that your translation web service or JSON file will give you this type of data : 
**`locale-en.json`**
```json
{
  "button": "My button",
    "title": "My title!"
}
```

Once this is correctly set, you can easily translate your components' labels, titles etc... by setting up the `localized` attribute in the views configuration:
```js
items: [{
    xtype: 'mainlist',
    localized: {
        title: '{title}'
    }
}]
```
The title of your `mainlist` would then be "My title!"