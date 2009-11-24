<? // Main Template - This is the main site template to be used as the shell for all other pages ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<title>Simple Engine</title>
		<link rel="Shortcut Icon" href="/favicon.ico" />
		<link rel="stylesheet" href="stylesheets/style.css"  type="text/css" />
		<?
		// Include header JS file if it exists
		if(file_exists("./include/page/$page.php")){
			include("./include/page/$page.php");
		}
		?>
	</head>
	<body<?php if($page){ echo ' id="'.$page.'ContentContainer"';}// Allows you to have perpage styling if needed. Must set the $page variable for the custom name. ?>>
		<?php include("./content/$page.php"); ?>
	
	</body>
</html>