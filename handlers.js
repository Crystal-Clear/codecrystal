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
      console.log("response ended");
      var access = access_token.split('=')[1].split('&')[0];
      github.authenticate({
          type: "oauth",
          token: access
      });
      // github.repos.getAll({}, function(err, data) {
      //   reply(data);
      // });
    });
  });

  req2.end();
}

module.exports = {

  login: getAccessToken,

  getRepos: function(request, reply) {

    github.repos.getAll({}, function(err, data) {
      var repos = data.map(function(elem){
        return elem.full_name;
      });
      console.log(repos);
    });
    // github.getReference(options, )
  }



};
