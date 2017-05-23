<?php
$inx = $_POST["inx"];
$file = '../inhalt.js';
file_put_contents($file, $inx);
?>
