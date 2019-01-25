/**
 *  Copyright (C) 2016 José Miguel Cotrino Benavides
 *  
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var serverUrl = "http://localhost:8080/do";
window.paleta_de_colores = ['AliceBlue','AntiqueWhite','Aqua','Aquamarine','Azure','Beige','Bisque','Black','BlanchedAlmond','Blue','BlueViolet','Brown','BurlyWood','CadetBlue','Chartreuse','Chocolate','Coral','CornflowerBlue','Cornsilk','Crimson','Cyan','DarkBlue','DarkCyan','DarkGoldenRod','DarkGray','DarkGrey','DarkGreen','DarkKhaki','DarkMagenta','DarkOliveGreen','DarkOrange','DarkOrchid','DarkRed','DarkSalmon','DarkSeaGreen','DarkSlateBlue','DarkSlateGray','DarkSlateGrey','DarkTurquoise','DarkViolet','DeepPink','DeepSkyBlue','DimGray','DimGrey','DodgerBlue','FireBrick','FloralWhite','ForestGreen','Fuchsia','Gainsboro','GhostWhite','Gold','GoldenRod','Gray','Grey','Green','GreenYellow','HoneyDew','HotPink','IndianRed','Indigo','Ivory','Khaki','Lavender','LavenderBlush','LawnGreen','LemonChiffon','LightBlue','LightCoral','LightCyan','LightGoldenRodYellow','LightGray','LightGrey','LightGreen','LightPink','LightSalmon','LightSeaGreen','LightSkyBlue','LightSlateGray','LightSlateGrey','LightSteelBlue','LightYellow','Lime','LimeGreen','Linen','Magenta','Maroon','MediumAquaMarine','MediumBlue','MediumOrchid','MediumPurple','MediumSeaGreen','MediumSlateBlue','MediumSpringGreen','MediumTurquoise','MediumVioletRed','MidnightBlue','MintCream','MistyRose','Moccasin','NavajoWhite','Navy','OldLace','Olive','OliveDrab','Orange','OrangeRed','Orchid','PaleGoldenRod','PaleGreen','PaleTurquoise','PaleVioletRed','PapayaWhip','PeachPuff','Peru','Pink','Plum','PowderBlue','Purple','RebeccaPurple','Red','RosyBrown','RoyalBlue','SaddleBrown','Salmon','SandyBrown','SeaGreen','SeaShell','Sienna','Silver','SkyBlue','SlateBlue','SlateGray','SlateGrey','Snow','SpringGreen','SteelBlue','Tan','Teal','Thistle','Tomato','Turquoise','Violet','Wheat','White','WhiteSmoke','Yellow','YellowGreen'];
window.paleta_de_colores = shuffle(window.paleta_de_colores);
window.color_tmp = [];


function askUser() {
	
	$("#userSelection").html("<div id='message'>Loading users...</div>");
	$("#content").html("");
	
	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "text/html; charset=UTF-8",
		contentType : "text/html",
		data : {
			action : "userList"
		},
		success : function(data, textStatus, jqXHR) {
			//console.log(data, textStatus);
			var content = "<p>Select user: <select id='userId'><option value='0'>New user...</option>";
			var userList = JSON.parse(data);
			for(var k in userList) {
				var user = userList[k];
				content += "<option value='"+user.id+"'>"+user.name+"</option>";
			}
			content += "</select> "
				+ "<button id='start' onclick='submitUser();'>Start</button> "
				+ "Name for new user: <input type='text' id='userName' name='userName'/>"
				+ "</p>";
			$("#userSelection").html(content);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
			$("#userSelection").html(errorThrown);
		},
		cache : false
	});
	
}

function submitUser() {
	
	var userName = $("#userName").val();
	var userId = $("#userId").val();
	
	if( userId == 0 && (userName == null || userName.length == 0) ) {
		alert("Please enter a valid user name!");
		return;
	}
	
	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "text/html; charset=UTF-8",
		contentType : "text/html",
		data : {
			action : "userSelect",
			userId : userId,
			userName : userName
		},
		success : function(data, textStatus, jqXHR) {
			var content = "<div id='message'>Playing as "+data+"</div>"
			+ "<div id='question'></div><div id='answer'></div>"
			+ "<div><p><button onclick='showPageGraph();'>Show page knowledge graph</button>"
			+ "<button onclick='showCategoryGraph();'>Show category knowledge graph</button></p></div>"
			+ "<div id='knowledgegraph'></div>";
			$("#content").html(content);
			askQuestion();
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
			$("#content").html(errorThrown);
		},
		cache : false
	});	
	
}

function askQuestion() {

	$("#question").html("");
	$("#answer").html("");

	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "text/html; charset=UTF-8",
		contentType : "text/html",
		data : {
			action : "ask"
		},
		success : function(data, textStatus, jqXHR) {
			// console.log(data, textStatus)
			$("#question").html(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
			$("#question").html(errorThrown);
		},
		cache : false
	});

}

function submitAnswer() {

	var answer = $("#userAnswer").val();
	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "text/html; charset=UTF-8",
		contentType : "text/html",
		data : {
			action : "answer",
			answer : answer
		},
		success : function(data, textStatus, jqXHR) {
			// console.log(data, textStatus)
			$("#answer").html(data);
			$("#sendAnswer").attr("disabled", true);
		},
		error : function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
			$("#answer").html(errorThrown);
		},
		cache : false
	});

}

function showPageGraph() {

	$("#knowledgegraph").html("Loading...");

	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "application/json; charset=UTF-8",
		contentType : "application/json",
		data : {
			action : "pageGraph"
		},
		success : function(data, textStatus, jqXHR) {
			$("#knowledgegraph").html("");
			drawGraph(JSON.parse(data));
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$("#knowledgegraph").html(errorThrown);
			console.log(jqXHR, textStatus, errorThrown);
		},
		cache : false
	});

}

function showCategoryGraph() {

	$("#knowledgegraph").html("Loading...");

	$.ajax({
		url : serverUrl,
		type : "GET",
		dataType : "text",
		accepts : "application/json; charset=UTF-8",
		contentType : "application/json",
		data : {
			action : "categoryGraph"
		},
		success : function(data, textStatus, jqXHR) {
			$("#knowledgegraph").html("");
			drawBubbleGraph(JSON.parse(data));
		},
		error : function(jqXHR, textStatus, errorThrown) {
			$("#knowledgegraph").html(errorThrown);
			console.log(jqXHR, textStatus, errorThrown);
		},
		cache : false
	});

}

function drawBubbleGraph(root) {

	var diameter = screen.width / 2, margin = 20;

	var pack = d3.layout.pack().padding(2).size(
			[ diameter - margin, diameter - margin ]).value(function(d) {
		return d.rank;
	})

	var svg = d3.select('#knowledgegraph').append("svg")
			.attr("width", diameter).attr("height", diameter).append("g").attr(
					"transform",
					"translate(" + diameter / 2 + "," + diameter / 2 + ")");

	var focus = root, nodes = pack.nodes(root), view;

	var maxWeight = d3.max(nodes, function(d) {
		return +d.weight;
	});
	var minWeight = d3.min(nodes, function(d) {
		return +d.weight;
	});
	
	var color = function(i){
		if(typeof(i) == "string") return i;
		else return window.paleta_de_colores[i];	
	};
	
	/*var color = d3.scale.linear().domain([ minWeight, 0, window.paleta_de_colores.length ]).interpolate(
			d3.interpolateHsl).range( window.paleta_de_colores );*/

	var circle = svg.selectAll("circle").data(nodes).enter().append("circle")
			.attr(
					"class",
					function(d) {
						return d.parent ? d.children ? "node"
								: "node node--leaf" : "node node--root";
					}).style("fill", function(d) {
				return color(d.weight);
			}).on("click", function(d) {
				if (focus !== d)
					zoom(d), d3.event.stopPropagation();
			});

	var text = svg.selectAll("text").data(nodes).enter().append("text").attr(
			"class", "label").style("fill-opacity", function(d) {
		return d.parent === root ? 1 : 0;
	}).style("display", function(d) {
		return d.parent === root ? "inline" : "none";
	}).text(function(d) {
		return d.name;
	});

	var node = svg.selectAll("circle,text");

	d3.select('#knowledgegraph').on("click", function() {
		zoom(root);
	});

	zoomTo([ root.x, root.y, root.r * 2 + margin ]);

	function zoom(d) {
		var focus0 = focus;
		focus = d;

		var transition = d3.transition().duration(d3.event.altKey ? 7500 : 750)
				.tween(
						"zoom",
						function(d) {
							var i = d3.interpolateZoom(view, [ focus.x,
									focus.y, focus.r * 2 + margin ]);
							return function(t) {
								zoomTo(i(t));
							};
						});

		transition.selectAll("text").filter(function(d) {
			return d.parent === focus || this.style.display === "inline";
		}).style("fill-opacity", function(d) {
			return d.parent === focus ? 1 : 0;
		}).each("start", function(d) {
			if (d.parent === focus)
				this.style.display = "inline";
		}).each("end", function(d) {
			if (d.parent !== focus)
				this.style.display = "none";
		});
	}

	function zoomTo(v) {
		var k = diameter / v[2];
		view = v;
		node.attr("transform", function(d) {
			return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k
					+ ")";
		});
		circle.attr("r", function(d) {
			return d.r * k;
		});
	}

}

