<?php

/*
 * CAJA DE HERRAMIENTAS DE PHP
 */

/******************************************
 * EXTENSIONES DE REDBEANS
 ******************************************/

/**
 * Extension de prueba
 * @test
 */
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });

/******************************************
 * FUNCTIONES DEL SISTEMA
 ******************************************/

/**
 * Envia una respuesta al cliente formateado de manera correcta.
 * Responde con un JSON con el contenido, y con un codigo HTTP de
 * respuesta indicando exito o un caso particular especificado
 * Codigo de respuestas rapidos:
 *      200 OK
 *      400 ERROR GENERICO
 *
 * @param int $status numero que representa la respuesta http
 * @param string $status_message mensaje de respuesta
 * @param array $data array con los datos de requeridos
 */
function response($status, $status_message, $data){
    header("HTTP/1.1 ".$status);
    $response['status'] = $status;
    $response['status_message'] = $status_message;
    $response['data'] = $data;
    echo json_encode($response);
}

/**
 * Funcion de entrada, Se le envia POST directamente para que
 * la administre. Si una funcion arranca con "NS_" quiere
 * decir que no necesita pasar por el control de la session
 * si no lo tiene, si o si el usuario debe estar logueado
 * para usarlo
 *
 * @param array $p POST
 */
function query($p){
    if(isset($p['accion']) and isset($p['data'])){
        $accion =   $p['accion'];
        $data =     $p['data'];
        if(method_exists('PYRUS_ACTION', $accion)) // existe metodo
            PYRUS_ACTION::{$accion}($data);
        else // no existe
            response(400,'no metodo',['mensaje' => 'no existe la accion ' . $accion]);
    } else {
        response(400, 'no parametro', ['mensaje' => 'no se recibio un parametro accion o data']);
    }
}
