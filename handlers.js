var db = require('./redisAdaptor.js');
var github = require('./githubHandlers.js');

//var createAndWriteCrystal = R.compose(db.create,createGraphObj,getRepoInfo);

module.exports = {

  createCrystal: function(request, reply) {
    var owner = request.params.owner;
    var repo = request.params.repo;
    var branch = request.params.branch;


    // createAndWriteCrystal([owner, repo, branch]);
  }



};
