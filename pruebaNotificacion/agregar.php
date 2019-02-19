<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: GET, POST');

header("Access-Control-Allow-Headers: X-Requested-With");


require_once 'rb.php';
R::setup('mysql:host=localhost;dbname=simat_86145','root','contrasela%32');

if(isset($_GET['msg'])){

	$p = R::dispense("notificacion");
	$p['mensaje'] = $_GET['msg'];
	$p['leido'] = 0;
	R::store($p);
}
 
