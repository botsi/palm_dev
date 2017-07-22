<?php
SESSION_START();
$str_json = file_get_contents('php://input');
function isJSON($string){
   return is_string($string) && is_array(json_decode($string, true)) && (json_last_error() == JSON_ERROR_NONE) ? true : false;
}
if (!$_SESSION["login"] == 1 || !isJSON($str_json)){
    echo 'session is dead: '.$_SESSION["login"];
    exit; 
}else{
    $file = '../inhalt.js';
    file_put_contents($file, $str_json);
    echo 'ok botsi palm_dev palm_prod aa8b4a11e58412293f4e47d005a73db4cf65cc68 inhalt.js';
}
?>
