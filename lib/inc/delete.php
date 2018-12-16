<?php
//-------------------------
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');

$sql = "DELETE FROM {$_POST["tabla"]} WHERE user = {$_POST["user_id"]}";
$mysqli->query($sql);
?>
