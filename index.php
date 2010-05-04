<?php
/*
	Simple Engine - A seriously stupid php site framework
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

include_once("includes/functions.php");

// Site Config
$siteURL = "http://localhost/github/simple-engine";
$siteTitle = "Site Name";
$siteTitleSeparator = " | ";

// Retrieve our query string (sent from apache)
if (isset($_GET['q'])) {
  $dir = $_GET['q'];
} else {
	$dir = '';
}

// Split our query string into variables
$routes = explode("/",$dir);
$routesLength = count($routes);
$go = $routes[$routesLength-1];
if($routesLength != '1') {
	$go = $routes[$routesLength-2];
}

// Set page default for homepage
if(!$go && ($routesLength == '1')) {
	$section = "home";
	$page = "home";
} else {
	$section = $routes[0];
	$page = "$go";
}

$pageTitle = ucfirst($page); 

// Include the default template
$default_template = "jumpstart";
include_once("templates/" . $default_template . "/index.php");

?>