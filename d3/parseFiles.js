var fs = require('fs');

files = ['./handlers.js','./validator.js','./analytics.js','./mandrill.js','./routes.js','./server.js','./hasher.js','./mongo.js','./registers.js'];

graphObj = {
  "nodes":[],
  "links":[],
  "temp":[]
};

for (var i=0;i<files.length;i++){
  graphObj.nodes[i]={"name":files[i],"source":"internal","requires":0,"gives":0};
  var text=fs.readFileSync("picupExample/"+files[i]).toString();
  graphObj.temp[i] = text;
}

for (var i=0;i<files.length;i++){
  var requires = requireparser(graphObj.temp[i]);
  graphObj.nodes[i].requires=requires.length;
  requires.forEach(function(link){
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
  });
}


function requireparser(program){
  links=[];
  var requires = program.split('require(');
  for (var i=1; i<requires.length;i++){
    links.push(requires[i].split(')')[0].slice(1,-1));
  }
  return links;
}

delete(graphObj.temp);



fs.writeFile('graphObj.json', JSON.stringify(graphObj), function (err,data) {
  if (err) return console.log(err);
});


console.log
