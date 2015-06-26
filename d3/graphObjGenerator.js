var Parser =require('./parser.js');

module.exports=function(filesArr,contentsArr){

  var graphObj = {
    "nodes":[],
    "links":[]
  };

  for (var k = 0; k < filesArr.length; k++){
    var text = contentsArr[k];
    graphObj.nodes[k] = {"name": filesArr[k], "source":"internal", "requires":0, "gives":0, "contents":text};
  }
  for (var i = 0; i<filesArr.length ; i++){
    var requires = Parser.insideRequires(graphObj.nodes[i].contents);
    graphObj.nodes[i].requires = requires.length;
    var reqAbs = Parser.pathFinder(requires,filesArr[i]);
    reqAbs.forEach(function(link){
      var index;
      for (var j = 0; j < graphObj.nodes.length; j++){
        if (graphObj.nodes[j].name.toLowerCase() === link){
          index = j;
          graphObj.nodes[j].gives++;
        }
      }
      if (index === undefined) {
        index = graphObj.nodes.length;
        graphObj.nodes[index] = {"name":link,"source":"external","requires":0,"gives":1};
      }
      graphObj.links.push({"source":index,"target":i});
    });
  }
  return JSON.stringify(graphObj);
};
