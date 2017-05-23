<?php

if (isset($_POST["form_email"]) and $_POST["form_email"] != ''){
	$email = $_POST["form_email"];


if (isset($_POST["form_firma"]) and $_POST["form_firma"] != ''){
$firma = $firma . '<br/>';
}else{
$firma = '';
}
$vorname = $_POST["form_vorname"] . ' ';
$name = $_POST["form_name"];
if (isset($_POST["form_anrede"]) and $_POST["form_anrede"] != ''){
	$anrede = $_POST["form_anrede"] . ' ';
}else{
$anrede = $vorname;
}
$strasse = $_POST["form_strasse"] . ' ';
$nr = $_POST["form_nr"] . '<br/>';
if (isset($_POST["form_zusatzzeile"]) and $_POST["form_zusatzzeile"] != ''){
$zusatzzeile = $_POST["form_zusatzzeile"] . '<br/>';
}else{
$zusatzzeile = '';
}
$plz = $_POST["form_plz"] . ' ';
$ort = $_POST["form_ort"] . '<br/>';
$land = $_POST["form_land"] . '<br/>';
if (isset($_POST["form_telefon"]) and $_POST["form_telefon"] != ''){
	$telefon = '<br/>' . $_POST["form_telefon"] . '<br/><br/>';
}else{
$telefon = '<br/>';
}

$text = $_POST["order_text"];

$sum = $_POST["order_sum"];








$answer_txt = 'Vielen Dank ' . $anrede . $name . '<br/>' . ' Ihre Bestellung wurde bei uns registriert.' . '<br/><br/><br/><br/>';

$answer_txt .= $text . '<br/><br/><br/><br/>';

$answer_txt .= $sum;


$palma_mail = 'info@palma3.ch';



//----------------------------------- mail an palma

$subject = 'Bestellung '. $anrede . $name;

$answer_and_adress = $answer_txt . $firma . $anrede . $name . '<br/>' . $strasse . $nr . $zusatzzeile . $plz . $ort . $land . $telefon . $email;

$headers   = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=UTF-8";
$headers[] = "From: ".$email;
$headers[] = "Bcc: ";
$headers[] = "Reply-To: ".$email;
$headers[] = "X-Mailer: PHP/".phpversion();

mail($palma_mail, $subject, $answer_and_adress, implode("\r\n", $headers));

//-----------------------------------


//----------------------------------- mail an kunde

$subject = 'Bestellung Palma3';

$headers   = array();
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=UTF-8";
$headers[] = "From: ".$palma_mail;
$headers[] = "Bcc: ";
$headers[] = "Reply-To: ".$palma_mail;
$headers[] = "X-Mailer: PHP/".phpversion();

mail($email, $subject, $answer_txt, implode("\r\n", $headers));

//-----------------------------------



//----------------------------------- nachricht an kunde

//$nachricht = '<html><head><title>Bestellung Palma3</title></head><body>'.$answer_txt.'</body></html>';

echo 'ok, mail sent';



}else{

echo 'error: no e-mail' . $_POST["form_email"];

}

?>
