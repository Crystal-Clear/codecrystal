var github  = require('./github');
var https = require('https');
var makeRepoList = require('./makeRepoList.js');

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
    res.on("data", function(d){
      access_token += d.toString();
    });

    res.on("end", function(){
      var access = access_token.split('=')[1].split('&')[0];
      github.authenticate({
          type: "oauth",
          token: access
      });
      reply.redirect('/repo');
    });
  });

  req2.end();
}

function getRepoInfo(repos, reply) {
  var commits = [];
  var counter = 0;
  repos.forEach( function(elem, index) {
    var options = {
      user: elem[0],
      repo: elem[1],
      ref: "heads/" + elem[2]
    };
    console.log(options);
    github.gitdata.getReference(options, function(err, result) {
      if(!err) {
        commits[index] = { user: options.user, repo: options.repo,  sha: result.object.sha };
      }
      if (++counter === repos.length) {
        getTrees(commits, reply);
      }
    });

  });
}

function getTrees(commits, reply) {
  var trees = [];
  commits.forEach(function(elem, index) {
    var config = {
      user: elem.user,
      repo: elem.repo,
      sha: elem.sha,
      recursive: true
    };
    github.gitdata.getTree(config, function(err, result){
      if(err) {console.log(index, err);}
      trees[index] = [result || err, config];

      if (trees.filter(function(elem){return elem;}).length === commits.length) {
        trees = trees.map( function(treeObj) {
          return [treeObj[0].tree.filter(function(file) { return file.type ==="blob";}), treeObj[1]];
        });
      // console.log(trees);
      getFileContents(trees, reply);

      }
    });
  });
}

function getFileContents(trees, reply) {
  console.log("reply",reply);
  var results = [];
  trees.forEach(function(tree) {
    var result = [];
    var configuration = tree[1];
    tree[0].forEach(function(file){
      configuration.sha = file.sha;
      github.gitdata.getBlob(configuration, function(err, data){
        if (err) console.error(file.path, err);
        result.push(err || {path: file.path, content: data});
        console.log(err);
        if (result.filter(function(elem){return elem;}).length === tree[0].length){
          results.push(result);
          if (results.length === trees.length) {
            reply(decodeBase64(results));
          }
        }
      });
    });
  });

}

function decodeBase64 (fileContents) {
  return fileContents[0].map(function(contents){
    var buf = new Buffer(contents.content.content, 'base64');
    return buf.toString();
  });

}

module.exports = {

  login: getAccessToken,

  getRepos: function(request, reply) {
    var repos;

    github.repos.getAll({}, function(err, data) {
      if (err){
        // console.error(err);
        return;
      }
      repos = data.map(function(elem){
        return [elem.full_name, elem.default_branch];
      });
      repoHTML = makeRepoList(repos);
      reply(repoHTML);
    });


  },

  makeMap: function(request, reply) {
    var path = request.params.path.split('/');
    var branch = path.pop();
    var repo = path.pop();
    var user = path.pop();
    console.log("HEY JACK!");
    getRepoInfo([[user, repo, branch]], reply);
  }

};
