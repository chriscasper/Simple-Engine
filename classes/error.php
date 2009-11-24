<?php
class errorHandler{
	
	public $check = array();
	public $areErrors = false;
	public $keyField;
	
	
	function __construct($key, $testVar ){
		$this->keyField = $key;
		$item = split("_", $key);	
		$fieldType = $item[1];
		
		
		switch($fieldType){
		case text:
			$this->checkText($key, $_POST[$key]);
			break;
		case email:
			$this->checkEmail($key, $_POST[$key]);
			break;
		case state:
			$this->checkState($key, $_POST[$key]);
			break;
		}
		
	}
		/*
		if($fieldType == "text"){
		
		
			$check[0] = array($key => $this->checkEmpty($_POST[$key]));
//this is where the problem is.				
				//echo "//" . var_dump($check) . "\n";
				if($check[0][$key] != NULL){
					$this->echoErr($check);
					$this->echoVal($_POST[$this->keyField]);
				}
		}
		if($fieldType == "email"){
			$check[0] = array($key => $this->checkEmail($_POST[$key]));
			//$size = $this->checkArrL($check);

			$check[1] = array($key => $this->checkEmpty($_POST[$key]));

				if($check[0][$key] != NULL || $check[1][$key] != NULL){				
					$this->echoErr($check);
					$this->echoVal($_POST[$this->keyField]);				
				}
			}
			
		} //end check for email
	*/	
	
	function echoVal( $fieldVal ){
	
	$fiedlVal = stripslashes($fieldVal);
	echo "var field".$this->keyField." = document.getElementById(\"".$this->keyField."\");\n";
	echo "field".$this->keyField.".value = \"".$fieldVal."\";\n";
	
	
	}
	function echoErr($arrToCheck){
		if( sizeof($arrToCheck) != 0 ){
			echo "var mySpan".$this->keyField." = document.getElementById(\"".$this->keyField."span\");\n";
			
			foreach($arrToCheck as $l => $s){
				foreach($s as $t => $f){
					if( $t == $this->keyField ){
						if( $str == ""){
							$str = $f;					
						}else{
							$str = $str."<br />".$f;
						}
					}
				}  
			echo "mySpan".$this->keyField.".innerHTML=\"".$str."\";\n";
			}
		}
	} //End function echoErr
	/* Function storeErr is used to store errors passed to the hadler
	   There is no limit to the number of errors that can be passed
	   to it on a single page. All Errors are stored in an array with
	   an unique key. Because errors are only passed in if the validation
	   of the field fails all errors are to be exported to the screen which
	   can be done with a for statement to step through the array.
	   
	*/
	function storeErr( $errDescrip ){
		
		$arrLength = sizeof($this->errors);	
		
		for( $i=0; $i<=$arrLength+1; $i++){

			if($this->errors[$i] == $errDescrip){
			
			}else{
				if($this->errors[$i] != ''){
					echo "error not empty";
					$i += 1;
			
				}else if( $this->errors[$i] == '' ){
				
				echo "error empty";
				$this->errors[$i] = $errDescrip;
				
				} //ends else if
			} //Ends Else
		} //Ends For	
	} // ends function sroreErr	
	/* Function checkEmail uses regular expressions to check email address contain an @ and a proper domain
	   which also must contain valid characters.
	*/
	function validateEmail( $email ){
		if (!ereg("^[^@]{1,64}@[^@]{1,255}$", $email)) {
		  return "<br />*Email Address is not valid!";
		}

		$email_array = explode("@", $email);
		$local_array = explode(".", $email_array[0]);
		
    	for ($i = 0; $i < sizeof($local_array); $i++) {
		  if (!ereg("^(([A-Za-z0-9!#$%&'*+/=?^_`{|}~-][A-Za-z0-9!#$%&'*+/=?^_`{|}~\.-]{0,63})|(\"[^(\\|\")]{0,62}\"))$", $local_array[$i])) {
		    return "<br />*Email address contains invalid characters";
		  }
	 	}
	 
   		if (!ereg("^\[?[0-9\.]+\]?$", $email_array[1])) { 
     	 $domain_array = explode(".", $email_array[1]);
		  
			if (sizeof($domain_array) < 2) {
				return "<br />*Domain name in email address not valid length";
			}
		  
			for ($i = 0; $i < sizeof($domain_array); $i++) {
				
				if (!ereg("^(([A-Za-z0-9][A-Za-z0-9-]{0,61}[A-Za-z0-9])|([A-Za-z0-9]+))$", $domain_array[$i])) {
				  return "*Domain name contains illegal characters";
				}
		  	}
		}
  	} // Ends function checkEmail()
  	function checkEmpty( $item ){
  		if($item == ""){
  			return "<br />* Item is empty";
  		}
  	} //Ends function checkEmpty()
  	function checkConnection(){
  		if ($_SERVER['HTTPS']){
  			return "connection secure";
  		}
  		if ($_SERVER['HTTP']){
  			return "normal http connection";
  		}
  	} //Ends function checkConnection
  	function shouldProcess(	$checkArr, $key ){
  		foreach($checkArr as $key=>$val){
  			foreach($val as $t => $f){
				if ($t == "error_index"){
					return $f;
				}
			}
		}		  	
  	}
  	function procError($processingError, $val, $key){
  		if( $processingError != "" ){
			$this->check[] = array($key => $processingError, 'error_index' => "true");
			$this->echoErr($this->check);
			$this->echoVal($val);
			
		}
	}
  	// Type of field checks
  	function checkText($field, $value ){
  	
		$error = $this->checkEmpty($value);
		$this->procError($error, $value, $field);
	
  	} //end function check text
  	function checkEmail($field, $value){
  	
  		$error = $this->checkEmpty($value);
  		$this->procError($error, $value, $field);
		$error = $this->validateEmail($value);
		$this->procError($error, $value, $field);

  	}
  	function checkState($field, $value){
  		if( $value == "none"){
  			$error = "Please select a state!";
  			$this->procError($error, $value, $field);	
		}
  	
  	}
  	
}
?>