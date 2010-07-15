<?php // Contact

// File Includes
//include("classes/error.php");
//include("classes/email.php");

// Variables
$err = array();
$fieldError = false;
$mail_success = false;
	
	// Check if the post happened
	if (isset($_POST['submit'])){
		
		// This renders our the errors on the page.
		echo "<script type=\"text/javascript\">\n";
		echo "$(document).ready(function(){\n";
			foreach( $_POST as $key => $value ){
					$err[$key] = new errorHandler($key, $value);
			}
		echo "});\n";	
		echo "</script>";
		// End Errors
		
		// For each post variable run a error check on it
		foreach( $_POST as $key => $value ){
			$proc = $err[$key]->shouldProcess($err[$key]->check, $key);
			if( $proc == "true"){
				$fieldError = true;
			}
		}
		
		// If there are no errors on the form then lets make an email.
		if($fieldError == false){
			$email = new emailGenerator();
			
			$body = "Name: ".$_POST['name_text']."\n";
			$body .= "Email: ".$_POST['email_email']."\n";
			$body .= "Website: ".$_POST['website_text']."\n";
			$body .= "Message: ".$_POST['message_text']."\n";
			$mailTo = "simpleengine@yourdomain.com";
			$subject = "Simple Engine Contact";
			$mailFrom = "contact@simpleengine.com";
			$em = $email->sendEmail($mailTo, $subject, $body, $mailFrom );
			if( $em == true ){
				$mail_success = true;
			}else{
				echo "Submission Failed contact the admin for help!";
			}
		}
	}
?>
<h2>Contact Form</h2>
<? if($mail_success){ // If the form was submited correctly and the email was sent we let the user know. ?>
<p class="emailConfirm">Thank you for contacting me. I will get back to you as soon as possible.</p>
<? }else{ ?>
<form method="post" action="/contact">
	<ol>
		<li><label>Name:</label>
			<input type="text" id="name_text" name="name_text" />
			<span class="contactError" id="name_textspan"></span>
			<br class="clearAll" />
		</li>
		<li>
			<label>Email:</label>
			<input type="text" id="email_email" name="email_email" />
			<span class="contactError" id="email_emailspan"></span>
			<br class="clearAll" />
		</li>
		<li>
			<label>Website:</label>
			<input type="text" id="website_text" name="website_text" />
			<span class="contactError" id="website_textspan"></span>
			<br class="clearAll" />
		</li>
		<li>
			<label>Message:</label>
			<textarea id="message_text" name="message_text"></textarea>
			<span class="contactError" id="message_textspan"></span>
			<br class="clearAll" />
		</li>
		<li>
			<input id="submitButton" name="submit" value="Send Message" type="submit" />
			<br class="clearAll" />
		</li>
	</ol>
</form>
<? } ?>