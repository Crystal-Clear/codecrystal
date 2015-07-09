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
var graph;

fs.readFile("./images/codeCrystal2copia.png", function(err, data){
  logo = data.toString();
});
fs.readFile("./views/graph.html", function(err, data){
  graph = data.toString();
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

describe("at /crystal/{path*} endpoint reply with the graph.html file", function() {
  it(" ", function(done){
    server.inject({method: "GET", url: "/crystal/jmnr/dark/master"}, function(res) {
      expect(res.payload).to.equal(graph);
      expect(res.statusCode).to.equal(302);
      done();
    });
  });
});

describe("at /map/{path*} endpoint display the map for repo specified in the path", function() {
  it("if graph obj  is in the database read the graph obj, create the d3 graph and display it on the page", function(done){
    server.inject({method: "GET", url: "/map/jmnr/scrabble/master"}, function(res) {
      ////////
      done();
    });
  });
  it("if the graph obj is not in the database, check if the repo exists and return error if it doesn't", function(done){
    server.inject({method: "GET", url: "/map/jmnr/crossword/master"}, function(res) {
      //////
      done();
    });
  });
  it("if the graph obj is not in the database, check if the repo exists, create graph Obj, write it to the database, create d3 graph, and display it on the page", function(done){
    server.inject({method: "GET", url: "/map/jmnr/scrabble/master"}, function(res) {
      //////
      done();
    });
  });
});
