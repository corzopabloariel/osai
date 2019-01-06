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
	static function get_value_paginado($valores) {
    $entidad = $valores["entidad"];
    $values = $valores["values"];
    $paginado = $valores["paginado"];

		$start = $paginado * 10;
    $length = 10;
    $sql = "";
    if($entidad == "osai_cliente") {
      $titulo = $id = $whereNoticia = $where = "";
      if(isset($values["titulo"])) {
        $titulo = $values["titulo"];
        unset($values["titulo"]);
      }
      if(isset($values["id"])) {
        $id = $values["id"];
        unset($values["id"]);
      }
      if(!empty($titulo)) $whereNoticia .= "AND noticia.titulo LIKE '%{$titulo}%'";
      if(!empty($id)) $where .= "{$entidad}.id_usuario_osai = {$id}";
      foreach($values AS $k => $v) {
        if(empty($v)) continue;
        if(!empty($where)) $where .= " AND ";
        $where .= "{$entidad}.{$k} = {$v}";
      }
      // echo "SELECT {$entidad}.* FROM {$entidad} INNER JOIN noticia ON (noticia.id = {$entidad}.id_noticia AND noticia.elim = 0 {$whereNoticia}) WHERE {$where} AND {$entidad}.elim = 0 ORDER BY {$entidad}.id DESC LIMIT {$start},{$length}";
      return R::getAll("SELECT {$entidad}.* FROM {$entidad} INNER JOIN noticia ON (noticia.id = {$entidad}.id_noticia AND noticia.elim = 0 {$whereNoticia}) WHERE {$where} AND {$entidad}.elim = 0 ORDER BY id DESC LIMIT {$start},{$length}");
    } if($entidad == "osai_notificacion" && isset($values["medios"])) {
      $id = $values["id_usuario_osai"];
      $whereNoticia = "";
      $where = "{$entidad}.id_usuario_osai = {$id}";
      if(isset($values["medios"])) {
        $values["medios"] = json_decode($values["medios"]);
        $idMedios = "";
        foreach($values["medios"] AS $x) {
          if(!empty($idMedios)) $idMedios .= ",";
          $idMedios .= "{$x}";
        }
        if(!empty($idMedios)) {
          $whereNoticia .= " AND ";
          $whereNoticia .= "noticia.id_medio IN ({$idMedios})";
        }
      }
      if(isset($values["desde"]) && !empty($values["desde"])) {
        $where .= " AND ";
        $where .= "DATE_FORMAT({$entidad}.autofecha, '%Y%m%d') >= DATE_FORMAT('{$values["desde"]}', '%Y%m%d')";
      }
      if(isset($values["hasta"]) && !empty($values["hasta"])) {
        $where .= " AND ";
        $where .= "DATE_FORMAT({$entidad}.autofecha, '%Y%m%d') <= DATE_FORMAT('{$values["hasta"]}', '%Y%m%d')";
      }
      if(isset($values["nivel"]) && $values["nivel"] != "" && $values["nivel"] >= 0) {
        $where .= " AND ";
        $where .= "{$entidad}.nivel = {$values["nivel"]}";
      }
      if($values["cantidad"] != 0) {
        $where .= " AND ";
        $where .= "{$entidad}.leido = 0";
      }
      // echo "SELECT {$entidad}.* FROM {$entidad} INNER JOIN noticia ON (noticia.id = {$entidad}.id_noticia AND noticia.elim = 0 {$whereNoticia}) WHERE {$where} AND {$entidad}.elim = 0 ORDER BY {$entidad}.id DESC LIMIT {$start},{$length}";
      return R::getAll("SELECT {$entidad}.* FROM {$entidad} INNER JOIN noticia ON (noticia.id = {$entidad}.id_noticia AND noticia.elim = 0 {$whereNoticia}) WHERE {$where} AND {$entidad}.elim = 0 ORDER BY {$entidad}.id DESC LIMIT {$start},{$length}");
    } else {
      $Arr = [];
      foreach($values AS $k => $v) {
        if(empty($v)) continue;
        if(!empty($sql)) $sql .= " AND ";
        $sql .= "{$k} = ?";
        $Arr[] = $v;
      }
      return R::findAll($entidad,"{$sql} AND elim = 0 ORDER BY id DESC LIMIT {$start},{$length}",$Arr);
    }
  }
  /**
   * 
   */
  static function get_agenda($valores) {
    $paginado = $valores["paginado"];
    $start = $paginado * 10;
    $length = 10;
    $id = $valores["id"];
    $where = "p.id_cliente = {$id}";
    if(isset($valores["medios"])) {
      $idMedios = "";
      foreach($valores["medios"] AS $x) {
        if(!empty($idMedios)) $idMedios .= ",";
        $idMedios .= "{$x}";
      }
      $where .= " AND ";
      $where .= "n.id_medio IN ({$idMedios})";
    }
    if(isset($valores["secciones"])) {
      $idSecciones = "";
      foreach($valores["secciones"] AS $x) {
        if(!empty($idSecciones)) $idSecciones .= ",";
        $idSecciones .= "{$x}";
      }
      $where .= " AND ";
      $where .= "n.id_seccion IN ({$idSecciones})";
    }
    if(isset($valores["desde"]) && !empty($valores["desde"])) {
      $where .= " AND ";
      $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') >= DATE_FORMAT('{$valores["desde"]}', '%Y%m%d')";
    }
    if(isset($valores["hasta"]) && !empty($valores["hasta"])) {
      $where .= " AND ";
      $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') <= DATE_FORMAT('{$valores["hasta"]}', '%Y%m%d')";
    }

    return R::getAll("SELECT n.* FROM `proceso` AS p INNER JOIN noticia AS n ON (n.id = p.id_noticia AND n.elim = 0 AND n.estado >= 2) where {$where} ORDER BY p.id DESC LIMIT {$start},{$length}");
  }
  /**
   * Trae la cantidad de elementos que con un cierto patron
   * @param string $e entidad
   * @param Array $buscar buscar
   */
  static function change($d) {
    $entidad = $d["entidad"];
    $column = $d["column"];
    $value = $d["value"];
    $id = $d["id"];

    $e = R::findOne($entidad,"id = ? AND elim = ?",[$id,0]);
    if(isset($e[$column])) {
      $e[$column] = $value;
      R::store($e);
      return "CAMBIO EXITOSO {$entidad}.id: {$id}";
    } else return "COLUMNA NO ENCONTRADA";
  }
  /** */
  static function verProceso($idUnidad,$idNoticia) {
    $ArrCliente = $ArrInstituciones = $ArrActor = Array();
    $noticiasInstituciones = R::findAll("noticiasinstitucion","id_noticia = ? AND elim = ?",[$idNoticia,0]);
    $noticiasActor = R::findAll("noticiasactor","id_noticia = ? AND elim = ?",[$idNoticia,0]);
    // $noticiasProceso = R::findOne("noticiasproceso","id_noticia = ? AND elim = ?",[$idNoticia,0]);
    $noticiasCliente = R::findOne("noticiascliente","id_noticia = ? AND id_cliente = ? AND elim = ?",[$idNoticia,$idUnidad,0]);
    
    $ArrCliente["temas"] = Array();
    $ArrCliente["valoracion"] = Array();
    foreach(json_decode($noticiasCliente["tema"]) AS $k => $v) {
      if($k == "texto") continue;
      $id = substr($k,9);
      if($id == "") continue;
      $tema = R::findOne("attr_temas","id = ? AND elim = ?",[$id,0]);
      $ArrCliente["temas"][$id] = Array();
      $ArrCliente["temas"][$id]["nombre"] = $tema["nombre"];
      $ArrCliente["temas"][$id]["valoracion"] = $v;
    }
    foreach(json_decode($noticiasCliente["valoracion"]) AS $k => $v) {
      $id = substr($k,4);
      if($id == "") continue;
      $calificacion = R::findOne("calificacion","id = ? AND elim = ?",[$id,0]);
      $ArrCliente["valoracion"][$id] = Array();
      $ArrCliente["valoracion"][$id]["nombre"] = $calificacion["nombre"];
      $ArrCliente["valoracion"][$id]["valoracion"] = $v;
    }
    foreach($noticiasInstituciones AS $k => $v) {
      $idInstitucion = $v["id_institucion"];
      $data = str_replace("'",'"',$v["data"]);
      $data = json_decode($data);
      $institucion = R::findOne("attr_institucion","id = ?  AND elim = ?",[$idInstitucion,0]);
      
      $ArrInstituciones[$idInstitucion] = Array();
      $ArrInstituciones[$idInstitucion]["nombre"] = $institucion["nombre"];
      $ArrInstituciones[$idInstitucion]["data"] = Array();
      // echo $v["id"]." ";
      // print_r($data);
      foreach($data AS $kk => $vv) {
        $aux = substr($kk,4);
        $ArrInstituciones[$idInstitucion]["data"][$aux] = $vv;
      }
    }
    foreach($noticiasActor AS $k => $v) {
      $idActor = $v["id_actor"];
      $actor = R::findOne("actor","id = ? AND elim = ?",[$idActor,0]);
      $ArrActor[$idActor] = Array();
      $ArrActor[$idActor]["nombre"] = "{$actor["nombre"]} {$actor["apellido"]}";
      $ArrActor[$idActor]["data"] = Array();
      $data = str_replace("'",'"',$v["data"]);
      $data = json_decode($data);
      foreach($data AS $kk => $vv) {
        $aux = substr($kk,4);
        $ArrActor[$idActor]["data"][$aux] = $vv;
      }
    }

    return Array("noticiasInstituciones" => $ArrInstituciones,"noticiasActor" => $ArrActor/*,"noticiasProceso" => $noticiasProceso*/,"noticiasCliente" => $ArrCliente);
  }
  /** */
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
  /** */
  static function get_total($valores) {
    $id = $valores["id"];
    $whereNoticia = "n.estado >= 2";
    $where = "p.id_cliente = {$id}";
    if($id != 12) $whereNoticia = "n.estado >= 3";
    if(isset($valores["medios"])) {
      $idMedios = "";
      foreach($valores["medios"] AS $x) {
        if(!empty($idMedios)) $idMedios .= ",";
        $idMedios .= "{$x}";
      }
      $where .= " AND ";
      $where .= "n.id_medio IN ({$idMedios})";
    }
    if(isset($valores["secciones"])) {
      $idSecciones = "";
      foreach($valores["secciones"] AS $x) {
        if(!empty($idSecciones)) $idSecciones .= ",";
        $idSecciones .= "{$x}";
      }
      $where .= " AND ";
      $where .= "n.id_seccion IN ({$idSecciones})";
    }
    if(isset($valores["desde"]) && !empty($valores["desde"])) {
      $where .= " AND ";
      $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') >= DATE_FORMAT('{$valores["desde"]}', '%Y%m%d')";
    }
    if(isset($valores["hasta"]) && !empty($valores["hasta"])) {
      $where .= " AND ";
      $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') <= DATE_FORMAT('{$valores["hasta"]}', '%Y%m%d')";
    }
    $sql = "SELECT DISTINCT n.id FROM `proceso` AS p INNER JOIN noticia AS n ON (n.id = p.id_noticia AND n.elim = 0 AND {$whereNoticia}) where {$where}";
    $total = total(self::$mysqli,$sql);
    return $total;
  }
  /** */
  static function get_medios_notificacion($id) {
    $ARR_medios = R::findAll("medio","elim = 0");
    $Arr = Array(Array("id" => "","text" => ""));
    $sql = "SELECT DISTINCT(n.id_medio) AS id_medio FROM osai_notificacion AS onn INNER JOIN noticia AS n ON (n.id = onn.id_noticia AND n.elim = 0) WHERE onn.elim = 0 AND onn.id_usuario_osai = {$id}";
    if($queryRecords = self::$mysqli->query($sql)) {
		  while($data = $queryRecords->fetch_assoc()) {
        if(!isset($Arr[$data["id_medio"]]))
          $Arr[] = Array("id" => $data["id_medio"],"text" => (isset($ARR_medios[$data["id_medio"]]) ? $ARR_medios[$data["id_medio"]]["medio"] : "SIN MEDIO"));
      }
    }
    
    return $Arr;
  }
  /**
   * 
   */
  static function get_medios($valores) {
    if($valores["tipo"] == "A") {
      $id = $valores["id"];
      $whereNoticia = "n.estado >= 2";
      $idMedios = "";
      if($id != 12) $whereNoticia = "n.estado >= 3";
      $where = "p.id_cliente = {$id}";
      if(isset($valores["medio"])) {
        foreach($valores["medio"] AS $x) {
          if(!empty($idMedios)) $idMedios .= ",";
          $idMedios .= "{$x}";
        }
        $where .= " AND ";
        $where .= "n.id_medio IN ({$idMedios})";
      }

      if(isset($valores["desde"]) && !empty($valores["desde"])) {
        $where .= " AND ";
        $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') >= DATE_FORMAT('{$valores["desde"]}', '%Y%m%d')";
      }
      if(isset($valores["hasta"]) && !empty($valores["hasta"])) {
        $where .= " AND ";
        $where .= "DATE_FORMAT(p.autofecha, '%Y%m%d') <= DATE_FORMAT('{$valores["hasta"]}', '%Y%m%d')";
      }

      $ARR_medios = R::findAll("medio","elim = 0");
      $ARR_secciones = R::findAll("seccion","elim = 0");
      
      $elementosMedio = R::getAll("SELECT n.id_medio AS medio FROM `proceso` AS p INNER JOIN noticia AS n ON (n.id = p.id_noticia AND n.elim = 0 AND {$whereNoticia}) where {$where} GROUP BY n.id_medio");
      $elementosSeccion = R::getAll("SELECT n.id_medio AS medio,n.id_seccion AS seccion FROM `proceso` AS p INNER JOIN noticia AS n ON (n.id = p.id_noticia AND n.elim = 0 AND  {$whereNoticia}) where {$where} GROUP BY n.id_seccion");
      $medios = $secciones = Array();

      $medios[] = $secciones[] = Array("id" => "","text" => "");
      foreach($elementosMedio AS $k => $v)
        $medios[] = Array("id" => $v["medio"],"text" => $ARR_medios[$v["medio"]]["medio"]);
      
      foreach($elementosSeccion AS $k => $v) {
        $nombre = "SIN SECCIÓN";
        if(isset($ARR_secciones[$v["seccion"]])) $nombre = $ARR_secciones[$v["seccion"]]["nombre"];
        if(isset($valores["medio"]) && count($valores["medio"]) > 1)
          $text = "{$ARR_medios[$v["medio"]]["medio"]} - {$nombre}";
        else
          $text = $nombre;
        $secciones[] = Array("id" => $v["seccion"],"text" => $text);
      }
      
      return Array("medio" => $medios,"seccion" => $secciones);
    }
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

////
function total($mysqli,$sql) {
  return mysqli_num_rows($mysqli->query($sql));
}