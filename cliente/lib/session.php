<?php

/*
 * MANEJADOR DE LA SESION DENTRO DEL SISTEMA
 */

class PYRUS_SESSION {

    /**
     * Inicializa la sesion
     *
     */
    public static function init(){
        session_start();
    }

    /**
     * Setea la sesion para un usuario, recibe un objeto bean
     * para poder extraer los datos de usuario
     *
     * @param array $b tipo bean de rb
     */
    public static function set_sesion($b){
        $_SESSION['user_osai_id'] = $b['id']; // asigno el id
        $_SESSION['user_osai_name'] = $b['user']; // asigno el nombre
        $_SESSION['user_osai_lvl'] = 0; // asigno el nivel
    }

    /**
     * Elimina toda la sesion, si el usuario se deslogeo o se
     * trigerea esta funcion, elimina todo el contenido de la
     * $_SESSION
     *
     */
    public static function kill_sesion(){
        foreach($_SESSION as $k => $v)
            unset($_SESSION[$k]);
    }

    /**
     * Verifica que la sesion todavia exista
     *
     */
    public static function verify_sesion(){
       return isset($_SESSION['user_id']);
    }

}
