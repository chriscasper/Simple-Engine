<?php

/******************

SimpleEngine Configuration

Each environment is grouped within it's case. To add a new
environment (staging, for example) just create a new case.

******************/


switch( ENVIRONMENT )
{
  case "LOCAL":
  case "DEV":

    error_reporting( E_ALL );
    ini_set( 'display_errors', TRUE );
    ini_set( 'display_startup_errors', TRUE );

    // Always include the trailing slash in URL vars
    define( 'SITE_URL', 'http://localhost/' );
    define( 'SITE_NAME', 'Site Name' );
    define( 'SITE_DESC_DEFAULT', 'A basic install of Simple Engine.' );
    define( 'SITE_KEYWORDS_DEFAULT', 'Simple Engine,stupid simple,open source,robots rock' );

    break;
  case "PRODUCTION":

    error_reporting( E_ERROR );
    ini_set( 'display_errors', FALSE );
    ini_set( 'display_startup_errors', FALSE );

    // Always include the trailing slash in URL vars
    define( 'SITE_URL', 'http://localhost/' );
    define( 'SITE_NAME', 'Site Name' );
    define( 'SITE_DESC_DEFAULT', 'A basic install of Simple Engine.' );
    define( 'SITE_KEYWORDS_DEFAULT', 'Simple Engine,stupid simple,open source,robots rock' );


    break;
}

