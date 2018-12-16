<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$c = new MongoClient();
/*
function response($status,$status_message,$data){
    header("HTTP/1.1 ".$status);
    $response['status']=$status;
    $response['status_message']=$status_message;
    $response['data']=$data;
    $json_response = json_encode($response);
    echo $json_response;
}

if(!isset($_GET['medio']))
    exit();
$medio = $_GET['medio'];

$c = new MongoClient();

if(isset($_GET['getgrafo'])){
	$t = $c->$medio->instancia->find([]);
	$t = iterator_to_array($t);
	if(isset(reset($t)['enejecucion'])){
		echo "ejecutando,espere...";
		sleep(3);
		header('Location: '.$_SERVER['REQUEST_URI']);
		exit();
	}

	$test = $c->$medio->nodos->find([])->fields(['_id' => true, 'url' => true, 'padre' => true]);

	// convierto a array
	$test_ = [];
	foreach($test as $t){
		$test_[] = $t;
	}

	$test = $test_;

	$nodos = [];
	$puentes = [];

	$pos = 0;
	foreach ($test as $t) {
		$nodos[] = [
			'id' => $pos,
			'_id' => $t['_id'],
			// 'url' => $t['url']
			//'titulo' => $t['data']['titulo']
		];
		if (array_key_exists('autor', $t['data']))
			$nodos[count($nodos) - 1]['autor'] = $t['data']['autor'];
		foreach($t['padre'] as $h){
			$pos_padre = array_search($h, array_column($test, 'url'));
			$puentes[] = ['padre' => $pos_padre, 'hijo' => $pos];
		}
		$pos += 1;
	}
	response(200,'ok',['nodos' => $nodos,'puentes' => $puentes]);
}elseif(isset($_GET['getnodo'])){
	// , 'data.titulo' => true, 'data.autor' => true
	$ret = $c->$medio->nodos->findOne(['_id' => new MongoId($_GET['getnodo'])]);
	if($ret != NULL)
		response(200,'ok',['nodo' => $ret,'exito' => true]);
	else
		response(200,'no',['exito' => false]);
}

?>
