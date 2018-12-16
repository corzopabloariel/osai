<?php
session_start();
$name = "";
if(isset($_SESSION["user_name"])) {
  if($_SESSION["user_lvl"] > 2) header ("Location: ../principal.html");
  $name = $_SESSION["user_name"];
} else {
  header ("Location: ../index.html");
}
?>
<!DOCTYPE html>
<html lang="es" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title>OSAI - INFORMES</title>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="../assets/js/popper.min.js"></script>
    <script type="text/javascript" src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.2/angular.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.2/angular-route.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.7.2/angular-sanitize.js"></script>
    <script type="text/javascript" src="../assets/js/lobibox.js"></script>
    <script type="text/javascript" src="../assets/js/messagebox.js"></script>
    <script type="text/javascript" src="../assets/js/select2.min.js"></script>
    <!--<script type="text/javascript" src="../assets/js/datatables.js"></script>-->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.18/af-2.3.0/b-1.5.2/b-colvis-1.5.2/b-flash-1.5.2/b-html5-1.5.2/b-print-1.5.2/fc-3.2.5/fh-3.1.4/kt-2.4.0/r-2.2.2/rr-1.2.4/sc-1.5.0/sl-1.2.6/datatables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/buttons/1.5.2/js/buttons.bootstrap.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
    <!--<script type="text/javascript" src="https://d3js.org/d3.v5.js"></script>-->
    <script type="text/javascript" src="../assets/js/vis.js"></script>
    <!--<script src="//d3js.org/d3.v3.min.js"></script>-->
    <!--<script src="//d3js.org/d3.v4.min.js"></script>-->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.10/summernote.js"></script>
    <script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
    <script type="text/javascript" src="../assets/js/md5.js"></script>
    <script type="text/javascript" src="../assets/js/declaration.js"></script>
    <script type="text/javascript" src="../assets/js/toolbox.js"></script>
    <script type="text/javascript" src="../assets/js/pyrus.js"></script>
    <script type="text/javascript" src="../assets/js/userDATOS.js"></script>

    <link href="http://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.9/summernote.css" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="../assets/css/lobibox.css">
    <link rel="stylesheet" href="../assets/css/messagebox.css">
    <link rel="stylesheet" href="../assets/css/select2.min.css">
    <link rel="stylesheet" href="../assets/css/fontawesome-all.css">
    <link href="../assets/css/vis-network.min.css" rel="stylesheet" type="text/css">
    <!--<link rel="stylesheet" href="../assets/css/datatables.css">-->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.18/af-2.3.0/b-1.5.2/b-colvis-1.5.2/b-flash-1.5.2/b-html5-1.5.2/b-print-1.5.2/fc-3.2.5/fh-3.1.4/kt-2.4.0/r-2.2.2/rr-1.2.4/sc-1.5.0/sl-1.2.6/datatables.min.css"/>

    <link rel="stylesheet" href="../assets/css/style.css">
    <style media="screen">
    #mynetwork {
        width: 900px;
        height: 900px;
        border: 1px solid lightgray;
    }
    </style>
  </head>
  <body class="scroll-osai text-dark">
    <!-- LOADER -->
    <div id="div_img" class="position-fixed d-none justify-content-center w-100 h-100 bg-white" style="z-index: 10000;">
        <img src="http://93.188.164.27/assets/images/loading.gif" class="align-self-center">
    </div>
    <div id="div" class="position-fixed w-100 h-100 bg-white" ng-show="isViewLoading">
    	<div class="spinner">
    		<div class="bounce1"></div>
    		<div class="bounce2"></div>
    		<div class="bounce3"></div>
    	</div>
    </div>
    <!--/ LOADER -->

    <span class="body position-absolute w-100 h-100" style="z-index:1000;overflow-x: hidden;">
      <aside class="w-100 position-relative shadow-sm" style="z-index:1100;">
        <div class="border-bottom row m-0">
          <div class="col-12 text-right">
            <p class="m-0 p-2 text-uppercase float-left"><?php echo $name ?></p>
          </div>
        </div>
      </aside>
      <section class="pt-3 pb-3">
        <div class="mx-auto pb-2" style="width:900px; font-size:20px;">
          <select class="select__2" style="width:200px;" id="opcion" data-allow-clear="true" data-placeholder="Seleccione">
            <option value=""></option>
            <option value="cargo">Cargo</option>
            <option value="poder">Poder</option>
            <option value="nivel">Nivel</option>
            <option value="partido">Cargo</option>
            <option value="alianza">Alianza</option>
            <option value="campo">Campo</option>
          </select>
        </div>
        <div id="mynetwork" class="mx-auto">
          <div class="vis-network" tabindex="900" style="position: relative; overflow: hidden; touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 100%; height: 100%;">
            <canvas style="position: relative; touch-action: none; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 100%; height: 100%;" width="900" height="900"></canvas>
          </div>
        </div>
      </section>
    </span>


