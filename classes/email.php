<?php 

class emailGenerator{
  
  
  function sendEmail($mailTo, $subject, $body, $mailFrom){
   if( mail($mailTo, $subject, $body, "From: $mailFrom")){
      return true;
    }else{
      return false;
    }
  }
  
  function makeEmail(){
   $this->body = "";
    //$Body .= $fName . " " . $lName. "\n" .$address. "\n" .$city. ", " .$state. " " .$zip. "\n" .$phoneNumber. "\n" .$hearAbout. "\n" .$comments;
    
  }
  
  }
?>
