var github  = require('./github');
var https = require('https');

function configMake(request){
  var code = request.query.code;
  var url = "/login/oauth/access_token?client_id=" +
    process.env.CLIENT_ID + "&client_secret=" +
    process.env.CLIENT_SECRET + "&code=" + code;
  return {
    hostname: "github.com",
    method: "POST",
    path: url,
  };
}

function getAccessToken(request, reply) {
  var access_token = "";
  var options = configMake(request);
  var req2 = https.request(options, function(res) {
    console.log("post request");
    res.on("data", function(d){
      access_token += d.toString();
    });

    res.on("end", function(){
      var access = access_token.split('=')[1].split('&')[0];
      github.authenticate({
          type: "oauth",
          token: access
      });
      console.log("response ended");
      reply('<h1>LOGGED IN</h1>');
    });
  });

  req2.end();
}

function getTrees(commits) {
  console.log('HELLO');
  var trees = [];
  commits.forEach(function(elem, index) {
    var config = {
      user: elem.user,
      repo: elem.repo,
      sha: elem.sha,
      recursive: true
    };
    github.gitdata.getTree(config, function(err, result){
      trees[index] = [result || err, config];
      if (trees.filter(function(elem){return elem;}).length === commits.length){
        console.log('YO');
        getFileContents(trees.slice(1,2));
      }
    });
  });
}

function getFileContents(trees) {
  var results = [];
  trees.forEach(function(tree) {
    console.log('once');
    var result = [];
    var configuration = tree[1];
    tree[0].tree.forEach(function(file){
      console.log(file.sha, file.path, configuration);
      configuration.sha = file.sha;
      github.gitdata.getBlob(configuration, function(err, data){
        if (err) console.error(err);
        result.push(err || {path: file.path, content: data});
        console.log(data);
        if (result.filter(function(elem){return elem;}).length === tree[0].tree.length){
          results.push(result);
        }
      });
    });
    if (results.length === trees.length) {console.log('THE RESULTS:', results);}
  });

}

module.exports = {

  login: getAccessToken,

  getRepos: function(request, reply) {
    github.repos.getAll({}, function(err, data) {
      if (err){
        console.error(err);
        return;
      }
      var repos = data.map(function(elem){
        return elem.full_name;
      });
      var commits = [];
      var counter = 0;
      repos.forEach( function(elem, index) {
        var options = {
          user: elem.split('/')[0],
          repo: elem.split('/')[1],
          ref: "heads/master"
        };
        github.gitdata.getReference(options, function(err, result) {
          if(!err) {
            commits[index] = { user: options.user, repo: options.repo,  sha: result.object.sha };
          }
          if (++counter === repos.length) {
            getTrees(commits);
          }
        });

      });
    });
  }

};
