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
    echo 'ok botsi palm_dev master c094a8cdaf16c004f883281be1959e8ce9f4d39c inhalt.js';
}
?>
