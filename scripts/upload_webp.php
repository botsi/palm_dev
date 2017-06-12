<?php
$dataArray = json_decode(file_get_contents('php://input'), true);

$imageString = $dataArray["base"];

$file = "../images/" . $dataArray["folder"] . "/" . $dataArray["name"];

$data = 'data:image/webp;base64,' . $dataArray["base"];

list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);

$data = base64_decode($data);

file_put_contents($file, $data);

echo 'i did botsicode';

exit;
?>
