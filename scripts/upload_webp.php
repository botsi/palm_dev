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

$imageString = $dataArray["base"];

$file = "../images/" . $dataArray["folder"] . "/" . $dataArray["name"];

$data = 'data:image/webp;base64,' . $dataArray["base"];

list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);

$data = base64_decode($data);

file_put_contents($file, $data);

echo 'i did botsicode';

    echo 'session is: ok';

exit;
}

?>
