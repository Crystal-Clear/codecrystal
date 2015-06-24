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
    path: url
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
      console.log("response ended");
      var access = access_token.split('=')[1].split('&')[0];
      github.authenticate({
          type: "oauth",
          token: access
      });
    });
  });

  req2.end();
}

function getFiles(commits) {
  var contents = [];
  commits.forEach(function(elem, index) {
    if (elem === '') { return ;}
    var options = {
      user: elem.user,
      repo: elem.repo,
      sha: elem.sha,
      recursive: true
    };
    github.gitdata.getTree(options, function(err, result){
      console.log(err, result);
      contents[index] = result;
      // console.log(contents);
    });
  });
}

module.exports = {

  login: getAccessToken,

  getRepos: function(request, reply) {
    github.repos.getAll({}, function(err, data) {
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
          // console.log(err, result);
          if(!err) {
            commits[index] = { user: options.user, repo: options.repo,  sha: result.object.sha };
          }
          if(++counter === repos.length) {
            getFiles(commits);
          }
        });

      });
    });
  }

};
