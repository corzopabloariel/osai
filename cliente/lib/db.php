<?php
class PYRUS_DB {
	static $mysqli = null;
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
			self::$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
			self::$mysqli->set_charset('utf8');
  }

  /**
   * Trae todos los elementos de una entidad
   *
   * @param string $e nombre de la entidad dispense
   */
  static function get_registros($e){
      return R::count($e,"elim = 0");
  }

  /**
   * Trae un elemento de una entidad dada
   *
   * @param string $e entidad
   * @param string $column column
   * @param ? $value value
   */
  static function get_value($e, $column, $value, $return) {
		if($return == 1) return R::findOne($e,"{$column} = ? AND elim = ? ORDER BY id DESC", [$value,0]);
		else return R::findAll($e,"{$column} = ? AND elim = ? ORDER BY id DESC", [$value,0]);
  }
	static function get_value_paginado($e, $values, $paginado) {
		$start = $paginado * 10;
		$length = 10;
		$sql = "";
		$Arr = [];
		foreach($values AS $k => $v) {
			if(!empty($sql)) $sql .= " AND ";
			$sql .= "{$k} = ?";
			$Arr[] = $v;
		}
		return R::findAll($e,"{$sql} AND elim = 0 ORDER BY id DESC LIMIT {$start},{$length}",$Arr);
	}
  /**
   * Trae la cantidad de elementos que con un cierto patron
   * @param string $e entidad
   * @param Array $buscar buscar
   */
  static function unique($e,$buscar) {
    $column = "";
		$edit = 0;
    $Arr_value = [];
    foreach($buscar AS $k => $v) {
			if($k == "id") {
				if($v != "nulo") $edit = 1;
				continue;
			}
      if(!empty($column)) $column .= " AND ";
      $column .= "{$k} = ?";
      $Arr_value[] = $v;
    }
    $column .= " AND elim = ?";
    $Arr_value[] = 0;
    return R::count($e,"{$column}", $Arr_value);
  }
	/**
	 * Baja logica
	 *
	 */
	static function remove_uno($e,$id){
		$b = R::findOne($e,'id LIKE ?',[$id]);
		$b['elim'] = 1;
		R::store($b);
	}
	/**
	 *
	 */
	static function resultados($e) {
		$sql = "SELECT * FROM {$e} WHERE elim = 0";
		$Arr = Array();
		if($queryRecords = self::$mysqli->query($sql)) {
		  while($data = $queryRecords->fetch_assoc())
				$Arr[$data["id"]] = $data;
		}
		return $Arr;
	}
	/**
	 *
	 */
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
