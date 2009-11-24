<?php
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