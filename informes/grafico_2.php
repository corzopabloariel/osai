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
    <script src="//d3js.org/d3.v4.min.js"></script>
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

    #main {
      width: 750px;
    }

    #sidebar {
      float: right;
      width: 100px;
    }

    #sequence {
      width: 600px;
      height: 70px;
    }

    #legend {
      padding: 10px 0 0 3px;
    }

    #sequence text, #legend text {
      font-weight: 600;
      fill: #fff;
    }

    #chart {
      position: relative;
    }

    #chart path {
      stroke: #fff;
    }

    #explanation {
      position: absolute;
      top: 260px;
      left: 305px;
      width: 140px;
      text-align: center;
      color: #666;
      z-index: -1;
    }

    #percentage {
      font-size: 2.5em;
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
        <div class="mx-auto pb-2" style="width:750px; font-size:20px; ">
          <select class="select__2" style="width:200px;" id="medio" data-allow-clear="true" data-placeholder="Seleccione MEDIO">
            <option value=""></option>
          </select>
        </div>
        <div id="main" class="mx-auto">
            <div id="sequence"></div>
            <div id="chart">
                <div id="explanation" style="visibility: hidden;"><span id="percentage"></span></div>
            </div>
        </div>
      </section>
    </span>


    <script type="text/javascript">
    // MEDIO / DESTAQUE / TEMA / FAVORABILIDAD / ACTOR
    getRandomColor = function() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 16)];
      return color;
    }
    noticias = {};
    min = window.localStorage.getItem("fecha_min");

    max = window.localStorage.getItem("fecha_max");
    noticiasprocesadas = userDATOS.busqueda(3,"noticia",false,"estado",0);
    if(Object.keys(noticiasprocesadas).length == 0) {
      userDATOS.notificacion("Sin datos para mostrar");
      $(document).ready(function() {
        $("#div").addClass("d-none");
      })
    } else {
    ///////
    for(var i in noticiasprocesadas) {
      e = noticiasprocesadas[i];
      noticiadestaque = userDATOS.busqueda(e.id_noticia,"noticiasproceso",false,"id_noticia");
      noticiadestaque_data = userDATOS.parseJSON(noticiadestaque.data);
      destaque = userDATOS.busqueda(noticiadestaque_data.select_destaque,"medio_destaque");
      if(destaque === null) continue;
      clientes = userDATOS.busqueda(e.id_noticia,"noticiascliente",false,"id_noticia",0);
      if(noticias[e["id_medio"]] === undefined) {
        medio = userDATOS.busqueda(e["id_medio"],"medio");
        $("#medio").append("<option value='" + e["id_medio"] + "'>" + medio.medio + "</option>")
        noticias[e["id_medio"]] = {}
        noticias[e["id_medio"]]["id"] = e["id_medio"];
        noticias[e["id_medio"]]["cantidad"] = 0
        noticias[e["id_medio"]]["destaques"] = {}
      }
      if(noticias[e["id_medio"]]["destaques"][destaque.id] === undefined) {
        nombre = destaque.lugar;
        if(destaque.destaque != "") nombre += " " + destaque.destaque
        noticias[e["id_medio"]]["destaques"][destaque.id] = {}
        noticias[e["id_medio"]]["destaques"][destaque.id]["id"] = destaque.id;
        noticias[e["id_medio"]]["destaques"][destaque.id]["nombre"] = nombre;
        noticias[e["id_medio"]]["destaques"][destaque.id]["cantidad"] = 0;
        noticias[e["id_medio"]]["destaques"][destaque.id]["temas"] = {};
      }
      for(var x in clientes) {
        c = userDATOS.busqueda(clientes[x]["id_cliente"],"actor",false,"id_cliente");
        if(c === null) continue;
        data = userDATOS.parseJSON(clientes[x]["tema"]);
        if(data !== null) {
          for(var y in data) {
            if(y == "texto") continue;
            id_tema = y.substring(9);
            if(id_tema == "") continue;
            if(parseInt(data[y]["valor"]) == 1) {
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] === undefined)
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] = {}
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["id"] = id_tema;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cantidad"] = 0;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cliente"] = {}
              }
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cliente"][c.id] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cliente"][c.id] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cliente"][c.id]["id"] = c.id
              }
              noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["positivo"]["cantidad"] ++;
            } else if(parseInt(data[y]["valor"]) == 0) {
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] === undefined)
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] = {}
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["id"] = id_tema;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cantidad"] = 0;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cliente"] = {};
              }
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cliente"][c.id] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cliente"][c.id] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cliente"][c.id]["id"] = c.id
              }
              noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["neutro"]["cantidad"] ++;
            } else {
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] === undefined)
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema] = {}
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["id"] = id_tema;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cantidad"] = 0;
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cliente"] = {};
              }
              if(noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cliente"][c.id] === undefined) {
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cliente"][c.id] = {}
                noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cliente"][c.id]["id"] = c.id
              }
              noticias[e["id_medio"]]["destaques"][destaque.id]["temas"][id_tema]["negativo"]["cantidad"] ++;
            }
          }
        }
      }
      ////
      noticias[e["id_medio"]]["cantidad"] ++
      noticias[e["id_medio"]]["destaques"][destaque.id]["cantidad"] ++;
    }
    console.log(noticias);

    d3.select(self.frameElement).style("height", "700px");
    $(document).ready(function() {
      $("#medio").select2();
      $("#medio").change(function() {
        ddataAUX = {};
        $("#sequence").html("")
        if($("#container").html() != "") $("#container").html("")
        // $("#chart").html('<div id="explanation" style="visibility: hidden;"><span id="percentage"></span></div>')
        id_medio = $(this).val();
        if(id_medio != "") {
          medio = userDATOS.busqueda(id_medio,"medio");
          ddataAUX["name"] = medio.medio;
          ddataAUX["children"] = [];
          for(var y in noticias[id_medio]["destaques"]) {
            e = noticias[id_medio]["destaques"][y];
            destaqueAUX = {}
            d = ddataAUX["children"].find(x => x["name"] === e["nombre"]);
            if(d === undefined) {
              destaqueAUX["name"] = e["nombre"];
              destaqueAUX["children"] = [];
            } else destaqueAUX = d;
            if(Object.keys(e["temas"]).length == 0) {
              d = destaqueAUX["children"].find(x => x["name"] === "Sin temas");
              temaAUX = {}
              if(d === undefined) {
                temaAUX["name"] = "Sin temas";
                temaAUX["size"] = 1;
              } else d["size"] ++;
              destaqueAUX["children"].push(temaAUX)
            } else {
              for(var t in e["temas"]) {
                temaDato = userDATOS.busqueda(t,"attr_temas");
                if(temaDato === null) continue;
                d = destaqueAUX["children"].find(x => x["name"] === temaDato["nombre"]);
                temaAUX = {}
                if(d === undefined) {
                  temaAUX["name"] = temaDato.nombre;
                  temaAUX["children"] = [];
                  d = temaAUX;
                } else temaAUX = d

                if(e["temas"][t]["negativo"] !== undefined) {
                  d = temaAUX["children"].find(x => x["name"] === "Negativo");
                  favorabilidadAUX = {}
                  if(d === undefined) {
                    favorabilidadAUX["name"] = "Negativo";
                    favorabilidadAUX["children"] = [];
                  } else favorabilidadAUX = d;
                  for(var cc in e["temas"][t]["negativo"]["cliente"]) {
                    cliente = userDATOS.busqueda(cc,"actor");
                    nombre = cliente.nombre + " " + cliente.apellido
                    d = favorabilidadAUX["children"].find(x => x["name"] === nombre);
                    if(d === undefined) {
                      clienteAUX = {}
                      clienteAUX["name"] = nombre
                      clienteAUX["size"] = 1;
                      favorabilidadAUX.children.push(clienteAUX);
                    } else d["size"] ++;
                  }
                }

                if(e["temas"][t]["positivo"] !== undefined) {
                  d = temaAUX["children"].find(x => x["name"] === "Positivo");
                  favorabilidadAUX = {}
                  if(d === undefined) {
                    favorabilidadAUX["name"] = "Positivo";
                    favorabilidadAUX["children"] = [];
                  } else favorabilidadAUX = d;
                  for(var cc in e["temas"][t]["positivo"]["cliente"]) {
                    cliente = userDATOS.busqueda(cc,"actor");
                    nombre = cliente.nombre + " " + cliente.apellido
                    d = favorabilidadAUX["children"].find(x => x["name"] === nombre);
                    if(d === undefined) {
                      clienteAUX = {}
                      clienteAUX["name"] = nombre
                      clienteAUX["size"] = 1;
                      favorabilidadAUX.children.push(clienteAUX);
                    } else d["size"] ++;
                  }
                }

                if(e["temas"][t]["neutro"] !== undefined) {
                  d = temaAUX["children"].find(x => x["name"] === "Neutro");
                  favorabilidadAUX = {}
                  if(d === undefined) {
                    favorabilidadAUX["name"] = "Neutro";
                    favorabilidadAUX["children"] = [];
                  } else favorabilidadAUX = d;
                  for(var cc in e["temas"][t]["neutro"]["cliente"]) {
                    cliente = userDATOS.busqueda(cc,"actor");
                    nombre = cliente.nombre + " " + cliente.apellido
                    d = favorabilidadAUX["children"].find(x => x["name"] === nombre);
                    if(d === undefined) {
                      clienteAUX = {}
                      clienteAUX["name"] = nombre
                      clienteAUX["size"] = 1;
                      favorabilidadAUX.children.push(clienteAUX);
                    } else d["size"] ++;
                  }
                }

                temaAUX.children.push(favorabilidadAUX)
                destaqueAUX.children.push(temaAUX);
              }
              ////////////
            }
            ddataAUX["children"].push(destaqueAUX);
          }

          createVisualization(ddataAUX);
        } else {

        }
      });
      $("#div").addClass("d-none");
    });


    // Dimensions of sunburst.
    var width = 750;
    var height = 600;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0;
    colors = []
    var vis = d3.select("#chart").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.partition()
        .size([2 * Math.PI, radius * radius]);

    var arc = d3.arc()
        .startAngle(function(d) { return d.x0; })
        .endAngle(function(d) { return d.x1; })
        .innerRadius(function(d) { return Math.sqrt(d.y0); })
        .outerRadius(function(d) { return Math.sqrt(d.y1); });

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(json) {

      // Basic setup of page elements.
      initializeBreadcrumbTrail();
      drawLegend();
      d3.select("#togglelegend").on("click", toggleLegend);

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

      // Turn the data into a d3 hierarchy and calculate the sums.
      var root = d3.hierarchy(json)
          .sum(function(d) { return d.size; })
          .sort(function(a, b) { return b.value - a.value; });

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition(root).descendants()
          .filter(function(d) {
              return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
          });

      var path = vis.data([json]).selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) {
            if (d['color']) {
              colors.push(d.color)
              return d.color;
            } else {
              color = getRandomColor();
              colors.push(color)
              d['color'] = color;
              return d['color'];
            }
          })
          .style("opacity", 1)
          .on("mouseover", mouseover);
      // Add the mouseleave handler to the bounding circle.
      d3.select("#container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.datum().value;
     };

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {
      var percentageText = "";
      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "%";
      if (percentage < 0.1) {
        percentageString = "< 0.1%";
      }
      if(d.depth == 1) percentageText = "<br><small>Destaque</small>";
      else if(d.depth == 2) percentageText = "<br><small>Tema</small>";
      else if(d.depth == 3) percentageText = "<br><small>Favorabilidad</small>";
      else if(d.depth == 4) percentageText = "<br><small>Actor</small>";
      d3.select("#percentage")
          .html(percentageString + percentageText);

      d3.select("#explanation")
          .style("visibility", "");

      var sequenceArray = d.ancestors().reverse();
      sequenceArray.shift(); // remove root node from the array
      updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave(d) {

      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .on("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

      d3.select("#explanation")
          .style("visibility", "hidden");
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#sequence").append("svg:svg")
          .attr("width", width)
          .attr("height", 50)
          .attr("id", "trail");
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    conteo = function(data) {
      if(data.depth == 1) return 0;
      else {
        return data.parent.data.name.length + conteo(data.parent);
      }
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {
      // Data join; key function combines name and depth (= position in sequence).
      var trail = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.data.name + d.depth; });

      // Remove exiting nodes.
      trail.exit().remove();

      // Add breadcrumb and label for entering nodes.
      var entering = trail.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) {
            if (d['color']) {
              colors.push(d.color)
              return d.color;
            } else {
              color = getRandomColor();
              d['color'] = color;
              colors.push(color)
              return d['color'];
            }
          });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.data.name; });

      // Merge enter and update selections; set position for all nodes.
      entering.merge(trail).attr("transform", function(d, i) {
        x = conteo(d)
        console.log(x);
        x = x * 4.56 + ( i == 0 ? 0 : 41 * d.depth)
        // x = d.parent.data.name.length * 10 * ( i == 0 ? 0 : 1);
        return "translate(" + b.w * i + ", 0)";
      });

      // Now move and update the percentage at the end.
      d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
          .style("visibility", "");

    }

    function drawLegend() {

      // Dimensions of legend item: width, height, spacing, radius of rounded rect.
      var li = {
        w: 75, h: 30, s: 3, r: 3
      };

      var legend = d3.select("#legend").append("svg:svg")
          .attr("width", li.w)
          .attr("height", d3.keys(colors).length * (li.h + li.s));

      var g = legend.selectAll("g")
          .data(d3.entries(colors))
          .enter().append("svg:g")
          .attr("transform", function(d, i) {
                  return "translate(0," + i * (li.h + li.s) + ")";
               });

      g.append("svg:rect")
          .attr("rx", li.r)
          .attr("ry", li.r)
          .attr("width", li.w)
          .attr("height", li.h)
          .style("fill", function(d) { return d.value; });

      g.append("svg:text")
          .attr("x", li.w / 2)
          .attr("y", li.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.key; });
    }

    function toggleLegend() {
      var legend = d3.select("#legend");
      if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
      } else {
        legend.style("visibility", "hidden");
      }
    }

    // Take a 2-column CSV and transform it into a hierarchical structure suitable
    // for a partition layout. The first column is a sequence of step names, from
    // root to leaf, separated by hyphens. The second column is a count of how
    // often that sequence occurred.
    function buildHierarchy(csv) {
      var root = {"name": "root", "children": []};
      for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
          continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
          var children = currentNode["children"];
          var nodeName = parts[j];
          var childNode;
          if (j + 1 < parts.length) {
       // Not yet at the end of the sequence; move down the tree.
     	var foundChild = false;
     	for (var k = 0; k < children.length; k++) {
     	  if (children[k]["name"] == nodeName) {
     	    childNode = children[k];
     	    foundChild = true;
     	    break;
     	  }
     	}
      // If we don't already have a child node for this branch, create it.
     	if (!foundChild) {
     	  childNode = {"name": nodeName, "children": []};
     	  children.push(childNode);
     	}
     	currentNode = childNode;
          } else {
     	// Reached the end of the sequence; create a leaf node.
     	childNode = {"name": nodeName, "size": size};
     	children.push(childNode);
          }
        }
      }
      return root;
    };
  }
    </script>
  </body>
</html>
