# Simple Engine
Simple Engine is a seriously simple static website engine.

Will be adding more directions and documentation here shortly.

- [Requirements](#requirements)
- [Installation](#install)
- [Configuration](#config)
- [Updates](#updates)
- [Templates](#templates)
- [Content/Pages](#content)
- [Local Development](#local-dev)
- [Deploying](#deploying)

===

## <a name="requirements"></a>Requirements

The following is required:

- node.js [https://nodejs.org](https://nodejs.org)
- npm (npm will be installed with nodejs)
- gulpjs [http://gulpjs.com/](http://gulpjs.com/)

===

## <a name="install"></a>Installation

If you have all the requirements installed already, you should be all set to get going. Just run the following:

```
$ npm install
```

This will install all of the node modules needed to run and build Simple Engine.

===

## <a name="config"></a>Site Configuration

You can use the `config.json` file in the root of the site for managing global variables you may want to use for your site. Those variables are then availible on all pages you create.

Inside of the `config.json` file, you can declare your variables you wish to use.

```
{
  "title": "Simple Engine",
  "url": "http://simpleengine.com",
  "author": "Christopher Casper",
  "email": "chris@huelio.com",
  "site_description": "A seriously simple static generator!",
  "site_title": "Simple Engine"
}
```

Then to access them in your template, you would use the following:

```
{{ title }}
```

You can also expand upon this and use arrays or key value pairs for more data driven content.


===

## <a name="updates"></a>Updates

Updates should be easy. I don't plan on doing any major breaking changes like folder names, so just make sure you do a pull form the main repo from time to time.

===

## <a name="templates"></a>Templates

Simple Engine uses the [swig](http://paularmstrong.github.io/swig/) template engine. You can find more documentation and examples on how to use it [here](http://paularmstrong.github.io/swig/).

===

## <a name="content"></a>Content/Pages

All of your content/pages will live in the `source/content` folder. Just create a new html file and give it the same name you want for the URL. If you create a file called `about.html`, it will then be availible on your site at hostname.com/about. You may also nest directories for a deeper level of navigation.

There are two examples of this, one for `/about` and one for `/products`.

===

## <a name="local-dev"></a>Local Development

To start developing locally, you need to start gulp:

```
$ gulp
```

This will start building the site, watching all files for changes, and run a local webserver of your Simple Engine site that you can view at `http://localhost:8000/`

===

## <a name="deploying"></a>Deploying

When you are ready to push your site live, run:

```
$ gulp build
```

This just rebuilds a fresh version of the site without the live reload web server running.
