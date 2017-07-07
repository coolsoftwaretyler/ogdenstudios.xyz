<?php
ob_start();
// $email and $message are the data that is being
// posted to this page from our html contact form
$name = $_REQUEST['name'] ;
$email = $_REQUEST['email'] ;
$message = $_REQUEST['message'] ;

// When we unzipped PHPMailer, it unzipped to
// public_html/PHPMailer_5.2.0
require("/home/dh_yain7t/ogdenstudios.xyz/PHPMailer-master/PHPMailerAutoload.php");

$mail = new PHPMailer();

// set mailer to use SMTP
$mail->IsSMTP();

// As this email.php script lives on the same server as our email server
// we are setting the HOST to localhost
$mail->Host = "sub5.mail.dreamhost.com"; // specify main and backup server

$mail->SMTPAuth = true; // turn on SMTP authentication

// When sending email using PHPMailer, you need to send from a valid email address
// In this case, we setup a test email account with the following credentials:
// email: send_from_PHPMailer@jeffm.webhostinghubexample.com
// pass: password
$mail->Username = "tyler@ogdenstudios.xyz"; // SMTP username
$mail->Password = "cFX-!JEC"; // SMTP password

// $email is the user's email address the specified
// on our contact us page. We set this variable at
// the top of this page with:
// $email = $_REQUEST['email'] ;
$mail->From = "tyler@ogdenstudios.xyz";

// below we want to set the email address we will be sending our email to.
$mail->AddAddress("tyler@ogdenstudios.xyz", "Tyler Williams");

// set word wrap to 50 characters
$mail->WordWrap = 50;
// set email format to HTML
$mail->IsHTML(true);

$mail->Subject = "New message from Ogden Studios";

// $message is the user's message they typed in
// on our contact us page. We set this variable at
// the top of this page with:
// $message = $_REQUEST['message'] ;
$mail->Body = '<html><body><p>Here is the message:</p>'.$message.'
            <p>E-mail:<p>'.$email.'      
            </body></html>';
$mail->AltBody = $message;

if(!$mail->Send())
{
echo "<script>alert('Something went wrong, please try again or email us directly at tyler@ogdenstudios.xyz');</script>";
echo "Mailer Error: " . $mail->ErrorInfo;
exit;
}
echo "<script>alert('Your message has been sent!');window.location.href='index.html#contact';</script>";
?>