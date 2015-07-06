var Parser = require('./d3/parser.js');

function createLinks (link) {
  var source;
  for (var key in nodes) {
    if (link === key.toLowerCase()) {
      source=key;
      nodes[key].gives ++;
      break;
    }
  }
  if (!source) {
    source=link;
    nodes[source] = {"source":"external","requires":0,"gives":1, "sha": ""};
  }
  return links.push({source: source, target: filesArr[i].name});
}

module.exports = {

  createGraphObj: function (filesArr) {
    var nodes = {};
    var links = [];

    for (var k = 0; k < filesArr.length; k++){
      nodes[filesArr[k].name] = {"source":"internal", "requires":0, "gives":0, "sha":filesArr[k].sha};
    }

    for (var i = 0; i<filesArr.length ; i++) {
      var requires = Parser.insideRequires(filesArr[i].contents);
      nodes[filesArr[i].name].requires = requires.length;
      var absolutePaths = Parser.pathFinder(requires,filesArr[i]);

      absolutePaths.forEach(createLinks);
    }

    return JSON.stringify({nodes: nodes, links: links});
  }

};
