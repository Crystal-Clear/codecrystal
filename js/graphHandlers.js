var Parser = require('./parser.js');

module.exports = {

  createGraphObj: function (repoObj) {
    var filesArr=repoObj.files;
    var nodes = {};
    var links = [];

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
        nodes[source] = {"name": source, "source":"external","requires":0,"gives":1, "sha": ""};
      }
      return links.push({source: source, target: filesArr[i].name});
    }

    for (var k = 0; k < filesArr.length; k++){
      nodes[filesArr[k].name] = {"name": filesArr[k].name, "source":"internal", "requires":0, "gives":0, "sha":filesArr[k].sha};
    }

    for (var i = 0; i<filesArr.length ; i++) {
      var requires = Parser.insideRequires(filesArr[i].content);
      nodes[filesArr[i].name].requires = requires.length;
      var absolutePaths = Parser.pathFinder(requires,filesArr[i].name);
      absolutePaths.forEach(createLinks);
    }

    repoObj.nodes=nodes;
    repoObj.links=links;
    delete repoObj.files;

    return JSON.stringify(repoObj);
  }

};