<script type="text/javascript">
getRandomColor = function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++)
    color += letters[Math.floor(Math.random() * 16)];
  return color;
}
  /**
  {
    id: {
    nombre:""
    cargo:[{id:x,nombre:""}]
    poder:[]
    nivel:[]
    // color: "#affad"
    ..
    menciones: X
  }
}
  */
  // ESTE ES EL QUE DEBERIA SER REEMPLAZADO POR EL RESULTADO DE LA LLAMADA

// var actores_externo = {
// 	0 : {
// 		nombre : 'Mauricio Macri',
// 		cargo: [
// 			{ id: 0, nombre: 'presidente de la nacion'}
// 			],
// 		poder: [
// 			{ id: 0, nombre: 'ejecutivo' }
// 			],
// 		nivel: [
// 			{ id: 0, nombre: 'nacional' }
// 			],
// 		partido: [
// 			{ id: 0, nombre: 'PRO' }
// 			],
// 		alianza: [
// 			{ id: 0, nombre: 'cambiemos-ARI' }
// 			],
// 		campo: [
// 			{ id: 0, nombre: 'oficialismo' }
// 			],
// 		menciones: 500
// 		},
// 	1 : {
// 		nombre : 'CFK',
// 		cargo: [
// 			{ id: 1, nombre: 'senadora'}
// 			],
// 		poder: [
// 			{ id: 0, nombre: 'ejecutivo' }
// 			],
// 		nivel: [
// 			{ id: 0, nombre: 'nacional' }
// 			],
// 		partido: [
// 			{ id: 1, nombre: 'unidad ciudadana' }
// 			],
// 		alianza: [
// 			{ id: 2, nombre: 'pj' }
// 			],
// 		campo: [
// 			{ id: 1, nombre: 'oposicion' }
// 			],
// 		menciones: 1000
// 		},
// 	2 : {
// 		nombre : 'Elizabeth Carrio',
// 		cargo: [
// 			{ id: 1, nombre: 'senadora'},
// 			{ id: 2, nombre: 'legisladora'}
// 			],
// 		poder: [
// 			{ id: 0, nombre: 'ejecutivo' }
// 			],
// 		nivel: [
// 			{ id: 0, nombre: 'nacional' }
// 			],
// 		partido: [
// 			{ id: 2, nombre: 'coalicion ARI' }
// 			],
// 		alianza: [
// 			{ id: 0, nombre: 'cambiemos' }
// 			],
// 		campo: [
// 			{ id: 0, nombre: 'oficialismo' }
// 			],
// 		menciones: 200
// 		},
// 	};
actores_externo = {}
data = {};

