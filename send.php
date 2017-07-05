<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $from = 'From: Ogden Studios'; 
    $to = 'tyler@ogdenstudios.xyz'; 
    $subject = 'New message from Ogden Studios';
	$human = $_POST['human'];
	
	$body = "From: $name\n E-Mail: $email\n Message:\n $message";

if ($_POST['submit']) {
    if ($name != '' && $email != '') {
        if ($human == '4') {				 
            if (mail ($to, $subject, $body, $from)) { 
	        echo "<script>alert('Your message has been sent!');</script>";
	    } else { 
	        echo "<script>alert('Something went wrong, please try again or email us directly at tyler@ogdenstudios.xyz');</script>";
	    } 
	} else if ($_POST['submit'] && $human != '4') {
	    echo "<script>alert('You answered the anti-spam question incorrectly!');</script>";
	}
    } else {
        echo "<script>alert('You need to fill in all required fields!');</script>";
    }
}

header('Location: index.html');
?>