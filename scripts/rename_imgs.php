<?php
$dataArray = json_decode(file_get_contents('php://input'), true);

$folder = $dataArray["folder"];
$one = "../images/" . $folder . "/" . $dataArray["one"] . ".jpg";
$two = "../images/" . $folder . "/" . $dataArray["two"] . ".jpg";
$store_one = "../images/" . $folder . "/xx" . $dataArray["one"] . ".jpg";


rename($one, $store_one);
rename($two, $one);
rename($store_one, $two);

$one = "../images/mobile/" . $folder . "/" . $dataArray["one"] . ".jpg";
$two = "../images/mobile/" . $folder . "/" . $dataArray["two"] . ".jpg";
$store_one = "../images/mobile/" . $folder . "/xx" . $dataArray["one"] . ".jpg";

rename($one, $store_one);
rename($two, $one);
rename($store_one, $two);

$one = "../images/webp/" . $folder . "/" . $dataArray["one"] . ".webp";
$two = "../images/webp/" . $folder . "/" . $dataArray["two"] . ".webp";
$store_one = "../images/webp/" . $folder . "/xx" . $dataArray["one"] . ".webp";

rename($one, $store_one);
rename($two, $one);
rename($store_one, $two);

?>
