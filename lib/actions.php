<?php

/*
 * FUNCIONES DE LO QUE UN USUARIO DESDE JS PUEDE HACER
 *
 ******************************************
 * ADVERTENCIAS: EXISTE UNA CONVENCION, EL
 * USUARIO SOLO PUEDE HACER USO DE ESTAS
 * FUNCIONES, EL LLAMADOR AGREGA EL PREFIJO
 * Y VIENEN LUEGO ACA. POR SEGURIDAD
 ******************************************
 *
 * TODAS LAS FUNCIONES RECIBEN $d (QUE ES EL DATA).
 *
 * SI EMPIEZAN CON NS_ Significa que pueden ser usado sin
 * necesidad de tener inicializada una session (NO SESSION)
 */

class PYRUS_ACTION{

    /**
     *
     */
    public static function createData($d) {
        $tables = R::inspect();
        $entidad = $d["entidad"];
        $ARR_attr = $d["objeto"];
        //response(200, 'ok', "TABLA '{$entidad}' creada");
        if(in_array($entidad, $tables)) response(200, 'ok', "TABLA '{$entidad}' existente en " . CONFIG_BD);
        else {
        $aux = R::xdispense($entidad);
        foreach ($ARR_attr as $attr => $tipo) {
            switch ($tipo) {
                case 'TP_PK':
                    $valor = NULL;
                    break;
                case 'TP_BOLEANO':
                    $valor = true;
                    break;
                case 'TP_FLOAT':
                    $valor = 0.0;
                    break;
                case 'TP_FECHA_LARGA':
                    $valor = date('Y-m-d H:i:s');
                    break;
                case 'TP_ENTERO':
                case 'TP_FECHA_CORTA':
                case 'TP_RELACION':
                case 'TP_MASCARA':
                case 'TP_ENUM':
                    $valor = 0;
                    break;
                default:
                    $valor = "";
                    break;
            }
            if($attr != "id")
            $aux->$attr = $valor;
            }
        //print_r($aux);die();
        R::store($aux);
        R::wipe($entidad);
        response(200, 'ok', $ARR_attr);
        }
    }

    /**
     * Dado una entidad, lista todos sus elementos
     *
     * @param array $d array de datos generico
     */
    public static function listar_generico($d) {
        $entidad = $d['entidad'];
        response(200,'ok ' . $entidad, PYRUS_DB::get_todos($entidad));
    }

	public static function baja_generica($d){
		$entidad = $d['entidad'];
		$id = $d['id'];
		response(200,'ok ' . $entidad,PYRUS_DB::remove_uno($entidad,$id));
	}

    public static function get_uno($d) {
        $entidad = $d['entidad'];
        $column = $d["column"];
        $value = $d["value"];
        response(200,'ok ' . $entidad, PYRUS_DB::get_uno($entidad,$column,$value));
    }

    public static function get_all($d) {
        $entidad = $d['entidad'];
        $column = $d["column"];
        $value = $d["value"];
        response(200,'ok ' . $entidad, PYRUS_DB::get_all($entidad,$column,$value));
    }

    public static function get_todos($d) {
        $entidad = $d['entidad'];
        response(200,'ok ' . $entidad, PYRUS_DB::get_all($entidad));
    }

    /**
     * Guarda genericamente un objeto dado, recibe por
     * parametros la entidad a guardar, y el objeto
     * que contiene la informacion a guardar. si 'id' == -1
     * se agrega un nuevo objeto (id dentro del objeto)
     * El objeto a guardar debe declarar cada key y debe
     * coincidir con el declarado en la bd y la verificacion
     *
     * @param array $d array de datos generico
     *
     * TODO: por seguridad, algunos id deberian no poder ser
     * accedidos por todos los usuarios, si no por quien lo creo
     */
    public static function guardar_uno_generico($d){
        $entidad = $d['entidad'];
        $objeto = $d['objeto'];
        $attr = $d['attr'];
        // var_dump($objeto); // como recibe un objeto json
        $ret = PYRUS_DB::set_one($entidad, $objeto, $attr);
        if($ret === PYRUS_ERROR){ //WTF! 1 == 99999 => TRUE???
            response(400,'ERROR: ' . $entidad,PYRUS_NOTIFICATIONS::get_errors());
        } else {
            response(200,'ok ' . $entidad, $ret);
        }
    }

    /**
     * Recibe usuario y password, y consulta si se puede loguear
     *
     * @param array $d array de datos generico
     */
    public static function NS_login($d){
        PYRUS_SESSION::set_sesion($d["dato"]);
        response(200,'ok usuario', ['login' => true,'s_id' => session_id(),$_SESSION]);
    }

    public static function NS_logout(){
        PYRUS_SESSION::kill_sesion();
        response(200,'ok usuario','ok');
    }

    /**
     * Obtiene la informacion del usuario en la sesion
     *
     * @param array $d No necesario
     */
    public static function obtener_sesion($d){
        if(isset($_SESSION['user_id']))
            response(200,'ok usuario',['estado' => 1,'session' => $_SESSION]);
        else{
            response(200,'no login, no autorizado',['estado' => 0,'s_id' => session_id()]);
        }
    }
    public static function sesion($d){
        response(200,'ok usuario',['estado' => 1,'session' => $_SESSION]);
    }

}
