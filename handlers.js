var db = require('./redisAdaptor.js')('redis');
var github = require('./githubAdaptor.js');
var graph = require('./graphHandlers.js');

//var createAndWriteCrystal = R.compose(db.create, graph.createGraphObj, github.getRepoInfo);

module.exports = {
  getCrystal: function(request, reply) {
    var repoPath=request.params.repoPath;
    db.read(repoPath,function(err,data){
      if (err) {console.log(err);}
      if (data){reply(data);}
      else {
        github.getRepoObj(repoPath,function(err,repoObject){
          var graphObj=graph.createGraphObj(repoObject);
          db.write(repoPath,graphObj,function(err,nOK){
            if (err){console.log(err);}
            if (nOK=="OK"){reply(graphObj);}
            else {reply({});}
          });
        });
      }
    });
  },
  crystalise: function(request,reply){reply.view("graph");},
  home:function(request, reply){reply.view("home");}
};
