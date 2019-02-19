<?php 
/*
header("Content-Type: text/event-stream\n\n");
// generador de eventos lado servidor

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'rb.php';
R::setup('mysql:host=localhost;dbname=simat_86145','root','contrasela%32');



while (1) {
  // Every second, sent a "ping" event.
  
  $l = R::findAll("notificacion","leido LIKE ?",[0]);

  foreach($l as $v){
    echo $v['mensaje'];
    echo "\n\n";
    $v['leido'] = 1;
    R::store($v);
  }
  
  
  ob_flush();
  flush();
  sleep(2);
}
*/

date_default_timezone_set("America/New_York");
header("Content-Type: text/event-stream\n\n");
require_once 'rb.php';
R::setup('mysql:host=localhost;dbname=simat_86145','root','contrasela%32');
$counter = rand(1, 10);
$l = [];
while (1) {
  // Every second, sent a "ping" event.
  
  //echo "event: ping\n";
  $curDate = date(DATE_ISO8601);
  /* echo 'data: {"time": "' . $curDate . '"}';
  echo "\n\n";
  
  // Send a simple message at random intervals.
  
  $counter--;
  
  if (!$counter) {*/
	
	foreach($l as $v){
		$v['leido'] = 1;
		R::store($v);
	}
	
    $l = R::findAll("notificacion","leido LIKE ?",[0]);
	$str = "";
	foreach($l as $v){
		$str .= $v['mensaje'];
		//$v['leido'] = 1;
		//R::store($v);
	}
	if($str != "") echo 'data: ' . $str . "\n\n";
	//echo 'data: ProngaThis is a message at time ' . $curDate . "\n\n";

    //$counter = rand(1, 10);
  //}
  
  ob_flush();
  flush();
  sleep(2); 
}
