var width = 960, //width and height of SVG element (its a box and all content position and units will be relative to it)
    height = 500;

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(60)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


d3.json("graphData.json", function(error, graph) {
  if (error) throw error; //if error obtained when reading in the json object, throw it!

  force //our graph object, needs a array of node objects and link objects, the set of links will reference the nodes by order in the array
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  svg.append("svg:defs").selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
      .enter()
      .append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

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
      .attr("r", 5)
      .call(force.drag);

  var text = svg.append("g").selectAll("text")
    .data(force.nodes())
    .enter().append("text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });


  function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
  }

  force.on("tick", function() {
    text.attr("transform", transform);

    path.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" +
            d.source.x + "," +
            d.source.y + "A" +
            dr + "," + dr + " 0 0,1 " +
            d.target.x + "," +
            d.target.y;
    });

    node
        .attr("transform", function(d) {
  	    return "translate(" + d.x + "," + d.y + ")"; });
  });
});
