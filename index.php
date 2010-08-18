<?php
/*
	Simple Engine - A seriously simple php site framework
    Copyright (C) 2010 Chris Casper

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Set the environment. Value should match a relevant "case" option in config
define( 'ENVIRONMENT', 'LOCAL' );

// Using require once so that SE will fail if config doesnt exist
require_once( 'config.php' );

// Drop in some global helper functions
include_once( 'includes/system_helpers.php' );

// Drop in some user defined functions
include_once( 'includes/functions.php' );


// Pull the section and page vars
initPageVars();

// Set some defaults
setPageTitle( SITE_NAME );
setPageDesc( SITE_DESC_DEFAULT );
setPageKeywords( SITE_KEYWORDS_DEFAULT );

initPageCSS();
initPageJS();



// Include the default layout
setPageLayout( 'basic' );

// Load the page into the page content
loadRoute( $page, $routes, $routesLength );

// Give it to the user wrapped neatly in a layout
include_once( 'layouts/' . getPageLayout() . '/index.php' );
