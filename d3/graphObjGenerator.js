var Parser =require('./parser.js');

function freshLink(link){
  var index;
  for (var j=0;j<graphObj.nodes.length;j++){
    if (graphObj.nodes[j].name==link){
      index=j;
      graphObj.nodes[j].gives++;
    }
  }
  if (index===undefined) {
    index=graphObj.nodes.length;
    graphObj.nodes[index]={"name":link,"source":"external","requires":0,"gives":1};
  }
  graphObj.links.push({"source":index,"target":i});
}

module.exports=function(filesArr,contentsArr){
  var graphObj = {
    "nodes":[],
    "links":[],
    "temp":[]
  };
  for (var i=0;i<filesArr.length;i++){
    graphObj.nodes[i]={"name":filesArr[i],"source":"internal","requires":0,"gives":0};
    var text=contentsArr[i];
    graphObj.temp[i] = text;
  }
  for (var j=0;j<filesArr.length;j++){
    var requires=Parser.insideRequires(graphObj.temp[j]);
    graphObj.nodes[j].requires=requires.length;
    var reqAbs=Parser.pathFinder(requires,filesArr[j]);
    reqAbs.forEach(freshLink);
  }
  delete graphObj.temp;
  return JSON.stringify(graphObj);
};
