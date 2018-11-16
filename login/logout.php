<?php
session_start();
if(session_destroy()) // Destroying All Sessions
{
header("Location: ../editor.php"); // Redirecting To Home Page
}
?>