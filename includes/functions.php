<?
/*********************************

User defined functions

**********************************/


  /*
   * Returns a fully qualified HTML formatted snippet for a breadcrumb based on
   *  the input
   *
   * @param $strPath    String  A full path, minus domain, for the current page
   * @param $strSep     String  A character or series of characters to use as a separator for the URLs
   */
  function breadcrumb( $strPath, $strSep='' )
  {
    // Start off the return string
    $strReturn = '<a href="/" class="bc-home"><span class="bc-home">Home</span></a>';

    // Strip any starting slash
    if( substr( $strPath, 0, 1 ) == '/' )
    {
      // Found a slash, remove it
      $strPath = substr( $strPath, 1, strlen( $strPath ));
    }

    $arrPath = explode( '/', $strPath );


    // Run through the array and create our links
    foreach( $arrPath as $i => $strPathBit )
    {
      if( $i+1 == count( $arrPath ))
      {
        // We're on the last iteration, so skip the link
        $strReturn .= $strSep . '<span class="bc bc-current">' . ucwords( str_replace( '-', ' ', $strPathBit )) . '</span>';
      }
      else
      {
        $strLinkUrl = '';

        // Build the link to the appropriate section
        for( $i2=0; $i2<=$i; $i2++ )
        {
          $strLinkUrl .= '/' . $arrPath[ $i2 ];
        }

        $strReturn .= $strSep . '<a href="' . $strLinkUrl . '" class="bc"><span class="bc">' . ucwords( str_replace( '-', ' ', $strPathBit )) . '</span></a>';          

      }
    }

    return $strReturn;
  }