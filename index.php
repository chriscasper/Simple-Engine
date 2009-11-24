<?php
/*
	Simple Engine - A seriously stupid php site framework
    Copyright (C) 2009 Chris Casper

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

// Retrieve our query string
$dir = $_GET['q'];

// Site Config
$siteURL = "http://yourdomain.com";

// Set Variables
$dir_find = '/';
$dir_find_pos = '0';
$page = "";
$pageTitle = "";
$pageTitleBanner = "";

// Split our query string into variables var1 and var2
$ary = split("/",$dir);
$var1=$ary[0];
$var2=$ary[1];

// Page logic
switch ( $var1 ){
	case page_1:
		$page = 'page_1';
		break;
	case about:
		$page = 'about';
		break;
	case contact:
		$page = 'contact';
		break;
	case sitemap:
		$page = 'sitemap';
		break;
	case copyright:
		$page = 'copyright';
		break;
	default:
		$page = "home";
}
// Include the main site template
include_once("templates/main_template.php");
?>