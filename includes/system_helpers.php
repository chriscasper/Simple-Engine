<?php
/*********************************

Simple Engine Core Helper functions

DO NOT MODIFY UNLESS YOU KNOW WHAT YOU'RE DOING

*********************************/



	function loadRoute( $page, $routes, $routesLength )
	{
		/*
			This tiny bit of routing logic below is everything you need for clean urls to function, as many levels deep as you'd like to use.
			There is nothing that needs modification, basically it looks in the content folder for 2 things:
			
			1) A .php file with a name that matches ('./contents/example.php')
			2) A directory name that matches, with an index.php file inside ('./contents/example/index.php')
			
			If it can't find either of these, it simply routes to the generic 404 page.
		*/

    // Start the output buffering - jt
    ob_start();

    $strReturn = '';

		if( !$routes[0] )
		{
			// Default to homepage
			include( './content/home.php' );
		}
		else
		{			
			// All other pages
			$loadString = '';

			for( $i=0; $i < $routesLength; $i++ )
			{
				if( $routes[$i] )
				{
					$loadString = $loadString . '/' . $routes[$i];
				}
			}
			
			if( file_exists( './content' . $loadString . '.php' ))
			{
				// Load PHP file for that page
				include( './content' . $loadString . '.php' );
			}
			else
			{
				// Load index file within a directory with that name
				if( file_exists( './content' . $loadString . '/index.php' ))
				{
					include( './content' . $loadString . '/index.php' );	
				}
				else
				{
					// 404 Error page
					@include( './includes/404.php' );
				}
			}	
		}

    $strReturn = ob_get_contents();

    ob_end_clean();

    // Load the content into the page
    addPageContent( $strReturn );
	}



  function initPageVars()
  {
    global $dir;
    global $routes;
    global $routesLength;
    global $section;
    global $page;

    // Retrieve our query string (sent from apache)
    if( isset( $_GET[ 'q' ] ))
    {
      $dir = $_GET[ 'q' ];
    }
    else
    {
    	$dir = '';
    }
    
    // Split our query string into variables
    $routes = explode( '/', $dir );
    $routesLength = count( $routes );
    $go = $routes[ $routesLength-1 ];
    if( $routesLength != '1' ) {
    	$go = $routes[ $routesLength-2 ];
    }
    
    // Set page default for homepage
    if( !$go && $routesLength == '1' )
    {
    	$section = "home";
    	$page = "home";
    }
    else
    {
    	$section = $routes[ 0 ];
    	$page = $go;
    }
  }





/*********************************************

Page Meta Info Getters/Setters

*********************************************/


  /*
   * Sets the page title
   *
   * @param $strTitle    String  A full page title. Pretty simple, really.
   */
  function setPageTitle( $strTitle )
  {
    global $page_title;

    $page_title = $strTitle;
  }

  /*
   * Gets the page title
   *
   */
  function getPageTitle()
  {
    global $page_title;

    return $page_title;
  }


  /*
   * Sets the page description
   *
   * @param $strDesc    String  A full page meta description.
   */
  function setPageDesc( $strDesc )
  {
    $GLOBALS[ 'page_desc' ] = $strDesc;
  }

  /*
   * Gets the page description
   *
   */
  function getPageDesc()
  {
    return $GLOBALS[ 'page_desc' ];
  }



  /*
   * Sets the page keywords
   *
   * @param $strKeywords    String  A comma-delimited list of keywords
   */
  function setPageKeywords( $strKeywords )
  {
    $GLOBALS[ 'page_keywords' ] = explode( ',', $strKeywords );
  }

  /*
   * Add keywords to the meta info
   *
   * @param $strKeywords    String  A comma-delimited list of keywords
   */
  function addPageKeywords( $strKeywords )
  {
    array_push( $GLOBALS[ 'page_keywords' ], explode( ',', $strKeywords ));
  }

  /*
   * Gets the page keywords
   *
   */
  function getPageKeywords()
  {
    // Strip duplicates and return
    return implode( ',', array_map( 'trim', array_unique( $GLOBALS[ 'page_keywords' ] )));
  }




  /*
   * Adds content to the page content var
   *
   * @param $strContent    String  Content to display
   */
  function addPageContent( $strContent )
  {
    if( !array_key_exists( 'page_content', $GLOBALS ))
    {
      $GLOBALS[ 'page_content' ] = '';
    }

    $GLOBALS[ 'page_content' ] .= $strContent;
  }

  /*
   * Gets the page content
   *
   */
  function getPageContent()
  {
    if( !array_key_exists( 'page_content', $GLOBALS ))
    {
      $GLOBALS[ 'page_content' ] = '';
    }

    return $GLOBALS[ 'page_content' ];
  }



  /*
   * Prepares the site's CSS vars
   *
   * @param $strFile    String  Path to your CSS file
   */
  function initPageCSS()
  {
    if( !array_key_exists( 'page_css', $GLOBALS ))
    {
      $GLOBALS[ 'page_css' ] = array();
    }

    if( file_exists( './static/css/' . $GLOBALS[ 'section' ] . '/' . $GLOBALS[ 'page' ] . '.css' ))
    {
      array_push( $GLOBALS[ 'page_css' ], '/static/css/' . $GLOBALS[ 'section' ] . '/' . $GLOBALS[ 'page' ] . '.css' );
    }
  }

  /*
   * Adds to the page's CSS files
   *
   * @param $strFile    String  Path to your CSS file
   */
  function addPageCSS( $strFile )
  {
    if( !array_key_exists( 'page_css', $GLOBALS ))
    {
      $GLOBALS[ 'page_css' ] = array();
    }

    array_push( $GLOBALS[ 'page_css' ], $strFile );
  }

  /*
   * Gets the page's CSS files
   *
   */
  function getPageCSS()
  {
    // Strip duplicates and return
    return array_unique( $GLOBALS[ 'page_css' ] );
  }



  /*
   * Prepares the site's JS vars
   *
   * @param $strFile    String  Path to your JS file
   */
  function initPageJS()
  {
    if( !array_key_exists( 'page_js', $GLOBALS ))
    {
      $GLOBALS[ 'page_js' ] = array();
    } 

    if( file_exists( './static/js/' . $GLOBALS[ 'section' ] . '/' . $GLOBALS[ 'page' ] . '.css' ))
    {
      array_push( $GLOBALS[ 'page_js' ], '/static/js/' . $GLOBALS[ 'section' ] . '/' . $GLOBALS[ 'page' ] . '.css' );
    }
  }

  /*
   * Adds to the page's javascript files
   *
   * @param $strFile    String  Path to your JS file
   */
  function addPageJS( $strFile )
  {
    if( !array_key_exists( 'page_js', $GLOBALS ))
    {
      $GLOBALS[ 'page_js' ] = array();
    }

    array_push( $GLOBALS[ 'page_js' ], $strFile );
  }

  /*
   * Gets the page's JS files
   *
   */
  function getPageJS()
  {
    // Strip duplicates and return
    return array_unique( $GLOBALS[ 'page_js' ] );
  }


  /*
   * Sets the page layout
   *
   * @param $strLayout    String  The name of a SE page layout
   */
  function setPageLayout( $strLayout )
  {
    $GLOBALS[ 'page_layout' ] = $strLayout;
  }

  /*
   * Gets the page description
   *
   */
  function getPageLayout()
  {
    return $GLOBALS[ 'page_layout' ];
  }




