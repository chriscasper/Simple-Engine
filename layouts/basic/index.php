<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
  <title><?php echo(getPageTitle()); ?></title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="description" content="<?php echo(getPageDesc()); ?>" />
  <meta name="keywords" content="<?php echo(getPageKeywords()); ?>" />

  <!--	<link href="/static/images/favicon.png" rel="shortcut icon" type="image/x-icon" />-->
  <link rel="stylesheet" media="all" type="text/css" href="/static/css/reset.css" />
  <link rel="stylesheet" media="all" type="text/css" href="/static/css/layouts/basic/default.css" />

  <?php
    $arrCSS = getPageCSS();

    foreach( $arrCSS as $strCSS )
    {
      echo '  <link rel="stylesheet" media="all" type="text/css" href="' . $strCSS . '" />';
    }
  ?>

  <!--[if IE]>
  <link rel="stylesheet" media="all" type="text/css" href="/static/css/layouts/basic/ie.css" />
  <![endif] -->

</head>
<body>

<?php echo(getPageContent()); ?>

<?php
    $arrJS = getPageJS();

    foreach( $arrJS as $strJS )
    {
      echo '  <script src="' . $strJS . '" type="text/javascript"></script>';
    }
  ?>
</body>
</html>
