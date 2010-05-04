<?
	
	// Show All Errors during development
	error_reporting(E_ALL);
	ini_set('display_errors', TRUE);
	ini_set('display_startup_errors', TRUE);

	function loadRoute($page, $routes, $routesLength) {
		/*
			This tiny bit of routing logic below is everything you need for clean urls to function, as many levels deep as you'd like to use.
			There is nothing that needs modification, basically it looks in the content folder for 2 things:
			
			1) A .php file with a name that matches ('./contents/example.php')
			2) A directory name that matches, with an index.php file inside ('./contents/example/index.php')
			
			If it can't find either of these, it simply routes to the generic 404 page.
		*/
		
		if(!$routes[0]) {
			// Default to homepage
			include("./content/home.php");	
			
		} else {			
			// All other pages
			$loadString = '';
			for ($i = 0; $i < $routesLength; $i++) {
				if($routes[$i]) {
					$loadString = $loadString . "/$routes[$i]";
				}
			}
			
			if(file_exists("./content" . $loadString . ".php")) {
				// Load PHP file for that page
				include("./content" . $loadString . ".php/");
				
			} else {
				// Load index file within a directory with that name
				if(file_exists("./content" . $loadString . "/index.php")) {
					include("./content" . $loadString . "/index.php/");	
					
				} else {
					// 404 Error page
					@include("./includes/404.php");
					
				}
					
			}
					
		}
		
	}
?>