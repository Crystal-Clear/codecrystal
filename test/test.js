var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var fs = require('fs');

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var server = require('../server.js');
var logo;
fs.readFile("./images/codeCrystal2copia.png", function(err, data){
  logo = data.toString();
});

describe("recieve a file at '/' endpoint with the words 'build interactive maps'", function() {
  it(" ", function(done){
    server.inject({method: "GET", url: "/"}, function(res) {
      expect(res.statusCode).to.equal(200);
      expect(res.payload).to.contain("uild interactive maps");
      done();
    });
  });
});

describe("at /repo/{path*} endpoint reply with graph.html", function() {
  it(" ", function(done){
    server.inject({method: "GET", url: "/repo/jmnr/dark/master"}, function(res) {
      expect(res.payload).to.contain("Pwetty Gwaph");
      done();
    });
  });
});

describe("at /static/{path*} endpoint reply with static file", function() {
  it(" ", function(done){
    server.inject({method: "GET", url: "/static/images/codeCrystal2copia.png"}, function(res) {
      expect(res.payload).to.equal(logo);
      done();
    });
  });
});

describe("at /create/{path*} endpoint query github api, if the repo doesn't exist reply with an error", function() {
  it("github data retrieved succesfully", function(done){
    server.inject({method: "GET", url: "/create/jmnr/canary/master"}, function(res) {
      expect(res.payload).to.equal("");
      done();
    });
  });
  it("error message for invalid repo path", function(done){
    server.inject({method: "GET", url: "/create/jmnr/twitter/master"}, function(res) {
      expect(res.payload).to.equal("does not exist yet");
      done();
    });
  });
});
