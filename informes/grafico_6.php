<?php
session_start();
$name = "";
$v = 0;
if(isset($_SESSION["user_name"])) {
  if($_SESSION["user_lvl"] > 2 || !isset($_GET["v"])) header ("Location: ../principal.html");
  $name = $_SESSION["user_name"];
  $v = $_GET["v"];
} else
  header ("Location: ../index.html");
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
    <script src="https://d3js.org/d3.v4.min.js"></script>
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
    .axis .domain {
      display: none;
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
        <svg width="100%" height="500"></svg>
      </section>
    </span>


    <script type="text/javascript">
////////////////////
version = <?php echo $v ?>;
if(version == 3) {
  instituciones = {};
  noticiasinstitucion = userDATOS.busquedaTabla("noticiasinstitucion");
  for(var i in noticiasinstitucion) {
    aux = userDATOS.busqueda(noticiasinstitucion[i]["id_institucion"],"attr_institucion");
    data = userDATOS.parseJSON(noticiasinstitucion[i]["data"]);
    if(instituciones[aux.id] === undefined) {
      instituciones[aux.id] = {};
      instituciones[aux.id]["nombre"] = aux.nombre;
    }
    if(parseInt(data["frm_valor"]) == 1) {
      if(instituciones[aux.id]["positivo"] === undefined) instituciones[aux.id]["positivo"] = 0;
      instituciones[aux.id]["positivo"] ++;
    }
    if(parseInt(data["frm_valor"]) == 0) {
      if(instituciones[aux.id]["neutro"] === undefined) instituciones[aux.id]["neutro"] = 0;
      instituciones[aux.id]["neutro"] ++;
    }
    if(parseInt(data["frm_valor"]) == -1) {
      if(instituciones[aux.id]["negativo"] === undefined) instituciones[aux.id]["negativo"] = 0;
      instituciones[aux.id]["negativo"] ++;
    }
  }
} else {
  noticiasactor = userDATOS.busquedaTabla("noticiasactor");
  temas = actores = noticias = medios = {};
  for(var i in noticiasactor) {
    aux = userDATOS.busqueda(noticiasactor[i]["id_actor"],"actor");
    if(version == 1) {
      clientes = userDATOS.busqueda(aux.id_cliente,"noticiascliente",false,"id_cliente",0);

      for(var cliente in clientes) {
        temasAUX = userDATOS.parseJSON(clientes[cliente].tema);
        for(var y in temasAUX) {
          if(y == "texto") continue;
          id_tema = y.substring(9);
          if(id_tema == "" || id_tema == "NULL") continue;
          id_tema = parseInt(id_tema);
          if(isNaN(id_tema)) continue;
          t = userDATOS.busqueda(id_tema,"attr_temas");
          if(temas[id_tema] === undefined) {
            temas[id_tema] = {};
            temas[id_tema]["nombre"] = t.nombre;
            temas[id_tema]["cantidad"] = 0;
          }
          if(parseInt(temasAUX[y]["valor"]) == 0) {
            if(temas[id_tema]["neutro"] === undefined) temas[id_tema]["neutro"] = 0
            temas[id_tema]["neutro"] ++;
          }
          if(parseInt(temasAUX[y]["valor"]) == 1) {
            if(temas[id_tema]["positivo"] === undefined) temas[id_tema]["positivo"] = 0
            temas[id_tema]["positivo"] ++;
          }
          if(parseInt(temasAUX[y]["valor"]) == -1) {
            if(temas[id_tema]["negativo"] === undefined) temas[id_tema]["negativo"] = 0
            temas[id_tema]["negativo"] ++;
          }
          temas[id_tema]["cantidad"] ++;
        }
      }
    } else if(version == 2) {
      aux = userDATOS.busqueda(noticiasactor[i]["id_actor"],"actor");
      data = userDATOS.parseJSON(noticiasactor[i]["data"])
      if(data["frm_valor"] === undefined) continue;
      if(actores[aux.id] === undefined) {
        actores[aux.id] = {}
        actores[aux.id]["nombre"] = aux.nombre + " " + aux.apellido;
      }
      if(parseInt(data["frm_valor"]) == 1) {
        if(actores[aux.id]["positivo"] === undefined) actores[aux.id]["positivo"] = 0;
        actores[aux.id]["positivo"] ++;
      }
      if(parseInt(data["frm_valor"]) == 0) {
        if(actores[aux.id]["neutro"] === undefined) actores[aux.id]["neutro"] = 0;
        actores[aux.id]["neutro"] ++;
      }
      if(parseInt(data["frm_valor"]) == -1) {
        if(actores[aux.id]["negativo"] === undefined) actores[aux.id]["negativo"] = 0;
        actores[aux.id]["negativo"] ++;
      }
    } else if(version == 4) {
      data = userDATOS.parseJSON(noticiasactor[i]["data"]);
      if(parseInt(data["frm_valor"]) == 1) {
        if(noticias["positivo"] === undefined) noticias["positivo"] = 0;
        noticias["positivo"] ++;
      }
      if(parseInt(data["frm_valor"]) == 0) {
        if(noticias["neutro"] === undefined) noticias["neutro"] = 0;
        noticias["neutro"] ++;
      }
      if(parseInt(data["frm_valor"]) == -1) {
        if(noticias["negativo"] === undefined) noticias["negativo"] = 0;
        noticias["negativo"] ++;
      }
    } else if(version == 5) {
      noticia = userDATOS.busqueda(noticiasactor[i]["id_noticia"],"noticia",false,"id_noticia");
      medio = userDATOS.busqueda(noticia.id_medio,"medio");
      data = userDATOS.parseJSON(noticiasactor[i]["data"]);
      if(medios[medio.id] === undefined) {
	      medios[medio.id] = {};
        medios[medio.id]["nombre"] = medio.medio;
      }
      if(parseInt(data["frm_valor"]) == 1) {
        if(medios[medio.id]["positivo"] === undefined) medios[medio.id]["positivo"] = 0;
        medios[medio.id]["positivo"] ++;
      }
      if(parseInt(data["frm_valor"]) == 0) {
        if(medios[medio.id]["neutro"] === undefined) medios[medio.id]["neutro"] = 0;
        medios[medio.id]["neutro"] ++;
      }
      if(parseInt(data["frm_valor"]) == -1) {
        if(medios[medio.id]["negativo"] === undefined) medios[medio.id]["negativo"] = 0;
        medios[medio.id]["negativo"] ++;
      }
    }
  }
}
// {
//   "State": "CA",
//   "Under 5 Years": 2704659,
//   "5 to 13 Years": 4499890,
//   "14 to 17 Years": 2159981
// },
data = [];
if(version == 1) {
  for(var x in temas) {
    aux = {};
    aux["tema"] = temas[x]["nombre"];
    if(temas[x]["positivo"] !== undefined) aux["Positivo"] = temas[x]["positivo"];
    else aux["Positivo"] = 0;
    if(temas[x]["neutro"] !== undefined) aux["Neutro"] = temas[x]["neutro"];
    else aux["Neutro"] = 0;
    if(temas[x]["negativo"] !== undefined) aux["Negativo"] = temas[x]["negativo"];
    else aux["Negativo"] = 0;
    data.push(aux);
  }
} else if(version == 2) {
  for(var x in actores) {
    aux = {}
    aux["tema"] = actores[x]["nombre"];
    if(actores[x]["positivo"] !== undefined) aux["Positivo"] = actores[x]["positivo"];
    else aux["Positivo"] = 0;
    if(actores[x]["neutro"] !== undefined) aux["Neutro"] = actores[x]["neutro"];
    else aux["Neutro"] = 0;
    if(actores[x]["negativo"] !== undefined) aux["Negativo"] = actores[x]["negativo"];
    else aux["Negativo"] = 0;
    data.push(aux);
  }
} else if(version == 3) {
  for(var x in instituciones) {
    aux = {}
    aux["tema"] = instituciones[x]["nombre"];
    if(instituciones[x]["positivo"] !== undefined) aux["Positivo"] = instituciones[x]["positivo"];
    else aux["Positivo"] = 0;
    if(instituciones[x]["neutro"] !== undefined) aux["Neutro"] = instituciones[x]["neutro"];
    else aux["Neutro"] = 0;
    if(instituciones[x]["negativo"] !== undefined) aux["Negativo"] = instituciones[x]["negativo"];
    else aux["Negativo"] = 0;
    data.push(aux);
  }
} else if(version == 4) {
  aux = {}
  aux["tema"] = "Noticias";
  if(noticias["positivo"] !== undefined) aux["Positivo"] = noticias["positivo"]
  else aux["Positivo"] = 0;
  if(noticias["neutro"] !== undefined) aux["Neutro"] = noticias["neutro"]
  else aux["Neutro"] = 0;
  if(noticias["negativo"] !== undefined) aux["Negativo"] = noticias["negativo"]
  else aux["Negativo"] = 0;

  data.push(aux);
} else if(version == 5) {
  for(var x in medios) {
    aux = {}
    aux["tema"] = medios[x]["nombre"];
    if(medios[x]["positivo"] !== undefined) aux["Positivo"] = medios[x]["positivo"];
    else aux["Positivo"] = 0;
    if(medios[x]["neutro"] !== undefined) aux["Neutro"] = medios[x]["neutro"];
    else aux["Neutro"] = 0;
    if(medios[x]["negativo"] !== undefined) aux["Negativo"] = medios[x]["negativo"];
    else aux["Negativo"] = 0;
    data.push(aux);
  }
}
////////////////////
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +window.innerWidth - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#28a745", "#ffc107", "#dc3545"]);

data["columns"] = [];
data.columns = Object.keys(data[0])
  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.tema; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.tema) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) {
      return {key: key, value: d[key]}; });
    })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Menciones");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
////////////////////
$(document).ready(function() {
  $("#div").addClass("d-none");
})
    </script>
  </body>
</html>
