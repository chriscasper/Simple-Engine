<? // Main Template - This is the main site template to be used as the shell for all other pages ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"> 
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
		<title><?=$siteTitle . $siteTitleSeparator . $pageTitle ?></title>
		<link rel="Shortcut Icon" href="<?= $siteURL ?>/favicon.ico" />
		<link rel="stylesheet" href="<?= $siteURL ?>/css/<?=$default_template?>/global.css"  type="text/css" />
		<?
			// Include header CSS file if it exists
			if(file_exists("./css/$default_template/pages/$page.css")) {
				echo '<link rel="stylesheet" href="' . $siteURL . '/css/' . $default_template . '/pages/' . $page . '.css"  type="text/css" />';
			}
		
			// Include header JS file if it exists
			if(file_exists("./js/pages/$page.js")) {
				echo '<script src="js/pages/' . $page . '.js" type="text/javascript"></script>';
			}
		?>
		
		<!--[if IE 6]>
		<link rel="stylesheet" href="<?= $siteURL ?>/css/<?=$default_template?>/ie6.css"  type="text/css" />
		<![endif]-->
		
		<!--[if IE 7]>
		<link rel="stylesheet" href="<?= $siteURL ?>/css/<?=$default_template?>/ie7.css"  type="text/css" />
		<![endif]-->
		
		<!--[if IE 8]>
		<link rel="stylesheet" href="<?= $siteURL ?>/css/<?=$default_template?>/ie8.css"  type="text/css" />
		<![endif]-->
		
	</head>
	<body <?php echo 'id="page-' . $page . '" class="section-' . $section . '"'; // Allows you to have per page/section styling if needed. ?>>
		<?= $yield ?>
	</body>
</html>