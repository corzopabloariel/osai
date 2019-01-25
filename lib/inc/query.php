<?php
/* Última revisión: 04/12/2018 16:30 */
session_start();
$jsondata = Array();

// configuro la db
R::setup("mysql:host=".CONFIG_HOST.";dbname=".CONFIG_BD,CONFIG_USER,CONFIG_PASS);
R::ext('xdispense', function( $type ){ return R::getRedBean()->dispense( $type ); });
//-------------------------
$mysqli = new mysqli(CONFIG_HOST, CONFIG_USER, CONFIG_PASS, CONFIG_BD);
$mysqli->set_charset('utf8');
//
error_reporting(E_ALL);
ini_set('display_errors', 1);


switch ($_POST["accion"]) {
  case 'usuariosFinales':
    $data = R::getAll("SELECT ou.id_cliente,ou.user,c.nombre FROM osai_usuario AS ou INNER JOIN cliente AS c ON (c.id = ou.id_cliente AND c.elim = 0 AND c.todos = 0) WHERE ou.elim = 0");
    $jsondata["data"] = Array();
    foreach($data AS $k => $v) {
      $jsondata["data"][$v["id_cliente"]] = "Cliente final: {$v["user"]} || Unidad de análisis: {$v["nombre"]}";
    }
    break;
  case 'selectOption':
    $jsondata["html"] = "<option value=''></option>";
    $entidad = $_POST["entidad"];
    if(empty($entidad)) {
      $data = Array();
      $data[1] = "Medios papel";
      $data[2] = "Medios web";
      foreach($data AS $k => $v)
        $jsondata["html"] .= "<option value='{$k}'>{$v}</option>";
    } else {
      $column = $_POST["column"];
      $data = R::findAll($entidad,"elim = 0");
      foreach($data AS $k => $v) {
        $jsondata["html"] .= "<option value='{$k}'>{$v[$column]}</option>";
      }
    }
    break;
  case 'dataDB':
    $jsondata["data"] = Array();
    $jsondata["estado"] = 0;
    $data = $_POST["data"];
    $tipo = $_POST["tipoBD"];
    $medios = R::findAll("medio","elim = 0");
    $clientes = R::findAll("cliente","elim = 0");
    $actores = R::findAll("actor","elim = 0");
    if($tipo == "grafico_1") {
      $sql = "SELECT ";
        $sql .= "n.id, n.id_noticia,n.id_medio,n.id_medio AS medio,";
        $sql .= "DATE_FORMAT(na.autofecha, '%d/%m/%Y') AS fecha,";
        $sql .= "nc.id_cliente,c.nombre AS cliente,nc.valoracion,nc.tema,";
        $sql .= "na.id_actor,CONCAT(a.nombre,' ',a.apellido) AS actor,na.data AS data_actor";
      $sql .= " FROM noticia AS n ";
      $sql .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id_noticia AND na.elim = 0 AND DATE_FORMAT(na.autofecha, '%Y%m%d') BETWEEN DATE_FORMAT('{$data["f_min"]}', '%Y%m%d') AND DATE_FORMAT('{$data["f_max"]}', '%Y%m%d')) ";
      $sql .= "INNER JOIN noticiascliente AS nc ON (nc.id_noticia = n.id_noticia AND nc.elim = 0)";
      $sql .= "INNER JOIN actor AS a ON (a.id = na.id_actor AND a.elim = 0) ";
      $sql .= "INNER JOIN cliente AS c ON (c.id = a.id_cliente AND c.elim = 0) ";
      $sql .= "WHERE n.estado >= 2 AND n.elim = 0";
      if($queryRecords = $mysqli->query($sql)) {
        while($e = $queryRecords->fetch_assoc()) {
          if(!$jsondata["estado"]) $jsondata["estado"] = 1;
          if(isset($actores[$e["id_actor"]])) {
            $e["campo"] = $actores[$e["id_actor"]]["id_campo"];
            $e["partido"] = $actores[$e["id_actor"]]["id_partido"];
            $e["alianza"] = $actores[$e["id_actor"]]["id_alianza"];
          } else {
            $e["actor"] = "SIN ACTOR";
            $e["campo"] = "[]";
            $e["partido"] = "[]";
            $e["alianza"] = "[]";
          }

          if(isset($medios[$e["medio"]])) $e["medio"] = $medios[$e["medio"]]["medio"];
          else $e["medio"] = "SIN MEDIO";
          $jsondata["data"][] = $e;
        }
      }
    }
    if($tipo == "grafico_2") {
      $sql = "SELECT ";
        $sql .= "n.id, n.id_noticia,n.id_medio,n.id_medio AS medio,";
        $sql .= "np.data,DATE_FORMAT(np.autofecha, '%d/%m/%Y') AS fecha,";
        $sql .= "nc.id_cliente,nc.id_cliente AS cliente,nc.valoracion,nc.tema,";
        $sql .= "na.id_actor,na.id_actor AS actor,na.data AS data_actor";
      $sql .= " FROM noticia AS n ";
      $sql .= "INNER JOIN noticiasproceso AS np ON (np.id_noticia = n.id_noticia AND np.elim = 0 AND DATE_FORMAT(np.autofecha, '%Y%m%d') BETWEEN DATE_FORMAT('{$data["f_min"]}', '%Y%m%d') AND DATE_FORMAT('{$data["f_max"]}', '%Y%m%d')) ";
      $sql .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id_noticia AND na.elim = 0) ";
      $sql .= "INNER JOIN noticiascliente AS nc ON (nc.id_noticia = n.id_noticia AND nc.elim = 0)";
      $sql .= " WHERE n.estado >= 2 AND n.elim = 0";
      if($queryRecords = $mysqli->query($sql)) {
        while($e = $queryRecords->fetch_assoc()) {
          if(!$jsondata["estado"]) $jsondata["estado"] = 1;
          if(isset($clientes[$e["cliente"]])) $e["cliente"] = $clientes[$e["cliente"]]["nombre"];
          else $e["cliente"] = "SIN CLIENTE";
          if(isset($actores[$e["actor"]])) $e["actor"] = "{$actores[$e["id_actor"]]["nombre"]} {$actores[$e["id_actor"]]["apellido"]}";
          else $e["actor"] = "SIN ACTOR";
          if(isset($medios[$e["medio"]])) $e["medio"] = $medios[$e["medio"]]["medio"];
          else $e["medio"] = "SIN MEDIO";
          $jsondata["data"][] = $e;
        }
      }
    }
    if($tipo == "grafico_3") {
      // noticiasactor
      // noticiascliente
      $sql = "SELECT ";
      $sql .= "DATE_FORMAT(na.autofecha, '%d/%m/%Y') AS fecha,";
      $sql .= "nc.tema ";
      $sql .= "FROM noticia AS n ";
      $sql .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id_noticia AND na.elim = 0 AND DATE_FORMAT(na.autofecha, '%Y%m%d') BETWEEN DATE_FORMAT('{$data["f_min"]}', '%Y%m%d') AND DATE_FORMAT('{$data["f_max"]}', '%Y%m%d')) ";
      $sql .= "INNER JOIN noticiascliente AS nc ON (nc.id_noticia = n.id_noticia AND nc.elim = 0) ";
      $sql .= "INNER JOIN actor AS a ON (a.id = na.id_actor AND a.elim = 0) ";
      $sql .= "INNER JOIN cliente AS c ON (c.id = a.id_cliente AND c.elim = 0) ";
      $sql .= "WHERE n.estado >= 2 AND n.elim = 0"; 
      if($queryRecords = $mysqli->query($sql)) {
        while($e = $queryRecords->fetch_assoc()) {
          if(!$jsondata["estado"]) $jsondata["estado"] = 1;
          $jsondata["data"][] = $e;
        }
      }
    }
    if($tipo == "grafico_4") {
      // noticiasactor
      // noticiascliente
      $sql = "SELECT ";
      $sql .= "DATE_FORMAT(na.autofecha, '%d/%m/%Y') AS fecha,";
      $sql .= "CONCAT(a.nombre,' ',a.apellido) AS nombre, ";
      $sql .= "a.id AS id_actor, ";
      $sql .= "a.id_cargo AS cargo, ";
      $sql .= "a.id_poder AS poder, ";
      $sql .= "a.id_nivel AS nivel, ";
      $sql .= "a.id_partido AS partido, ";
      $sql .= "a.id_alianza AS alianza, ";
      $sql .= "a.id_campo AS campo ";
      $sql .= "FROM noticia AS n ";
      $sql .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id_noticia AND na.elim = 0 AND DATE_FORMAT(na.autofecha, '%Y%m%d') BETWEEN DATE_FORMAT('{$data["f_min"]}', '%Y%m%d') AND DATE_FORMAT('{$data["f_max"]}', '%Y%m%d')) ";
      $sql .= "INNER JOIN noticiascliente AS nc ON (nc.id_noticia = n.id_noticia AND nc.elim = 0) ";
      $sql .= "INNER JOIN actor AS a ON (a.id = na.id_actor AND a.elim = 0) ";
      $sql .= "INNER JOIN cliente AS c ON (c.id = a.id_cliente AND c.elim = 0) ";
      $sql .= "WHERE n.estado >= 2 AND n.elim = 0"; 
      if($queryRecords = $mysqli->query($sql)) {
        while($e = $queryRecords->fetch_assoc()) {
          if(!$jsondata["estado"]) $jsondata["estado"] = 1;
          $jsondata["data"][] = $e;
        }
      }
    }
    if($tipo == "grafico_5") {
      // noticiasactor
      // noticiascliente
      $sql = "SELECT ";
      $sql .= "DATE_FORMAT(na.autofecha, '%d/%m/%Y') AS fecha,";
      $sql .= "CONCAT(a.nombre,' ',a.apellido) AS nombre, ";
      $sql .= "nc.tema,";
      $sql .= "a.id AS id_actor, ";
      $sql .= "a.id_partido AS partido ";
      $sql .= "FROM noticia AS n ";
      $sql .= "INNER JOIN noticiasactor AS na ON (na.id_noticia = n.id_noticia AND na.elim = 0 AND DATE_FORMAT(na.autofecha, '%Y%m%d') BETWEEN DATE_FORMAT('{$data["f_min"]}', '%Y%m%d') AND DATE_FORMAT('{$data["f_max"]}', '%Y%m%d')) ";
      $sql .= "INNER JOIN noticiascliente AS nc ON (nc.id_noticia = n.id_noticia AND nc.elim = 0) ";
      $sql .= "INNER JOIN actor AS a ON (a.id = na.id_actor AND a.elim = 0) ";
      $sql .= "INNER JOIN cliente AS c ON (c.id = a.id_cliente AND c.elim = 0) ";
      $sql .= "WHERE n.estado >= 2 AND n.elim = 0"; 
      if($queryRecords = $mysqli->query($sql)) {
        while($e = $queryRecords->fetch_assoc()) {
          if(!$jsondata["estado"]) $jsondata["estado"] = 1;
          $jsondata["data"][] = $e;
        }
      }
    }
    mysqli_close($mysqli);
    break;
  case 'insert':
    // print_r($_POST["data"]);
    $aux = R::xdispense($_POST["tabla"]);
    foreach($_POST["data"] AS $k => $v)
      $aux[$k] = $v;
    $jsondata["id"] = R::store($aux);
    break;
  
  case 'change':
    if($_POST["massive"] == 0) {
      $data = R::findOne($_POST["tabla"],"id = ?",[$_POST["id"]]);
      $data[$_POST["column"]] = $_POST["value"];
      R::store($data);
    } else {
      $ids = implode($_POST["id"]["ids"],",");
      if($_POST["tabla"] == "noticia") {
        if($_POST["id"]["tipo"] == "relevo") {
          $sql = "UPDATE {$_POST["tabla"]} SET {$_POST["column"]} = {$_POST["value"]} WHERE id IN ({$ids})";
          $mysqli->query($sql);
          $sql = "SELECT GROUP_CONCAT(id_noticia) AS ids FROM noticia WHERE id IN ({$ids}) LIMIT 1";
          if($queryRecords = $mysqli->query($sql)) {
            while($noticia = $queryRecords->fetch_assoc()) {
              $sql = "UPDATE noticias SET moderado = 1 WHERE id IN ({$noticia["ids"]})";
              $mysqli->query($sql);
            }
          }
          //---- AGREGO A RELEVO LA INFO NECESARIA
          foreach ($_POST["id"]["ids"] as $i) {//ID de noticia
            $noticia = R::findOne("noticia","id = ?",[$i]);
            if(count($_POST["id"]["data"]) > 0) {
              foreach ($_POST["id"]["data"] as $j) {//ID de cliente
                $nr = R::dispense('noticiarelevo');
                $nr["did_noticia"] = $i;
                $nr["id_noticia"] = $noticia["id_noticia"];
                $nr["id_usuario"] = $_SESSION["user_id"];
                $nr["id_cliente"] = $j;

                R::store($nr);
              }
            } else {
              $nr = R::dispense('noticiarelevo');
              $nr["did_noticia"] = $i;
              $nr["id_noticia"] = $noticia["id_noticia"];
              $nr["id_usuario"] = $_SESSION["user_id"];

              R::store($nr);
            }
            //-------------------
            //-------------------
            $log = R::dispense('log');
            $log["id_usuario"] = $_SESSION["user_id"];
            $log["acceso"] = 0;
            $log["accion"] = "Relevo de noticia";
            $log["id_tabla"] = $i;
            $log["tabla"] = "noticia";
            R::store($log);
            //
            $log = R::dispense('log');
            $log["id_usuario"] = $_SESSION["user_id"];
            $log["acceso"] = 0;
            $log["accion"] = "Relevo de noticia";
            $log["id_tabla"] = $noticia["id_noticia"];
            $log["tabla"] = "noticias";
            R::store($log);
          }

        } else {
          $sql = "UPDATE {$_POST["tabla"]} SET {$_POST["column"]} = {$_POST["value"]} WHERE id IN ({$ids})";
          $mysqli->query($sql);
          $sql = "SELECT GROUP_CONCAT(id_noticia) AS ids FROM noticia WHERE id IN ({$ids}) LIMIT 1";
          if($queryRecords = $mysqli->query($sql)) {
            while($noticia = $queryRecords->fetch_assoc()) {
              $sql = "UPDATE noticias SET elim = 1 WHERE id IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiasproceso SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiasproceso SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE proceso SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiasactor SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiascliente SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiasinstitucion SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiaperiodista SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

              $sql = "UPDATE noticiaseccion SET elim = 1 WHERE id_noticia IN ({$noticia["ids"]})";
              $mysqli->query($sql);

            }
          }

          foreach ($_POST["id"]["ids"] as $i) {//ID de noticia
            $noticia = R::findOne("noticia","id = ?",[$i]);
            //-------------------
            //-------------------
            $log = R::dispense('log');
            $log["id_usuario"] = $_SESSION["user_id"];
            $log["acceso"] = 0;
            $log["baja"] = 1;
            $log["accion"] = "Baja de registro";
            $log["id_tabla"] = $i;
            $log["tabla"] = "noticia";
            R::store($log);
            //
            $log = R::dispense('log');
            $log["id_usuario"] = $_SESSION["user_id"];
            $log["acceso"] = 0;
            $log["baja"] = 1;
            $log["accion"] = "Baja de registro";
            $log["id_tabla"] = $noticia["id_noticia"];
            $log["tabla"] = "noticias";
            R::store($log);
          }
        }
      }
    }
    break;
  case 'busquedaAlerta':
    $e = R::getRow("SELECT ns.* FROM notificacion AS n INNER JOIN noticia AS ns ON (n.id_noticia = ns.id_noticia AND ns.elim = 0) WHERE n.elim = 0 AND n.id = {$_POST["id"]}");
    $jsondata = $e;
    break;
  case 'busquedaPeriodista':
    $e = R::getRow("SELECT p.id,p.nombre,np.id AS id_notp FROM periodista AS p INNER JOIN noticiaperiodista AS np ON (np.id_periodista = p.id AND np.elim = 0 AND np.id_noticia = {$_POST["id"]})");
    $jsondata = $e;
    break;
  case 'busqueda':
    if(isset($_POST["desde"])) {
      $sql = "SELECT * FROM {$_POST["tabla"]} WHERE elim = 0";
      $sql .= " AND DATE_FORMAT(autofecha, '%Y%m%d') >= DATE_FORMAT('{$_POST["desde"]}', '%Y%m%d')";
      $sql .= " AND DATE_FORMAT(autofecha, '%Y%m%d') <= DATE_FORMAT('{$_POST["hasta"]}', '%Y%m%d')";
      $jsondata = R::getAll($sql);
    } else if(isset($_POST["data"])) {
      $sql = "SELECT * FROM {$_POST["tabla"]} WHERE elim = 0";
      $sql .= " AND {$_POST["column"]} = {$_POST["data"]}";
      $sql .= " AND DATE_FORMAT(autofecha, '%Y%m%d') >= DATE_FORMAT('{$_POST["desde"]}', '%Y%m%d')";
      $sql .= " AND DATE_FORMAT(autofecha, '%Y%m%d') <= DATE_FORMAT('{$_POST["hasta"]}', '%Y%m%d')";
      $jsondata = R::getAll($sql);
    } else {
      // $jsondata = R::findAll($_POST["tabla"],"elim = 0");
      $sql = "SELECT * FROM {$_POST["tabla"]} WHERE elim = 0";
      if($queryRecords = $mysqli->query($sql)) {
        while($r = $queryRecords->fetch_assoc()) {
          $jsondata[$r["id"]] = $r;
        }
      }
    }
    break;
  case 'notificacionALL':
    // es el unico que pide todos
    $jsondata = R::findAll("notificacion","elim = 0 AND leido = 0");
    break;
  case 'extraccion':
    $jsondata = R::findOne("instancias","elim = 0 ORDER BY id DESC");
    break;
  case 'notificacionTOTAL':
    $sql = "SELECT ";
      $sql .= "(";
        $sql .= "(SELECT count(*) FROM notificacion AS n ";
          $sql .= "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
          $sql .= "LEFT OUTER JOIN notificacion_usuario AS nu ON ";
          $sql .= "(n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0) ";
        $sql .= "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND nu.id IS NULL)";
        $sql .= " + ";
        $sql .= "(SELECT count(*) FROM notificacion AS n ";
          $sql .= "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
          $sql .= "INNER JOIN notificacion_usuario AS nu ON ";
          $sql .= "(n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0 AND nu.visto = 0) ";
        $sql .= "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]})";
      $sql .= ") AS total";

    $res = $mysqli->query($sql);
    $row = $res->fetch_assoc();
    $jsondata["total"] = $row["total"];
    mysqli_close($mysqli);
    break;
  case 'traerNotificacion':
    $sql = "SELECT * FROM notificacion WHERE id = {$_POST["id"]}";
    $res = $mysqli->query($sql);
    $notificacion = $res->fetch_assoc();
    $id_nu = 0;
    $aux = R::findOne('notificacion_usuario',"id_notificacion = ? AND id_usuario = ? AND elim = ?",[$notificacion["id"],$_SESSION["user_id"],0]);
    $titulo = R::findOne('noticias','id = ?',[$notificacion["id_noticia"]]);
    if(!$aux) {
      $nr = R::xdispense('notificacion_usuario');
      $nr["id_notificacion"] = $notificacion["id"];
      $nr["id_usuario"] = $_SESSION["user_id"];
      $id_nu = R::store($nr);
    } else $id_nu = $aux["id"];
    $n = "SIN LEER";
    $jsondata["html"] = "";
    $jsondata["html"] .= "<div onclick='userDATOS.verNotificacion(this)' data-notificacionUsuario='{$id_nu}' data-id='{$notificacion["id"]}' class='cursor-pointer row'>";
      $jsondata["html"] .= "<div class='col-12'>";
        $jsondata["html"] .= "<p class='m-0 text-truncate' title='{$notificacion["mensaje"]}'>{$notificacion["mensaje"]}</p>";
        $jsondata["html"] .= "<p class='m-0 text-truncate' title='{$titulo["titulo"]}'><strong class='mr-1'>Título:</strong>{$titulo["titulo"]}</p>";
        $jsondata["html"] .= "<p class='m-0'><strong class='mr-1'>Estado:</strong>{$n}</p>";
        $jsondata["html"] .= "<p class='m-0 text-right'>" . date("d/m/Y H:i",strtotime($notificacion["autofecha"])). "</p>";
      $jsondata["html"] .= "</div>";
    $jsondata["html"] .= "</div>";
    mysqli_close($mysqli);
    break;
  case 'notificacionHTML':
    $sql = "SELECT ";
      $sql .= "(";
        $sql .= "(SELECT count(*) FROM notificacion AS n ";
          $sql .= "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
          $sql .= "LEFT OUTER JOIN notificacion_usuario AS nu ON ";
          $sql .= "(n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0) ";
        $sql .= "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND nu.id IS NULL)";
        $sql .= " + ";
        $sql .= "(SELECT count(*) FROM notificacion AS n ";
          $sql .= "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
          $sql .= "INNER JOIN notificacion_usuario AS nu ON ";
          $sql .= "(n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0 AND nu.visto = 0) ";
        $sql .= "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]})";
      $sql .= ") AS total";

    $res = $mysqli->query($sql);
    $row = $res->fetch_assoc();
    $jsondata["total"] = $row["total"];

    $sql = "SELECT ";
      $sql .= "n.autofecha,";
      $sql .= "n.id AS 'id_notificacion',";
      $sql .= "n.id_noticia,";
      $sql .= "n.mensaje,";
      $sql .= "n.procesar AS procesar_notificacion,";
      $sql .= "n.procesado AS procesado_notificacion,";
      $sql .= "n.eliminado AS eliminado_notificacion,";
      $sql .= "nu.id,";
      $sql .= "nu.visto,";
      $sql .= "nu.eliminado,";
      $sql .= "nu.procesar ";
    $sql .= "FROM notificacion AS n ";
    if(empty($_POST["filter"])) {
      $inner = "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
      $inner .= "LEFT JOIN notificacion_usuario AS nu ON (n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0) ";
      $where = "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]}";
    } else {
      $inner = "INNER JOIN noticia ON (noticia.id = n.id_noticia AND noticia.elim = 0) ";
      $inner .= "LEFT JOIN notificacion_usuario AS nu ON (n.id = nu.id_notificacion AND nu.id_usuario = {$_SESSION["user_id"]} AND nu.elim = 0) ";
      if(count($_POST["filter"]) == 4) {
        $where = "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]}";
      } else {
        $where = "";
        if (in_array("visto", $_POST["filter"])) {
          $where = "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND nu.visto = 1";
        }
        if (in_array("a_relevar", $_POST["filter"])) {
          if(empty($where)) $where = "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND n.procesar = 1";
          else $where .= " OR n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND n.procesar = 1";
        } else {
          if(!empty($where)) $where .= " AND n.procesar = 0";
        }
        if (in_array("sin_leer", $_POST["filter"])) {
          if(empty($where))
            $where = "WHERE n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND coalesce(nu.visto, 0) = 0";
          else
            $where .= " OR n.elim = 0 AND n.nivel >= {$_SESSION["user_lvl"]} AND coalesce(nu.visto, 0) = 0";
        } else {
          // if(empty($where)) $where .= " AND n.procesar = 0";
        }
      }
    }
    $sql .= $inner . $where;
    // die($sql);
    $jsondata["html"] = "";
    $paginado = $_POST["paginado"] * 20;
    $sql .= " ORDER BY n.id DESC LIMIT {$paginado},20";
    if($queryRecords = $mysqli->query($sql)) {
      while($notificacion = $queryRecords->fetch_assoc()) {
        $aux = R::findOne('notificacion_usuario',"id_notificacion = ? AND id_usuario = ? AND elim = ?",[$notificacion["id_notificacion"],$_SESSION["user_id"],0]);
        $titulo = R::findOne('noticias','id = ?',[$notificacion["id_noticia"]]);
        if(!$aux) {
          $nr = R::xdispense('notificacion_usuario');
          $nr["id_notificacion"] = $notificacion["id_notificacion"];
          $nr["id_usuario"] = $_SESSION["user_id"];
          R::store($nr);
        }
        $n = "SIN LEER";
        $class = "";
        if($notificacion["procesar_notificacion"]) {
          $n = "RELEVADO";
          $class = "bg-warning";
        }
        if($notificacion["eliminado_notificacion"]) {
          $n = "ELIMINADO";
          $class = "bg-danger text-white";
        }
        if($notificacion["procesado_notificacion"]) {
          $n = "PROCESADA";
          $class = "bg-success";
        }
        if($notificacion["id"] !== null && $n == "SIN LEER") {
          if($notificacion["visto"] == 1) {
            $n = "VISTO";
            $class = "bg-white";
          }
          if($notificacion["procesar"] == 1) {
            $n = "RELEVADO";
            $class = "bg-warning";
          }
        } 
        $jsondata["html"] .= "<div onclick='userDATOS.verNotificacion(this)' data-notificacionUsuario='{$notificacion["id"]}' data-id='{$notificacion["id_notificacion"]}' class='cursor-pointer row {$class}'>";
          $jsondata["html"] .= "<div class='col-12'>";
            $jsondata["html"] .= "<p class='m-0 text-truncate' title='{$notificacion["mensaje"]}'>{$notificacion["mensaje"]}</p>";
            $jsondata["html"] .= "<p class='m-0 text-truncate' title='{$titulo["titulo"]}'><strong class='mr-1'>Título:</strong>{$titulo["titulo"]}</p>";
            $jsondata["html"] .= "<p class='m-0'><strong class='mr-1'>Estado:</strong>{$n}</p>";
            $jsondata["html"] .= "<p class='m-0 text-right text-muted'>" . date("d/m/Y H:i",strtotime($notificacion["autofecha"])). "</p>";
          $jsondata["html"] .= "</div>";
        $jsondata["html"] .= "</div>";
      }
    }
    mysqli_close($mysqli);
    break;
  default:
    if($_POST["retorno"] == 1)
      $jsondata = R::findOne($_POST["accion"],"elim = ? AND {$_POST["column"]} = ?",[$_POST["elim"],$_POST["value"]]);
    else
      $jsondata = R::findAll($_POST["accion"],"elim = ? AND {$_POST["column"]} = ?",[$_POST["elim"],$_POST["value"]]);
    break;
}
echo json_encode($jsondata, JSON_FORCE_OBJECT);
?>
