<?php
$dataArray = json_decode(file_get_contents('php://input'), true);

$folder = $dataArray["folder"];
$one = "../images/" . $folder . "/" . $dataArray["one"] . ".jpg";


unlink($one);

$one = "../images/mobile/" . $folder . "/" . $dataArray["one"] . ".jpg";

unlink($one);

$one = "../images/webp/" . $folder . "/" . $dataArray["one"] . ".webp";

unlink($one);

?>
