<?php

/*
 * RECOLECCION DE ERRORES RECONOCIDOS
 */

Class PYRUS_NOTIFICATIONS{
    private static $errores =   [];
    private static $warnings =  [];
    /**
     * Mensaje de error simple a ser agregado al registro
     * de errores del sistema, todos retornan false para
     * que se pueda hacer return en el nivel superior y
     * poder terminar la ejecucion con false
     *
     * @param string $msg Mensaje a ser agregado
     * @return boolean Siempre false al ser llamado
     */
    static function error($msg){
        PYRUS_NOTIFICATIONS::$errores[] = $msg;
        return PYRUS_ERROR;
    }

    /**
     * Mensaje de advertencia simple a ser agregado al
     * registro del sistema, no retonan nada para no
     * interrumpir el flujo del programa.
     *
     * @param type $msg Mensaje a ser agregado
     */
    static function warning($msg){
        PYRUS_NOTIFICATIONS::$warnings[] = $msg;
    }

    static function get_errors(){
        return PYRUS_NOTIFICATIONS::$errores;
    }

    static function get_warnings(){
        return PYRUS_NOTIFICATIONS::$warnings;
    }
}