data["desde"] = window.localStorage.getItem("fecha_min");
data["hasta"] = window.localStorage.getItem("fecha_max");
noticiasactor = userDATOS.busquedaTabla("noticiasactor",data);
if(Object.keys(noticiasactor).length == 0) {
  userDATOS.notificacion("Sin datos entre las fechas<br/>" + data["desde"] + " y " + data["hasta"]);

  $(document).ready(function() {
    $("#div").addClass("d-none");
  });
} else {
  for(var x in noticiasactor) {
  	actor = userDATOS.busqueda(noticiasactor[x]["id_actor"],"actor");
  	if(actores_externo[actor.id] === undefined) {
  		actores_externo[actor.id] = {}
  		actores_externo[actor.id]["nombre"] = actor.nombre + " " + actor.apellido;
  		cargo = userDATOS.parseJSON(actor.id_cargo);
  		poder = userDATOS.parseJSON(actor.id_poder);
  		nivel = userDATOS.parseJSON(actor.id_nivel);
  		partido = userDATOS.parseJSON(actor.id_partido);
  		alianza = userDATOS.parseJSON(actor.id_alianza);
  		campo = userDATOS.parseJSON(actor.id_campo);
  		actores_externo[actor.id]["cargo"] = []
  		for(var y in cargo) {
  			c = userDATOS.busqueda(cargo[y],"attr_cargo");
  			actores_externo[actor.id]["cargo"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["poder"] = []
  		for(var y in poder) {
  			c = userDATOS.busqueda(cargo[y],"attr_poder");
  			actores_externo[actor.id]["poder"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["nivel"] = []
  		actores_externo[actor.id]["nivel"] = []
  		for(var y in nivel) {
  			c = userDATOS.busqueda(nivel[y],"attr_nivel");
  			actores_externo[actor.id]["nivel"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["partido"] = []
  		actores_externo[actor.id]["partido"] = []
  		for(var y in partido) {
  			c = userDATOS.busqueda(partido[y],"attr_partido");
  			actores_externo[actor.id]["partido"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["alianza"] = []
  		actores_externo[actor.id]["alianza"] = []
  		for(var y in alianza) {
  			c = userDATOS.busqueda(alianza[y],"attr_alianza");
  			actores_externo[actor.id]["alianza"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["campo"] = []
  		actores_externo[actor.id]["campo"] = []
  		for(var y in campo) {
  			c = userDATOS.busqueda(campo[y],"attr_campo");
  			actores_externo[actor.id]["campo"].push({id: c.id, nombre:c.nombre})
          }
  		actores_externo[actor.id]["menciones"] = 0
      }
  	actores_externo[actor.id]["menciones"] ++;
  }
  console.log(actores_externo);
  function existe(arr,v,posicional = false){
  	i = 0;
  	for(var x in arr){
  		if(arr[x].id == v.id){
  			 if(posicional) return i;
  			 else return v.id;
  		 }
  		++i;
  	}
  	return -1;
  }

  actores = []
  cargo = [];
  cargo_actores = [];
  poder = [];
  poder_actores = [];
  nivel = [];
  nivel_actores = [];
  partido = [];
  partido_actores = [];
  alianza = [];
  alianza_actores = [];
  campo = [];
  campo_actores = [];

  function getAllAllEdges(t,arr){
  	// devuelve un arreglo con todos los cargos encontrados
  	ret = [];
  	i = 0; // la posicion del actor
  	for(var x in t){
  		for(var y in t[x][arr]){
  			pos = existe(window[arr],t[x][arr][y])
  			if(pos == -1){
  				window[arr].push(t[x][arr][y]);
  				pos = existe(window[arr],t[x][arr][y]);
  			}// si no obtengo posicion
  			// creo la relacion entre algo_actores (relacion) y actores
  			window[arr + '_actores'].push( { from: x, to: pos } );
  		}
  	}
  }

  // convierto todos los actores_externo a actores;

  for(var x in actores_externo){
  	t = actores_externo[x];
    console.log(t);
  	actores.push({id: x,value: t.menciones, label: t.nombre });
  }

  getAllAllEdges(actores_externo,'cargo');
  getAllAllEdges(actores_externo,'poder');
  getAllAllEdges(actores_externo,'nivel');
  getAllAllEdges(actores_externo,'partido');
  getAllAllEdges(actores_externo,'alianza');
  getAllAllEdges(actores_externo,'campo');


  // Se lo debe llamar una sola vez una vez cargada la pagina
  // ej: dibujar('campo');
  function dibujar(t){
  	// dependiendo del tipo
  	t_nodos = window.actores;
    // t_nodos = []
  	rel = [];
  	// agrego los nodos del elemento
  	for(var x in window[t]){
  		tmp = window[t][x];
  		// tmp.id = (window.actores.length -1) + tmp.id;
  		tmp.id = ( tmp.id + 1 ) * -1
  		tmp.label = tmp.nombre;
  		t_nodos.push(tmp);
  	}
  	for(var x in window[t + '_actores']){
  		tmp = window[t + '_actores'][x];
  		// from es el actor
  		// to el objetivo
  		tmp['to'] = (tmp['to'] + 1) * -1 // + window.actores.length; // sumo la diferencia hacia donde apunta
  		// agrego
  		rel.push(tmp);
  	}
  	draw(t_nodos,rel);
  }


  function draw(nodes,edges) {
      // create some nodes
      /*var nodes = [
          {id: 0, "label": "Myriel", "group": 1},
          {id: 1, "label": "Napoleon", "group": 1},
          {id: 2, "label": "Mlle.Baptistine", "group": 1},
          {id: 3, "label": "Mme.Magloire", "group": 1}
      ];*/

      // create some edges
      /*var edges = [
          {"from": 1, "to": 0},
          {"from": 2, "to": 0}
      ];*/

      // create a network
      var container = document.getElementById('mynetwork');
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = {
          nodes: {
              shape: 'dot',
              size: 16
          },
          physics: {
              forceAtlas2Based: {
                  gravitationalConstant: -26,
                  centralGravity: 0.005,
                  springLength: 230,
                  springConstant: 0.18
              },
              maxVelocity: 146,
              solver: 'forceAtlas2Based',
              timestep: 0.35,
              stabilization: {iterations: 150}
          }
      };
      var network = new vis.Network(container, data, options);

  }
  function hacer(tin){
  	actores = []
    cargo = [];
    cargo_actores = [];
    poder = [];
    poder_actores = [];
    nivel = [];
    nivel_actores = [];
    partido = [];
    partido_actores = [];
    alianza = [];
    alianza_actores = [];
    campo = [];
    campo_actores = [];
  	for(var x in actores_externo){
      t = actores_externo[x];
    	// console.log(t);
      actores.push({id: x,value: t.menciones, label: t.nombre });
    }

  	getAllAllEdges(actores_externo,tin);
  	dibujar(tin);
  }

  $(document).ready(function() {
    draw();
    $("#opcion").select2();
    $("#opcion").change(function() {
      if($(this).val() != "")
        hacer($(this).val());
      else {
        actores = []
        cargo = [];
        cargo_actores = [];
        poder = [];
        poder_actores = [];
        nivel = [];
        nivel_actores = [];
        partido = [];
        partido_actores = [];
        alianza = [];
        alianza_actores = [];
        campo = [];
        campo_actores = [];
      	for(var x in actores_externo){
          t = actores_externo[x];
        	// console.log(t);
          actores.push({id: x,value: t.menciones, label: t.nombre });
        }
        draw();
      }
    })
    $("#div").addClass("d-none");
  });
}
    </script>
  </body>
</html>