function drawGraph(jsonData) {

	var width = 600, height = 400;

	var svg = d3.select('#knowledgegraph').append('svg').attr('width', width)
			.attr('height', height);

	var force = d3.layout.force().charge(-30).size([ width, height ])
			.linkDistance(5).linkStrength(0.1).nodes(jsonData.nodes).links(
					jsonData.edges);

	var link = svg.selectAll('.link').data(jsonData.edges).enter().append(
			'line').attr('class', 'link');

	var node = svg.selectAll(".node").data(jsonData.nodes).enter().append("g")
			.attr("class", "node").call(force.drag);

	var maxWeight = d3.max(jsonData.nodes, function(d) {
		return +d.weight;
	});
	var minWeight = d3.min(jsonData.nodes, function(d) {
		return +d.weight;
	});
	console.log("Weight: " + minWeight + "," + maxWeight);
	var maxRank = d3.max(jsonData.nodes, function(d) {
		return +d.rank;
	});
	var minRank = d3.min(jsonData.nodes, function(d) {
		return +d.rank;
	});
	console.log("Rank: " + minRank + "," + maxRank);

	var color = d3.scale.linear().domain([ minWeight, 0, maxWeight ])
			// .interpolate(d3.interpolateHsl).range([ "red", "yellow", "green" ]);
			.interpolate(d3.interpolateHsl).range( window.paleta_de_colores );
			
	var size = d3.scale.linear().domain([ minRank, maxRank ]).range(
			[ 5, 30 ]);

	var circle = node.append("circle").attr("r", function(d) {
		return size(d.rank);
	}).attr("fill", function(d) {
		return color(d.weight);
	});

	var label = node.append("text").attr("dy", ".35em").text(function(d) {
		return d.name;
	});

	force.on("tick", function() {
		link.attr("x1", function(d) {
			return d.source.x;
		}).attr("y1", function(d) {
			return d.source.y;
		}).attr("x2", function(d) {
			return d.target.x;
		}).attr("y2", function(d) {
			return d.target.y;
		});

		circle.attr("cx", function(d) {
			return d.x;
		}).attr("cy", function(d) {
			return d.y;
		});

		label.attr("x", function(d) {
			return d.x + 8;
		}).attr("y", function(d) {
			return d.y;
		});
	});

	force.start();

}

// https://stackoverflow.com/questions/6274339/
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function demoGraph(dataIn) {
	
	var data = dataIn;
	console.log(data);
	var content = "<div id='knowledgegraph'></div>";
	$("#knowledgegraphcontent").html(content);
	drawBubbleGraph(data);
	
}
