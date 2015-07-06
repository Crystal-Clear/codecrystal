var db = require('./redisAdaptor.js');
var github = require('./githubHandlers.js');
var graph = require('./graphHandlers.js');

//var createAndWriteCrystal = R.compose(db.create, graph.createGraphObj, github.getRepoInfo);

module.exports = {

  createCrystal: function(request, reply) {
    // createAndWriteCrystal([owner, repo, branch]);
  }



};
