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
        <script>
        getRandomColor = function() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++)
            color += letters[Math.floor(Math.random() * 16)];
          return color;
        }
        var dates = {
          convert:function(d) {
            return (
                d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0],d[1],d[2]) :
                d.constructor === Number ? new Date(d) :
                d.constructor === String ? new Date(d) :
                typeof d === "object" ? new Date(d.year,d.month,d.date) :
                NaN
            );
          },
          compare:function(a,b) {
            return ((a.getTime() === b.getTime()) ? 0 : ((a.getTime() > b.getTime()) ? 1 : - 1));
          }
        }
        data = {};
        actores = {};
        noticias = {};
        data["desde"] = window.localStorage.getItem("fecha_min");
        data["hasta"] = window.localStorage.getItem("fecha_max");
        dataAUX = dataAUX_2 = dataAUX_3 = undefined;
        noticiasactor = userDATOS.busquedaTabla("noticiasactor",data);
        if(Object.keys(noticiasactor).length == 0) userDATOS.notificacion("Sin datos entre las fechas<br/>" + data["desde"] + " y " + data["hasta"]);
        else {
          for(var i in noticiasactor) {
            actor = userDATOS.busqueda(noticiasactor[i]["id_actor"],"actor");
            if(actor.id_cliente == 0) continue;
            data = userDATOS.parseJSON(noticiasactor[i]["data"])
            if(actores[noticiasactor[i]["id_actor"]] === undefined) {
              cliente = userDATOS.busqueda(actor.id_cliente,"cliente");
              actores[noticiasactor[i]["id_actor"]] = {}
              actores[noticiasactor[i]["id_actor"]]["id"] = noticiasactor[i]["id_actor"]
              actores[noticiasactor[i]["id_actor"]]["cantidad"] = 0;
              actores[noticiasactor[i]["id_actor"]]["nombre"] = actor.nombre + " " + actor.apellido;
              actores[noticiasactor[i]["id_actor"]]["emisor"] = 0;
              actores[noticiasactor[i]["id_actor"]]["imagen"] = 0;
              actores[noticiasactor[i]["id_actor"]]["valor"] = {};
              actores[noticiasactor[i]["id_actor"]]["valor"]["positivo"] = 0;
              actores[noticiasactor[i]["id_actor"]]["valor"]["neutro"] = 0;
              actores[noticiasactor[i]["id_actor"]]["valor"]["negativo"] = 0;
              actores[noticiasactor[i]["id_actor"]]["campo"] = userDATOS.parseJSON(actor.id_campo);//oficialismo
              actores[noticiasactor[i]["id_actor"]]["partido"] = userDATOS.parseJSON(actor.id_partido);//partido
              actores[noticiasactor[i]["id_actor"]]["alianza"] = userDATOS.parseJSON(actor.id_alianza);//alianza

              if(actores[noticiasactor[i]["id_actor"]]["cliente"] === undefined) {
                actores[noticiasactor[i]["id_actor"]]["cliente"] = cliente.id;
                aux = userDATOS.busqueda(cliente.id,"noticiascliente",false,"id_cliente",0)
                actores[noticiasactor[i]["id_actor"]]["cliente_noticias"] = aux;
              }
            }

            actores[noticiasactor[i]["id_actor"]]["cantidad"] ++;
            actores[noticiasactor[i]["id_actor"]]["emisor"] += parseInt(data.frm_emisor);
            actores[noticiasactor[i]["id_actor"]]["imagen"] += parseInt(data.frm_img);
            if(data["frm_valor"] !== undefined) {
              switch(parseInt(data["frm_valor"])) {
                case 1:
                  actores[noticiasactor[i]["id_actor"]]["valor"]["positivo"] ++;
                break;
                case 0:
                  actores[noticiasactor[i]["id_actor"]]["valor"]["neutro"] ++;
                break;
                case -1:
                  actores[noticiasactor[i]["id_actor"]]["valor"]["negativo"] ++;
                break;
              }
            }
          }
        }
        </script>
        <?php
        if($v == 1) {
        ?>
          <h3 class="mb-0">Temas por Actor</h3>
          <div class="position-relative" id="grafico_1">
              <div id="etiquetas" class="position-absolute border border-right-0 bg-light p-2" style="right:0; top:0;">
                <h3>Etiquetas</h3>
              </div>
          </div>
          <script>
          dataAUX = {};
          dataAUX["name"] = "Unidades de Análisis";
          dataAUX["children"] = [];
          ARR_background = {}
          colorAUX = [];
          for(var x in actores) {
            aux = {}
            aux["name"] = actores[x]["nombre"];
            aux["children"] = [];

            if(actores[x]["partido"].length != 0) {
              for(var p in actores[x]["partido"]) {
                partido = userDATOS.busqueda(actores[x]["partido"][p],"attr_partido");
                aux["color"] = partido.color;//
              }
            }

            for(var y in actores[x]["cliente_noticias"]) {
              e = actores[x]["cliente_noticias"][y];
              data = userDATOS.parseJSON(e.tema);
              if(data !== null) {
                for(var i in data) {
                  auxTemas = {}
                  id_tema = i.substring(9);
                  if(id_tema == "") continue;
                  tema = userDATOS.busqueda(id_tema,"attr_temas");
                  if(tema === null) continue;
                  if(ARR_background[id_tema] === undefined) {
                    do {
                      color = getRandomColor();
                    } while(colorAUX.indexOf(color) > 0);
                    ARR_background[id_tema] = {}
                    ARR_background[id_tema]["color"] = color;
                    ARR_background[id_tema]["nombre"] = tema.nombre;
                  }
                  d = aux["children"].find(x => x["name"] === tema.nombre);
                  if(d === undefined) {
                    auxTemas["name"] = tema.nombre
                    auxTemas["size"] = 1;
                    auxTemas["color"] = ARR_background[id_tema]["color"];
                    aux["children"].push(auxTemas)
                  } else d["size"] ++;
                }
              }
            }

            dataAUX["children"].push(aux)
          }
          ///////////////
          html = "";
          for(var i in ARR_background) {
            html += "<p class='m-0'><span class='d-inline px-2 mr-1' style='background:" + ARR_background[i]["color"] + "'></span>" + ARR_background[i]["nombre"] + "</p>"
          }
          $("#etiquetas").append(html);
          </script>
        <?php
        }
        if($v == 2) {
        ?>
          <h3 class="mb-0">Oposición / Oficialismo</h3>
          <div class="position-relative" id="grafico_2"></div>
          <script>
          dataAUX_2 = {};
          dataAUX_2["name"] = "Oposición / Oficialismo";
          dataAUX_2["children"] = [];
          ARR_background = {}
          colorAUX = [];

          for(var x in actores) {
            if(actores[x]["alianza"].length != 0) {
              for(var a in actores[x]["alianza"]) {
                alianza = userDATOS.busqueda(actores[x]["alianza"][a],"attr_alianza");
                d = dataAUX_2["children"].find(x => x["name"] === alianza.nombre);
                if(d === undefined) {
                  aux_2 = {}
                  aux_2["name"] = alianza.nombre;
                  aux_2["size"] = 1;
                  dataAUX_2["children"].push(aux_2);
                } else d["size"] ++;
              }
            } else {
              d = dataAUX_2["children"].find(x => x["name"] === "Sin alianza");
              if(d === undefined) {
                aux_2 = {}
                aux_2["name"] = "Sin alianza";
                aux_2["size"] = 1;
                dataAUX_2["children"].push(aux_2);
              } else d["size"] ++;
            }
          }
          </script>
        <?php
        }
        if($v == 4) {
        ?>
          <h3 class="mb-0">Partido político</h3>
          <div class="position-relative" id="grafico_3"></div>
          <script>
          dataAUX_3 = {};
          dataAUX_3["name"] = "Partido político";
          dataAUX_3["children"] = [];
          ARR_background = {}
          colorAUX = [];
          for(var x in actores) {
            if(actores[x]["partido"].length != 0) {
              for(var p in actores[x]["partido"]) {
                partido = userDATOS.busqueda(actores[x]["partido"][p],"attr_partido");
                d = dataAUX_3["children"].find(x => x["name"] === partido.nombre);
                if(d === undefined) {
                  if(partido.color === null) partido["color"] = "#DEDEDE";
                  if(colorAUX.indexOf(partido.color) < 0) colorAUX.push(partido.color)
                  aux_3 = {}
                  aux_3["name"] = partido.nombre;
                  aux_3["color"] = partido.color;
                  aux_3["size"] = 1;
                  dataAUX_3["children"].push(aux_3);
                } else d["size"] ++;
              }
            } else {
              d = dataAUX_3["children"].find(x => x["name"] === "Sin partido");
              if(d === undefined) {
                aux_3 = {}
                aux_3["name"] = "Sin partido";
                aux_3["size"] = 1;
                dataAUX_3["children"].push(aux_3);
              } else d["size"] ++;
            }
          }
          </script>
        <?php } ?>
      </section>
    </span>


    <script type="text/javascript">
///////////////////// Funciones básicas
var margin = 20,
  //diameter = 960;
  // obtengo el ancho de la pantalla y coloco la mitad de ese valor
  diameter = window.innerWidth / 2;

var calculateTextFontSize = function(d) {
  return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 11) + "px";
}
var color = d3.scale.linear().domain([-1, 18]).interpolate(d3.interpolateHcl);
$(document).ready(function() {
  console.log(dataAUX !== undefined);
  //////////////////////////////
  if(dataAUX !== undefined) grafico_GLOBO("#grafico_1",dataAUX,diameter,margin);

  if(dataAUX_2 !== undefined) grafico_GLOBO("#grafico_2",dataAUX_2,diameter,margin);

  if(dataAUX_3 !== undefined) grafico_GLOBO("#grafico_3",dataAUX_3,diameter,margin);

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
