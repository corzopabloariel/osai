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
    <meta name="WT.z_cad" content="0">
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
    <script src="//d3js.org/d3.v2.min.js"></script>
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
    <!--<link rel="stylesheet" href="../assets/css/datatables.css">-->
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.18/af-2.3.0/b-1.5.2/b-colvis-1.5.2/b-flash-1.5.2/b-html5-1.5.2/b-print-1.5.2/fc-3.2.5/fh-3.1.4/kt-2.4.0/r-2.2.2/rr-1.2.4/sc-1.5.0/sl-1.2.6/datatables.min.css"/>

    <link rel="stylesheet" href="../assets/css/style.css">
    <style media="screen">
    #g-chart {
      overflow: hidden;
      position: relative;
    }

    #g-form {
      font: 16px sans-serif;
      text-align: center;
    }

    #g-form input {
      border-right: none;
      border-radius: 3px 0 0 3px;
      border: solid 1px #ccc;
      font: inherit;
      padding: 4px 8px;
      width: 223px;
    }

    #g-form button {
      background: #004276;
      border: none;
      border-radius: 0 3px 3px 0;
      color: #fff;
      font: inherit;
      font-weight: bold;
      padding: 5px 8px;
      position: relative;
      top: 1px;
      width: 30px;
    }

    .g-legend {
      color: #999;
      font: 11px/1.3em sans-serif;
      height: 30px;
      margin-top: 15px;
      position: relative;
      text-align: center;
    }

    .g-arrow {
      position: absolute;
      width: 100px;
    }

    .g-arrow:before {
      position: absolute;
      font-size: 15px;
      font-style: normal;
      top: 7px;
    }

    .g-democrat.g-arrow {
      left: 170px;
      padding-left: 40px;
    }

    .g-arrow.g-democrat:before {
      content: "â†";
      right: 100px;
    }

    .g-republican.g-arrow {
      right: 170px;
      padding-right: 40px;
    }

    .g-arrow.g-republican:before {
      content: "â†’";
      left: 100px;
    }

    .g-legend .g-pointer {
      width: 150px;
    }

    .g-overview {
      position: absolute;
      left: 360px;
      text-align: center;
      width: 250px;
    }

    .g-legend .g-democrat.g-pointer {
      position: absolute;
      left: 314px;
      text-align: right;
      padding-right: 20px;
    }

    .g-swatch {
      width: 6px;
      height: 8px;
      display: inline-block;
      position: relative;
      top: 1px;
      margin: 0 3px;
    }

    .g-republican.g-swatch {
      background-color: #f9caca;
      border-radius: 0 4px 4px 0;
    }

    .g-democrat.g-swatch {
      background-color: #c5d7ea;
      border-radius: 4px 0 0 4px;
    }

    .g-republican.g-swatch {
      background-color: #f9caca;
    }

    .g-notes {
      font: 11px/1.3em sans-serif;
      height: 100px;
      position: absolute;
      top: 430px;
    }

    .g-note {
      color: #999;
      position: absolute;
      width: 212px;
    }

    .g-note b {
      color: #333;
      text-transform: uppercase;
    }

    .g-note-arrow {
      fill: none;
      stroke: #aaa;
      stroke-dasharray: 2,2;
      stroke-width: 1.5px;
      -webkit-transition: stroke-opacity 250ms ease;
      -moz-transition: stroke-opacity 250ms ease;
      -ms-transition: stroke-opacity 250ms ease;
      -o-transition: stroke-opacity 250ms ease;
      transition: stroke-opacity 250ms ease;
    }

    .g-error {
      background: #ffa;
      border: solid 1px #ccc;
      font-size: 16px;
      line-height: 1.2em;
      margin: 10px;
      padding: 10px;
    }

    .g-node .g-democrat {
      fill: #c5d7ea;
    }

    .g-node.g-hover .g-democrat {
      fill: #acbed1; /* darker(.5) */
    }

    .g-node.g-selected .g-democrat {
      fill: #99c0e5; /* c *= 2, darker(.5) */
      stroke: #6081a3; /* c *= 2, darker(2) */
      stroke-width: 1.5px;
    }

    .g-node .g-republican {
      fill: #f9caca;
    }

    .g-node.g-hover .g-republican {
      fill: #dfb1b1; /* darker(.5) */
    }

    .g-node.g-selected .g-republican {
      fill: #fda4a7; /* c *= 2, darker(.5) */
      stroke: #af5e61; /* c *= 2, darker(2) */
      stroke-width: 1.5px;
    }

    .g-node .g-split {
      stroke: #000;
      stroke-opacity: .18;
      shape-rendering: crispEdges;
    }

    a.g-label {
      color: inherit;
      cursor: pointer;
      display: block;
      text-align: center;
      text-decoration: none;
      line-height: 1em;
      position: absolute;
    }

    .g-label .g-value {
      font: 11px sans-serif;
      white-space: nowrap;
    }

    .g-overlay,
    .g-node,
    .g-label {
      -webkit-tap-highlight-color: transparent;
    }

    .g-overlay {
      fill: none;
      pointer-events: all;
    }

    .g-body {
      min-height: 700px;
    }

    .g-has-topic .g-isnt-topic,
    .g-hasnt-topic .g-is-topic {
      display: none;
    }

    .g-body h3 {
      font-size: 18px;
      line-height: 1.4em;
      font-family: Georgia;
      font-weight: normal;
      margin-bottom: 0.9em;
    }

    .g-mentions {
      width: 445px;
    }

    .g-mentions h3 {
      text-align: center;
    }

    .g-mentions.g-democrat h3 {
      margin-left: 140px;
    }

    .g-mentions.g-republican h3 {
      margin-right: 140px;
    }

    .g-divider,
    .g-mention,
    .g-truncated {
      border-top: solid 1px #ccc;
    }

    .g-mentions.g-democrat {
      margin: 0 0 0 20px;
      float: left;
    }

    .g-mentions.g-republican {
      margin: 0 20px 0 0;
      float: right;
    }

    .g-head a {
      border-radius: 3px;
      padding: 3px 3px;
      white-space: nowrap;
    }

    .g-mention {
      clear: both;
      margin: -1px 0 1.5em 0;
    }

    .g-mention p {
      color: #444;
      font-family: Georgia;
      font-size: 1.3em;
      line-height: 1.40em;
    }

    .g-democrat .g-mention p {
      margin: 1.5em 0 1.5em 160px;
    }

    .g-republican .g-mention p {
      margin: 1.5em 140px 1.5em 20px;
    }

    .g-mention a {
      border-radius: 3px;
      padding: 1px 3px;
      text-decoration: none;
    }

    .g-democrat a {
      background-color: #c5d7ea;
      color: #4a5783;
    }

    .g-republican a {
      background-color: #fbdedf;
      color: #734143;
    }

    .g-mention p:before,
    .g-mention p:after {
      color: #ddd;
      font-family: sans-serif;
      font-size: 36px;
      position: absolute;
    }

    .g-mention p::before {
      content: "â€œ";
      margin: 0.25em 0 0 -20px;
    }

    .g-mention p::after {
      content: "â€";
      margin: 0.25em 0 0 0.1em;
    }

    .g-speaker {
      font: bold 13px sans-serif;
      margin: 1.5em 0 0.15em 0;
      text-transform: uppercase;
      width: 125px;
    }

    .g-speaker-title {
      clear: both;
      color: #aaa;
      font: 11px sans-serif;
      margin-bottom: 1em;
      width: 125px;
    }

    .g-democrat .g-speaker,
    .g-democrat .g-speaker-title {
      float: left;
      text-align: left;
    }

    .g-republican .g-speaker,
    .g-republican .g-speaker-title {
      float: right;
      text-align: right;
    }

    .g-truncated {
      border-top-style: dashed;
      color: #aaa;
      display: none;
      font: 11px sans-serif;
      padding-top: 1em;
      text-align: center;
    }

    /* Scoop Fixes */

    .storySummary,
    .storyHeader h1 {
      display: block;
      margin: 5px auto;
      padding: 0;
      text-align: center;
      width: 640px;
    }

    #interactiveFooter {
      border-top: 1px solid #ddd;
      margin-top: 10px;
      padding-top: 12px;
    }

    #main .storyHeader h1 {
      font-size: 26px;
      margin: 25px auto 4px auto;
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
        <div class="mx-auto pb-2 w-50" style="font-size:20px; ">
          <div class="row">
            <div class="col-6">
              <select class="select__2" style="width:100%;" id="partido_1" data-allow-clear="true" data-placeholder="Seleccione PARTIDO">
                <option value=""></option>
              </select>
            </div>
            <div class="col-6">
              <select class="select__2" style="width:100%;" id="partido_2" data-allow-clear="true" data-placeholder="Seleccione PARTIDO">
                <option value=""></option>
              </select>
            </div>
          </div>
        </div>
        <div id="main" class="mx-auto">
          <div id="g-chart">
            <div class="g-notes"></div>
            <div class="g-labels"></div>

            <svg class="g-nodes" width="100%" height="540"></svg>
          </div>
          <p></p>
        </div>
      </section>
    </span>


    <script type="text/javascript">
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
  actor = {};
  for(var i in noticiasactor) {
    aux = userDATOS.busqueda(noticiasactor[i]["id_actor"],"actor");
    clientes = userDATOS.busqueda(aux.id_cliente,"noticiascliente",false,"id_cliente",0);
    partido = userDATOS.parseJSON(aux.id_partido);
    for(var x in partido) {
      if(actor[partido[x]] === undefined) {
        actor[partido[x]] = {};
        p = userDATOS.busqueda(partido[x],"attr_partido")
        if(p === null) continue;
        $("#partido_1,#partido_2").append("<option value='" + partido[x] + "'>" + p.nombre + "</option>");
        actor[partido[x]]["partido"] = p.nombre;
        actor[partido[x]]["actores"] = {};
        actor[partido[x]]["temas"] = {};
      }
      if(actor[partido[x]]["actores"][aux["id"]] === undefined) {
        actor[partido[x]]["actores"][aux["id"]] = {};
        actor[partido[x]]["actores"][aux["id"]]["actor"] = aux["nombre"] + " " + aux["apellido"];
        actor[partido[x]]["actores"][aux["id"]]["temas"] = {}
      }
      for(var cliente in clientes) {
        temas = userDATOS.parseJSON(clientes[cliente].tema);
        for(var y in temas) {
          if(y == "texto") continue;
          id_tema = y.substring(9);
          if(id_tema == "" || id_tema == "NULL") continue;
          id_tema = parseInt(id_tema);
          if(isNaN(id_tema)) continue;
          t = userDATOS.busqueda(id_tema,"attr_temas");
          if(actor[partido[x]]["temas"][id_tema] === undefined) {
            actor[partido[x]]["temas"][id_tema] = {};
            actor[partido[x]]["temas"][id_tema]["nombre"] = t.nombre;
            actor[partido[x]]["temas"][id_tema]["cantidad"] = 0;
          }
          if(actor[partido[x]]["actores"][aux["id"]]["temas"][id_tema] === undefined)
            actor[partido[x]]["actores"][aux["id"]]["temas"][id_tema] = t.nombre;
          actor[partido[x]]["temas"][id_tema]["cantidad"] ++;
        }
      }
    }
  }
  // [{
  //     "name":"CFK",
  //     "re":{},
  //     "x":5,
  //     "y":0,
  //     "id":0,
  //     "count":100,
  //     "cx":5,
  //     "cy":0,
  //     "parties":[
  //         {"count":17.35417236374345},
  //         {"count":19.665826620245603}
  //     ]
  // }],
  $(document).ready(function() {
    $(".select__2").select2();
    $("#partido_1").on("change",function() {
      v = $(this).val();
      if(v != "") $("#partido_2").find("option[value='" + v + "']").attr("disabled",true)
      else $("#partido_2").find("option").removeAttr("disabled")
      $("#partido_2").select2();
    });
    $("#partido_2").on("change",function() {
      v = $(this).val();
      if(v != "") $("#partido_1").find("option[value='" + v + "']").attr("disabled",true)
      else $("#partido_1").find("option").removeAttr("disabled")
      $("#partido_1").select2();
    });
    $("#partido_1,#partido_2").on("change",function() {
      partido_1 = $("#partido_1").val();
      partido_2 = $("#partido_2").val();

      if(partido_1 != "" && partido_2 != "") {
        $("#g-chart .g-labels").html("")
        $("#g-chart .g-nodes").html("")
        //////////////
        xz = [];
        for(var x in actor[partido_1]["temas"]) {
          tema = actor[partido_1]["temas"][x];
          parte = {};
          parte["name"] = tema.nombre;
          parte["re"] = {};
          // parte["x"] = 0;
          // parte["y"] = 0;
          parte["id"] = x;
          parte["count"] = tema.cantidad;
          // parte["cx"] = 0;
          // parte["cy"] = 0;
          parte["parties"] = [];

          parte.parties.push({"count":tema.cantidad});
          parte.parties.push({"count":0});
          xz.push(parte)
        }

        for(var x in actor[partido_2]["temas"]) {
          tema = actor[partido_2]["temas"][x];
          aux = xz.find(x => x["name"] === tema.nombre);
          if(aux === undefined) {
            parte = {};
            parte["name"] = tema.nombre;
            parte["re"] = {};
            // parte["x"] = 0;
            // parte["y"] = 0;
            parte["id"] = x;
            parte["count"] = tema.cantidad;
            // parte["cx"] = 0;
            // parte["cy"] = 0;
            parte["parties"] = [];
            parte.parties.push({"count":0});
            parte.parties.push({"count":tema.cantidad});
            xz.push(parte)
          } else {
            aux.count += tema.cantidad;
            aux.parties[1]["count"] = tema.cantidad;
          }
        }
        //////////////
        dibujar(xz);
      } else {
        $("#g-chart .g-labels").html("")
        $("#g-chart .g-nodes").html("")
      }
    })


    $("#div").addClass("d-none");
  });

  ////////
  var data = {};



  var dibujar = function(arr_json) {

  // lo paso al local
  xz = arr_json;

  var width = window.innerWidth,
      height = 540;

  var collisionPadding = 4,
      clipPadding = 4,
      minRadius = 16, // minimum collision radius
      maxRadius = 65, // also determines collision search radius
      maxMentions = 100, // don't show full transcripts
      activeTopic; // currently-displayed topic

  var formatShortCount = d3.format(",.0f"),
      formatLongCount = d3.format(".1f"),
      formatCount = function(d) { return (d < 10 ? formatLongCount : formatShortCount)(d); };

  var r = d3.scale.sqrt()
      .domain([0, d3.max(xz, function(d) { return d.count; })])
      .range([0, maxRadius]);

  var force = d3.layout.force()
      .charge(0)
      .size([width, height - 80])
      .on("tick", tick);

  var node = d3.select(".g-nodes").selectAll(".g-node"),
      label = d3.select(".g-labels").selectAll(".g-label"),
      arrow = d3.select(".g-nodes").selectAll(".g-note-arrow");

  d3.select(".g-nodes").append("rect")
      .attr("class", "g-overlay")
      .attr("width", width)
      .attr("height", height)
      .on("click", clear);

  d3.select(window)
      .on("hashchange", hashchange);

  d3.select("#g-form")
      .on("submit", submit);


  window.t = data.topics;
  // updateTopics(xz.topics);
  updateTopics(xz);
  hashchange();

  function random(){
  	return Math.floor(Math.random() * (20 - 1)) + 1;
  }
  // Update the known topics.
  // ENVIO TOPICOS A PARSEAR, CADA "TOPICO" ES EL ELEMENTO VARIABLE
  //y se vale de los partidos para contabilizar
  function updateTopics(topics) {
    topics.forEach(function(d) {
  	// CUANTAS VECES SEA DETERMINA EL RADIO DEL TOPICO
      d.r = r(d.count); // CANTIDAD TOTAL SOBRE EL ELEMENTO A MOSTRAR
      d.cr =  60; //Math.floor(Math.random() * (20 - 1)) + 1; //Math.max(minRadius, d.r); // POSION CON RESPECTO AL PLANO
      d.k = fraction(d.parties[0].count, d.parties[1].count); // CANTIDAD DE CADA ELEMENTO opo vs ofi (party 1 y 2)
      if (isNaN(d.k)) d.k = .5;
      if (isNaN(d.x)) d.x = (1 - d.k) * width + Math.random();
      d.bias = .5 - Math.max(.1, Math.min(.9, d.k));
    });
    force.nodes(xz.topics = topics).start();
    updateNodes();
    updateLabels();
    updateArrows();
    tick({alpha: 0}); // synchronous update
  }

  // Update the displayed nodes.
  function updateNodes() {
    node = node.data(xz.topics, function(d) { return d.name; });

    node.exit().remove();

    var nodeEnter = node.enter().append("a")
        .attr("class", "g-node")
        .attr("xlink:href", function(d) { return "#" + encodeURIComponent(d.name); })
        .call(force.drag)
        .call(linkTopic);

    var democratEnter = nodeEnter.append("g")
        .attr("class", "g-democrat");

    democratEnter.append("clipPath")
        .attr("id", function(d) { return "g-clip-democrat-" + d.id; })
      .append("rect");

    democratEnter.append("circle");

    var republicanEnter = nodeEnter.append("g")
        .attr("class", "g-republican");

    republicanEnter.append("clipPath")
        .attr("id", function(d) { return "g-clip-republican-" + d.id; })
      .append("rect");

    republicanEnter.append("circle");

    nodeEnter.append("line")
        .attr("class", "g-split");

    node.selectAll("rect")
        .attr("y", function(d) { return -d.r - clipPadding; })
        .attr("height", function(d) { return 2 * d.r + 2 * clipPadding; });

    node.select(".g-democrat rect")
        .style("display", function(d) { return d.k > 0 ? null : "none" })
        .attr("x", function(d) { return -d.r - clipPadding; })
        .attr("width", function(d) { return 2 * d.r * d.k + clipPadding; });

    node.select(".g-republican rect")
        .style("display", function(d) { return d.k < 1 ? null : "none" })
        .attr("x", function(d) { return -d.r + 2 * d.r * d.k; })
        .attr("width", function(d) { return 2 * d.r; });

    node.select(".g-democrat circle")
        .attr("clip-path", function(d) { return d.k < 1 ? "url(#g-clip-democrat-" + d.id + ")" : null; });

    node.select(".g-republican circle")
        .attr("clip-path", function(d) { return d.k > 0 ? "url(#g-clip-republican-" + d.id + ")" : null; });

    node.select(".g-split")
        .attr("x1", function(d) { return -d.r + 2 * d.r * d.k; })
        .attr("y1", function(d) { return -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); })
        .attr("x2", function(d) { return -d.r + 2 * d.r * d.k; })
        .attr("y2", function(d) { return Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)); });

    node.selectAll("circle")
        .attr("r", function(d) { return r(d.count); });
  }

  // Update the displayed node labels.
  function updateLabels() {
    label = label.data(xz.topics, function(d) { return d.name; });

    label.exit().remove();

    var labelEnter = label.enter().append("a")
        .attr("class", "g-label")
        .attr("href", function(d) { return "#" + encodeURIComponent(d.name); })
        .call(force.drag)
        .call(linkTopic);

    labelEnter.append("div")
        .attr("class", "g-name")
        .text(function(d) { return d.name; });

    labelEnter.append("div")
        .attr("class", "g-value");

    label
        .style("font-size", function(d) { return Math.max(8, d.r / 2) + "px"; })
        .style("width", function(d) { return d.r * 2.5 + "px"; });

    // Create a temporary span to compute the true text width.
    label.append("span")
        .text(function(d) { return d.name; })
        .each(function(d) { d.dx = Math.max(d.r * 2.5, this.getBoundingClientRect().width); })
        .remove();

    label
        .style("width", function(d) { return d.dx + "px"; })
      .select(".g-value")
        .text(function(d) { return formatShortCount(d.parties[0].count) + " - " + formatShortCount(d.parties[1].count); });

    // Compute the height of labels when wrapped.
    label.each(function(d) { d.dy = this.getBoundingClientRect().height; });
  }

  // Update the active topic.
  function updateActiveTopic(topic) {
    d3.selectAll(".g-head").attr("class", topic ? "g-head g-has-topic" : "g-head g-hasnt-topic");
    if (activeTopic = topic) {
      node.classed("g-selected", function(d) { return d === topic; });
      updateMentions(findMentions(topic));
      d3.selectAll(".g-head a").text(topic.name);
      d3.select(".g-democrat .g-head span.g-count").text(formatCount(topic.parties[0].count));
      d3.select(".g-republican .g-head span.g-count").text(formatCount(topic.parties[1].count));
    } else {
      node.classed("g-selected", false);
      updateMentions(sampleMentions());
      d3.selectAll(".g-head a").text("various topics");
      d3.selectAll(".g-head span.g-count").text("some number of");
    }
  }

  // Update displayed excerpts.
  function updateMentions(mentions) {
    var column = d3.selectAll(".g-mentions")
        .data(mentions);

    column.select(".g-truncated")
        .style("display", function(d) { return d.truncated ? "block" : null; });

    var mention = column.selectAll(".g-mention")
        .data(groupMentionsBySpeaker, function(d) { return d.key; });

    mention.exit().remove();

    mention.selectAll("p")
        .remove();

    var mentionEnter = mention.enter().insert("div", ".g-truncated")
        .attr("class", "g-mention");

    mentionEnter.append("div")
        .attr("class", "g-speaker")
        .text(function(d) { var s = xz.speakers[d.key]; return s ? s.name : d.key; });

    mentionEnter.append("div")
        .attr("class", "g-speaker-title")
        .text(function(d) { var s = xz.speakers[d.key]; return s && s.title; });

    mention
        .sort(function(a, b) { return b.values.length - a.values.length; });

    var p = mention.selectAll("p")
        .data(function(d) { return d.values; })
      .enter().append("p")
        .html(function(d) { return d.section.speech.text.substring(d.start, d.end).replace(d.topic.re, "<a>$1</a>"); });

    if (activeTopic) {
      p.attr("class", "g-hover");
    } else {
      p.each(function(d) {
        d3.select(this).selectAll("a")
            .datum(d.topic)
            .attr("href", "#" + encodeURIComponent(d.topic.name))
            .call(linkTopic);
      });
    }
  }

  // Bind the arrow path elements with their associated topic.
  function updateArrows() {
    arrow = arrow.data(
        xz.topics.filter(function(d) { return d.arrow; }),
        function(d) { return this.id ? this.id.substring(8) : d.arrow; });
  }

  // Return a random sample of mentions per party, one per topic.
  // Mentions are returned in chronological order.
  function sampleMentions() {
    console.log(xz);
    if(xz.parties === undefined) return false;
    return xz.parties.map(function(party, i) {
      return xz.topics
          .map(function(d) { return d.parties[i].mentions; })
          .filter(function(d) { return d.length; })
          .map(function(d) { return d[Math.floor(Math.random() * d.length)]; })
          .sort(orderMentions);
    });
  }

  // Return displayable mentions per party for the specified topic.
  // If too many, a random sample of matching mentions is returned.
  // Mentions are returned in chronological order.
  function findMentions(topic) {
    console.log(xz.parties);
    if(xz.parties === undefined) return false;
    return xz.parties.map(function(party, i) {
      var mentions = topic.parties[i].mentions;
      if (mentions.length > maxMentions) {
        shuffle(mentions).length = maxMentions;
        mentions.sort(orderMentions);
        mentions.truncated = true;
      }
      return mentions;
    });
  }

  // Group mentions by speaker, collapse overlapping excerpts.
  function groupMentionsBySpeaker(mentions) {
    return d3.nest()
        .key(function(d) { return d.section.speaker; })
        .rollup(collapseMentions)
        .entries(mentions);
  }

  // Given an array of mentions, computes the start and end point of the context
  // excerpt, and then collapses any overlapping excerpts.
  function collapseMentions(mentions) {
    var sentenceRe = /([!?.)]+)\s+/g, // sentence splitting requires NLP
        i,
        n = mentions.length,
        d0,
        d1;

    // First compute the excerpt contexts.
    for (i = 0; i < n; ++i) {
      d0 = mentions[i];
      d0.start = excerptStart(d0);
      d0.end = excerptEnd(d0);
    }

    // Then collapse any overlapping excerpts (from the same speech).
    for (i = 1, d1 = mentions[0]; i < n; ++i) {
      d0 = d1;
      d1 = mentions[i];
      if (d1.section.speech.id === d0.section.speech.id
          && d1.start >= d0.start
          && d1.start < d0.end) {
        d1.start = -1;
        d0.end = d1.end;
        d1 = d0;
      }
    }

    // Returns the start index of the excerpt for the specified mention.
    function excerptStart(mention) {
      var i = sentenceRe.lastIndex = Math.max(mention.section.i, mention.i - 80), match;
      while (match = sentenceRe.exec(mention.section.speech.text)) {
        if (match.index < mention.i - 20) return match.index + match[0].length;
        if (i <= mention.section.i) break;
        sentenceRe.lastIndex = i = Math.max(mention.section.i, i - 20);
      }
      return mention.section.i;
    }

    // Returns the end index of the excerpt for the specified mention.
    function excerptEnd(mention) {
      var i = mention.section.j, match;
      sentenceRe.lastIndex = mention.j + 40;
      match = sentenceRe.exec(mention.section.speech.text);
      return match ? Math.min(match.index + match[1].length, i) : i;
    }

    return mentions.filter(function(d) { return d.start >= 0; });
  }

  // Orders mentions chronologically: by speech and position within speech.
  function orderMentions(a, b) {
    return a.section.speech.id - b.section.speech.id || a.i - b.i;
  }

  // Assign event handlers to topic links.
  function linkTopic(a) {
    a   .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
  }

  // Returns the topic matching the specified name, approximately.
  // If no matching topic is found, returns undefined.
  function findTopic(name) {
    for (var i = 0, n = xz.topics.length, t; i < n; ++i) {
      if ((t = xz.topics[i]).name === name || new RegExp("^" + (t = xz.topics[i]).re.source + "$", "i").test(name)) {
        return t;
      }
    }
  }

  // Returns the topic matching the specified name, approximately.
  // If no matching topic is found, a new one is created.
  function findOrAddTopic(name) {
    var topic = findTopic(name);
    if (!topic) {
      topic = xz.topic(name.substring(0, 1).toUpperCase() + name.substring(1));
      topic.y = 0;
      updateTopics(xz.topics);
    }
    return topic;
  }

  // Simulate forces and update node and label positions on tick.
  function tick(e) {
    node
        .each(bias(e.alpha * 105))
        .each(collide(.5))
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    label
        .style("left", function(d) { return (d.x - d.dx / 2) + "px"; })
        .style("top", function(d) { return (d.y - d.dy / 2) + "px"; });

    arrow.style("stroke-opacity", function(d) {
      var dx = d.x - d.cx, dy = d.y - d.cy;
      return dx * dx + dy * dy < d.r * d.r ? 1: 0;
    });
  }

  // A left-right bias causing topics to orient by party preference.
  function bias(alpha) {
    return function(d) {
      d.x += d.bias * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var q = d3.geom.quadtree(xz.topics);
    return function(d) {
      var r = d.cr + maxRadius + collisionPadding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      q.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d) && d.other !== quad.point && d !== quad.point.other) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.cr + quad.point.r + collisionPadding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

  // Fisher–Yates shuffle.
  function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // Given two quantities a and b, returns the fraction to split the circle a + b.
  function fraction(a, b) {
    var k = a / (a + b);
    if (k > 0 && k < 1) {
      var t0, t1 = Math.pow(12 * k * Math.PI, 1 / 3);
      for (var i = 0; i < 10; ++i) { // Solve for theta numerically.
        t0 = t1;
        t1 = (Math.sin(t0) - t0 * Math.cos(t0) + 2 * k * Math.PI) / (1 - Math.cos(t0));
      }
      k = (1 - Math.cos(t1 / 2)) / 2;
    }
    return k;
  }

  // Update the active topic on hashchange, perhaps creating a new topic.
  function hashchange() {
    var name = decodeURIComponent(location.hash.substring(1)).trim();
    updateActiveTopic(name && name != "!" ? findOrAddTopic(name) : null);
  }

  // Trigger a hashchange on submit.
  function submit() {
    var name = this.search.value.trim();
    location.hash = name ? encodeURIComponent(name) : "!";
    this.search.value = "";
    d3.event.preventDefault();
  }

  // Clear the active topic when clicking on the chart background.
  function clear() {
    location.replace("#!");
  }

  // Rather than flood the browser history, use location.replace.
  function click(d) {
  	window.d = d;
    alert(d.name + "\nMenciones: " + d.count);
    location.replace("#" + encodeURIComponent(d === activeTopic ? "!" : d.name));
    d3.event.preventDefault();
  }

  // When hovering the label, highlight the associated node and vice versa.
  // When no topic is active, also cross-highlight with any mentions in excerpts.
  function mouseover(d) {
    node.classed("g-hover", function(p) { return p === d; });
    if (!activeTopic) d3.selectAll(".g-mention p").classed("g-hover", function(p) { return p.topic === d; });
  }

  // When hovering the label, highlight the associated node and vice versa.
  // When no topic is active, also cross-highlight with any mentions in excerpts.
  function mouseout(d) {
    node.classed("g-hover", false);
    if (!activeTopic) d3.selectAll(".g-mention p").classed("g-hover", false);
  }

  };
}
////////
    </script>
  </body>
</html>
