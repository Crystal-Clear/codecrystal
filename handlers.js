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

// function getFiles(commits) {
//   var contents = [];
//   commits.forEach(function(elem, index) {
//     var options = {
//       user: elem.user,
//       repo: elem.repo
//     };
//     github.repos.getContent(options, function(err, result){
//       contents[index] = result;
//     });
//   }
// }

module.exports = {

  login: getAccessToken,

  getRepos: function(request, reply) {
    github.repos.getAll({}, function(err, data) {
      var repos = data.map(function(elem){
        return elem.full_name;
      });

      var files = [];
      var counter = 0;
      repos.forEach( function(elem, index) {
        var options = {
          user: elem.split('/')[0],
          repo: elem.split('/')[1]
          // ref: "heads/master"
        };
        github.repos.getContent(options, function(err, result) {
          console.log(err, result);
          files[index] = { user: options.user, repo: options.repo, files: result };
          if(++counter === repos.length) {
            console.log(files);
          }
        });

      });
    });



  }

};
