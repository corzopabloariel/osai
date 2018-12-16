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
    <script src="//d3js.org/d3.v3.min.js"></script>
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
text {
  font-size: 14px
}
.node {
  cursor: pointer;
  stroke: #444;
  stroke-width: 1px;
}

.label {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 20px;
  text-anchor: middle;
  text-shadow: 0 1px 0 #fafafa, 1px 0 0 #fafafa, -1px 0 0 #fafafa, 0 -1px 0 #fafafa;
}

.label,
.node--root,
.node--leaf {
  pointer-events: none;
}

.node--root {
  fill: white !important;
  stroke: #000;
  stroke-width: 1px;
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
        <h3 class="mb-0">Valoración de temas</h3>
        <div class="position-relative" id="grafico_1"></div>
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
$(document).ready(function() {
  temas = {};
  data = {};

  data["desde"] = window.localStorage.getItem("fecha_min");
  data["hasta"] = window.localStorage.getItem("fecha_max");
  noticiasactor = userDATOS.busquedaTabla("noticiasactor",data);
  if(Object.keys(noticiasactor).length == 0) userDATOS.notificacion("Sin datos entre las fechas<br/>" + data["desde"] + " y " + data["hasta"]);
  else {
    for(var i in noticiasactor) {
      actor = userDATOS.busqueda(noticiasactor[i]["id_actor"],"actor");
      if(actor.id_cliente == 0) continue;
    	noticiacliente = userDATOS.busqueda(actor.id_cliente,"noticiascliente",false,"id_cliente")
      data = userDATOS.parseJSON(noticiacliente.tema)
    	for(var x in data) {
    		if(x == "texto") continue;
    		id_tema = x.substring(9)
    		if(temas[id_tema] === undefined) {
    			tema = userDATOS.busqueda(id_tema,"attr_temas")
    			temas[id_tema] = {}
    			temas[id_tema]["nombre"] = tema.nombre
        }
    		if(parseInt(data[x]["valor"]) == 1) {
    			if(temas[id_tema]["positivo"] === undefined) temas[id_tema]["positivo"] = 0
    			temas[id_tema]["positivo"] ++;
        }
    		if(parseInt(data[x]["valor"]) == 0) {
    			if(temas[id_tema]["neutro"] === undefined) temas[id_tema]["neutro"] = 0
    			temas[id_tema]["neutro"] ++;
        }
    		if(parseInt(data[x]["valor"]) == -1) {
    			if(temas[id_tema]["negativo"] === undefined) temas[id_tema]["negativo"] = 0
    			temas[id_tema]["negativo"] ++;
        }
      }
    }

    aux = {}
    aux["name"] = "Valoración";
    aux["children"] = [];
    for(var x in temas) {
      valorPOS = valorNEU = valorNEG = 0;
      if(temas[x]["positivo"] !== undefined) valorPOS = temas[x]["positivo"]
      if(temas[x]["neutro"] !== undefined) valorNEU = temas[x]["neutro"]
      if(temas[x]["negativo"] !== undefined) valorNEG = temas[x]["negativo"]
      tema = {}
      tema["name"] = temas[x]["nombre"];
      flag = false;
      if(valorPOS != 0) {
        valoracion = aux["children"].find(x => x["name"] === "Positivo");
        if(valoracion === undefined) {
          valoracion = {}
          valoracion["name"] = "Positivo";
          valoracion["color"] = "#28a745";
          valoracion["children"] = [];
          flag = true;
        }

        tema["color"] = "#218838";
        tema["size"] = valorPOS ;
        valoracion["children"].push(tema)
      }
      if(valorNEU != 0) {
        valoracion = aux["children"].find(x => x["name"] === "Neutro");
        if(valoracion === undefined) {
          valoracion = {}
          valoracion["name"] = "Neutro";
          valoracion["color"] = "#ffc107";
          valoracion["children"] = [];
          flag = true;
        }

        tema["color"] = "#d39e00";
        tema["size"] = valorNEU;
        valoracion["children"].push(tema)
      }
      if(valorNEG != 0) {
        valoracion = aux["children"].find(x => x["name"] === "Negativo");
        if(valoracion === undefined) {
          valoracion = {}
          valoracion["name"] = "Negativo";
          valoracion["color"] = "#dc3545";
          valoracion["children"] = [];
          flag = true;
        }

        tema["color"] = "#c82333";
        tema["size"] = valorNEG ;
        valoracion["children"].push(tema)
      }
      if(flag) aux["children"].push(valoracion)
    }
    ///////////////
    html = "";
    ///////////////////// Funciones básicas
    var margin = 20,
      diameter = 960;

    var calculateTextFontSize = function(d) {
      return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 11) + "px";
    }
    var color = d3.scale.linear()
      .domain([-1, 18])
      .interpolate(d3.interpolateHcl);
    //////////////////////////////
    grafico_GLOBO("#grafico_1",aux,diameter,margin);
  }

  d3.select(self.frameElement).style("height", diameter + "px");
  //////////////////////////////////////////

  //////////////////////////////////////////
  $("#div").addClass("d-none");
});
grafico_GLOBO = function(target,data,diameter,margin) {
  let pack = d3.layout.pack().padding(2).size([diameter - margin, diameter - margin]).value(function(d) { return d.size; })
  let circleFill = function(d) {
    if (d['color']) return d.color;
    else return d.children ? "#DEDEDE" : getRandomColor();
  }

  let svg = d3.select(target).append("svg")
    .attr("width", window.innerWidth)
    .attr("height", diameter)
    .append("g")
    .attr("transform", "translate(" + window.screen.width / 2 + "," + diameter / 2 + ")");
  let root = data
  let focus = root,
    nodes = pack(root),
    view;
  let circle = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) {
      return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    })
    .style("fill", circleFill)
    .on("click", function(d) {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  circle.append("svg:title").text(function(d) {
    texto = d.name;
    if(d.size !== undefined) texto += " (" + d.size + ")";
    return texto;
  })

  let text = svg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
      return d.parent === root ? 1 : 0;
      // return 1;
    })
    .style("display", function(d) {
      return d.parent === root ? null : "none";
      // return null;
    })
    .text(function(d) {
      texto = d.name;
      if(d.size !== undefined) texto += " (" + d.size + ")";
      return texto;
    })
    .style("font-size", "18px")
    .attr("dy", ".35em");

  let node = svg.selectAll("circle,text");

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  d3.select(target)
    .on("click", function() {
      zoom(root);
    });

  function zoom(d) {
    var focus0 = focus;
    focus = d;

    let transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        let i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
        return function(t) {
          zoomTo(i(t));
        };
      });

    transition.selectAll("text")
      .filter(function(d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function(d) {
        return d.parent === focus ? 1 : 0;
        // return 1;
      })
      .each("start", function(d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .each("end", function(d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    let k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function(d) {
      return d.r * k;
    });
  }
}
    </script>
  </body>
</html>
