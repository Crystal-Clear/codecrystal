// url of window /crystalise/user/repo

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
    loadIn(xhr.responseText);
  }
};
xhr.open('GET', '/getCrystal/' +document.URL.split('/').slice(-3).join('/'));
xhr.send();


// var repoUrl="https://github.com/lajj/picup" //do a repo url thing here

function findLonelyNodes (nodes) {
  var lonelyNodes = {};
  var connectedNodes = {};
    for (var key in nodes) {
      if (nodes[key].requires === 0 && nodes[key].gives === 0 ) {
        lonelyNodes[key] = nodes[key];
      } else {
        connectedNodes[key] = nodes[key];
      }
    }
  return [connectedNodes, lonelyNodes];
}

function loadIn(JSONgraphObject){

  var repoInfo=document.URL.split('/').slice(-3);
  var user=repoInfo[0];
  var repo=repoInfo[1];
  var branch=repoInfo[2];
  var graph=JSON.parse(JSONgraphObject);

  console.log("nodes", graph.nodes);

  var cleanedNodes = findLonelyNodes(graph.nodes);
  var nodes = cleanedNodes[0];
  var lonelyNodes = cleanedNodes[1];

  graph.links.forEach(function(link) {
     link.source = nodes[link.source];
     link.target = nodes[link.target];
  });


  document.getElementById("githubRepo").innerHTML = "<a href='https://github.com/"+ user +
    "'>" + user + "</a>/<a href='https://github.com/" + user + "/" + repo + "'>" +repo +
    "/" + branch + "/</a>";
    //width and height of SVG element (its a box and all content position and units will be relative to it)
    // need to change to scale to contents!
    var width = 900,
    height = 1000;

  var force = d3.layout.force()
      .linkDistance(100)
      .size([width, height]);

  var lonelyForce = d3.layout.force()
      .size([10, 1000]);

  var svg = d3.select("#crystalContainer").append("svg")
      .attr("id","crystal")
      .style("background", "Yellow");

  var svgPinned = d3.select("#pinnedNodes").append("svg")
      .attr("id","pinnedNodes")
      .style("background", "green");

  force //our graph object, needs a array of node objects and link objects, the set of links will reference the nodes by order in the array
    .nodes(d3.values(nodes))
    .links(graph.links)
    .gravity(0.1)
    .charge(-2000)
    .start();

  lonelyForce
    .nodes(d3.values(lonelyNodes))
    .gravity(0.1)
    .charge(-50)
    .start();

  svg.append("svg:defs").selectAll("marker")
    .data(["end"])      // Different link/path types can be defined here
    .enter()
    .append("svg:marker")    // This section adds in the arrows
    .attr("id", String)
    .attr("viewBox", "0 -10 20 20")
    .attr("refX", 100)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-10L20,0L0,10");

  var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
    .enter().append("svg:path")
//    .attr("class", function(d) { return "link " + d.type; })
    .attr("class", "link")
    .attr("marker-end", "url(#end)");

  var node = svg.selectAll(".node")
    .data(d3.values(nodes))
    .enter()
    .append("g")
    .attr("class", "node")
    .append("circle")
    .style("fill", function(d){
      return d.source=="external" ? "Maroon" : "Blue";
    })
    .style("opacity", function(d){
      return (d.gives+1)/(d.gives+1.5);
    })
    .attr("r", function(d){
      console.log("r",d.requires);
      return (Math.sqrt(d.requires + 1)) * 5;
    })
    .on("dblclick",connectedNodes)
    .on('mouseover', function(d){
      var link="";
      if (d.source=="external"){link="https://www.npmjs.com/package/"+d.name;}
      else {link="https://github.com/"+user+"/"+repo+"/blob/"+branch+"/"+d.name;}
      document.getElementById("filePath").innerHTML="<a href='"+link+"'>"+d.name+"</a>";
      document.getElementById("fileContents").innerHTML= d.contents ? "<pre>"+d.contents+"</pre>": "<p>NPM module</p>";
    })
   .call(force.drag);

  var lonelyNode = svgPinned.selectAll(".node")
    .data(d3.values(lonelyNodes))
    .enter()
    .append("g")
    .attr("class", "lonelyNode")
    .append("circle")
    .style("fill", function(d){
      return d.source=="external" ? "Maroon" : "Blue";
    })
    .attr("r", 5)
    .on("dblclick",githubLink)
    .call(force.drag);

  var lonelyText = svgPinned.append("g").selectAll("text")
    .data(lonelyForce.nodes())
    .enter().append("text")
    .attr("x",8)
    .attr("y",".5em")
    .text(function(d){return d.source=="external" ? d.name : d.name.slice(d.name.lastIndexOf('/') + 1);});

  var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x",8)
    .attr("y",".5em")
    .text(function(d){return d.source=="external" ? d.name : d.name.slice(d.name.lastIndexOf('/') + 1);});

  function githubLink(d){
      var link = "";
      if (d.source == "external"){link = "https://www.npmjs.com/package/" + d.name;}
      else {link = "https://github.com/" + user + "/" + repo + "/blob/" + branch + "/" + d.name;}
      location.href = link;
  }

  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  force.on("tick", function() {
    text.attr("transform", transform);
    path.attr("d", function(d) {
      return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," +  d.target.y;
    });
    node.attr("transform", transform);
  });

  lonelyForce.on("tick", function() {
    lonelyText.attr("transform", transform);
    lonelyNode.attr("transform", transform);
  });

  //Toggle stores whether the highlighting is on
  var toggle = 0;
  //Create an object logging what is connected to what

  var linkedByIndex = {};
  for (var key in nodes) {
    linkedByIndex[key + "," + key] = 1;
  }

  graph.links.forEach(function (d) {
      linkedByIndex[d.source.name + "," + d.target.name] = 1;
  });

  //This function looks up whether a pair are neighbours
  function neighboring(a, b) {
      return linkedByIndex[a.name + "," + b.name];
  }
  function connectedNodes() {
      if (toggle == 0) {
          //Reduce the opacity of all but the neighbouring nodes
          d = d3.select(this).node().__data__;
          node.style("opacity", function (o) {
              return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
          });
          path.style("opacity", function (o) {
              return d.name==o.source.name | d.name==o.target.name ? 1 : 0.1;
          });
          // text.style("opacity", function(o) {
          //     return d.name==o.name ? 1 : 0.1;
          // })
          //Reduce the op
          toggle = 1;
      } else {
          //Put them back to opacity=1
          node.style("opacity", 1);
          path.style("opacity", 1);
          toggle = 0;
      }
  }



  var optArray = [];

  for (var i = 0; i < Object.keys(nodes).length - 1; i++) {
      optArray.push(nodes[Object.keys(nodes)[i]].name);
  }

  optArray = optArray.sort();

  $(function () {
      $("#search").autocomplete({
          source: optArray
      });
  });

  function searchNode() {
      //find the node
      var selectedVal = document.getElementById('search').value;
      console.log(selectedVal);
      var node = svg.selectAll(".node");
      if (selectedVal == "none") {
          node.style("stroke", "white").style("stroke-width", "10");
      } else {
          var selected = node.filter(function (d, i) {
              return d.name != selectedVal;
          });
          selected.style("opacity", "0");
          var link = svg.selectAll(".link")
          link.style("opacity", "0");
          d3.selectAll(".node, .link").transition()
              .duration(10000)
              .style("opacity", 1);
      }
  }

  window.searchNode = searchNode;

}
