<?
/* Page Setup */

/* This is a json sample page. Its pretty straight forward, just build your php object
    before dumping it with json_encode and setting the layout to json
*/

setPageLayout( 'json' );



// Sample japanese automakers multidimensional array
$arrCars = array(
  'honda' => array(
    'accord',
    'civic',
    'crv'
  ),
  'nissan' => array(
    'altima',
    'sentra',
    'murano'
  ),
  'toyota' => array(
    'camry',
    'celica',
    'venza'
  )
);

echo json_encode( $arrCars );