<?php
  header( 'Cache-Control: no-cache, must-revalidate' );
  header( 'Expires: ' . date( 'D, d M Y H:i:s T' ));
  header( 'Content-type: application/javascript' );
?>
<?php echo(getPageContent()); ?>