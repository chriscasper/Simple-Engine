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

===

## <a name="install"></a>Installation

===

## <a name="config"></a>Site Configuration
You can use the `config.json` file int he root of the site for managing global variables you may want to use for your site. Those variables are then availible on all pages you create.

===

## <a name="updates"></a>Updates

===

## <a name="templates"></a>Templats

===

## <a name="content"></a>Content/Pages

===

## <a name="local-dev"></a>Local Development
To start developing locally, you need to start gulp:

```
gulp
```

This will start building the site, watching all files for changes, and run a local webserver of your Simple Engine site that you can view at `http://localhost:8000/`

===

## <a name="deploying"></a>Deploying
When you are ready to push your site live, run:

```
gulp build
```

Then just copy everything out of the `public` folder and ftp it to your webserver.
