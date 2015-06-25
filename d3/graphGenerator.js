var repoUrl="https://github.com/lajj/picup" //do a repo url thing here

var width = 1000, //width and height of SVG element (its a box and all content position and units will be relative to it) need to change to scale to contents!
    height = 1000;

var force = d3.layout.force()
    .linkDistance(60)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "White");


d3.json("graphObj.json", function(error, graph) {
  if (error) throw error; //if error obtained when reading in the json object, throw it!

  force //our graph object, needs a array of node objects and link objects, the set of links will reference the nodes by order in the array
      .nodes(graph.nodes)
      .links(graph.links)
      .gravity(0.1)
      .charge(-2000)
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
      .data(graph.nodes)
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
      .call(force.drag)
      .on("dblclick",githubLink);


  var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x",8)
    .attr("y",".5em")
    .text(function(d){return d.source=="external" ? d.name : d.name.slice(d.name.lastIndexOf('/')+1);});

  function githubLink(d){
      var link;
      if (d.source=="external"){link="https://www.npmjs.com/package/"+d.name;}
      else {link=repoUrl+"/blob/master"+d.name;}
      location.href = link;
  }

  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  force.on("tick", function() {
    text.attr("transform", transform);
    path.attr("d", function(d) {  return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," +  d.target.y;});
    node.attr("transform", function(d) {return "translate("+d.x+","+d.y+")";});
  });

});
