<?php
//include_once('config.php');
//include_once('rb.php');
class PYRUS_DB {
	static function init() {
		PYRUS_DB::conectar();
	}

  /**
   * Crea la coneccion a la base de datos
   *
   * @return toolbox Retorna lo que mande RedBean
   */
  static function conectar(){
      R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
  }

  /**
   * Trae todos los elementos de una entidad
   *
   * @param string $e nombre de la entidad dispense
   */
  static function get_todos($e,$ord = "ASC"){
      return R::findAll($e,"elim LIKE ? ORDER BY id {$ord}",[0]);
  }

    /**
     * Trae un elemento de una entidad dada por un id
     *
     * @param string $e entidad
     * @param integer $id id
     */
    static function get_uno($e,$column,$value) {
        return R::findOne($e,"{$column} LIKE ?", [$value]);
    }

    static function get_all($e,$column,$value) {
        if(empty($column))
            return R::findAll($e);
        else 
            return R::findAll($e,"{$column} LIKE ?", [$value]);
    }

	/**
	 * Baja logica
	 *
	 */
	static function remove_uno($e,$id){
		$b = R::findOne($e,'id LIKE ?',[$id]);
		$b['activo'] = 0;
		R::store($b);
	}

  static function set_one($e,$obj,$attr){
      // return $obj;
      //$attr = $obj['attr'];
      if($obj['id'] == 'nulo'){
          $bean = R::xdispense($e);
          unset($obj['id']); // lo elimino para que no lo parsee
          unset($attr['id']); // igual que antes
      }
      else $bean = R::findOne($e,'id LIKE ?',[$obj['id']]);
          // Deberia recorrer el objeto y conciliarlo con el
          // PYRUS ENTIDADES, ninguno deberia quedar afuera
          // Vamos a suponer que siempre se envio correctamente
          // la entidad, obtengo la key y la saco de obj
	        // var_dump($obj);
      foreach($attr as $k => $v){
          // TODO: Revisar atributos enviados, ej; si se envia modificar
          // un constante de un elemento cuyo id existe, entonces NO DEBO
          // GUARDARLO, y asi con cada elemento

          if(isset($obj[$k])){
        		// si viene una imagen, la guardo y guardo la url dentro del valor
        		$valor = $obj[$k];
            $bean[$k] = $valor;
    			}
          // termino con toda la ejecucion si hay error
          //else
              //return PYRUS_NOTIFICATIONS::error('el atributo ' . $k . ' no existe '
                  //. 'en la declaracion de entidad o no se ha enviado');
      }
    	// agrego que esta activo
      // lo guardo
      return R::store($bean);
      //return true;
  }
}
