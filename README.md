# Simple Engine
A seriously simple static generator!

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
If you have all the requireents installed already, you should be all set to get going. Just run the following:

```
$ npm install
```

===

## <a name="config"></a>Site Configuration
You can use the `config.json` file int he root of the site for managing global variables you may want to use for your site. Those variables are then availible on all pages you create.

===

## <a name="updates"></a>Updates
Updates should be easy. I don't plan on doing any major breaking changes like folder names, so just make sure you do a pull form the main repo from time to time.

===

## <a name="templates"></a>Templates
Simple Engine uses the [swig](http://paularmstrong.github.io/swig/) template engine. You can find more documentation and examples on how to use it [here](http://paularmstrong.github.io/swig/).

===

## <a name="content"></a>Content/Pages
All of your content/pages will live in the `source/content` folder. Just create a new html file and give it the same name you want for the URL. If you create a file called `about.html`, it will then be availible on your site at hostname.com/about. Right now Simple Engine only supports one level of nesting in the `content` folder.

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

Then just copy everything out of the `public` folder and ftp it to your webserver.
