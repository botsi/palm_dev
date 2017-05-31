<?php
/*
echo 'ok, i try';
*/
$str_json = file_get_contents('php://input');
$file = '../inhalt2.js';
file_put_contents($file, $str_json);
?>
