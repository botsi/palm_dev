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

$dataArray = json_decode($str_json, true);

$folder = $dataArray["folder"];
$one = "../images/" . $folder . "/" . $dataArray["one"] . ".jpg";


unlink($one);

$one = "../images/mobile/" . $folder . "/" . $dataArray["one"] . ".jpg";

unlink($one);

$one = "../images/webp/" . $folder . "/" . $dataArray["one"] . ".webp";

unlink($one);

    echo 'session is: ok';
}
?>
