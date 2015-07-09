process.env.REDIS_URL="redis://rediscloud:password@localhost:6379";
var assert = require('assert'),
    redis = require('../redisAdaptor.js')('fakeredis');

var graphObj = {nodes: {indexjs: {"name: index.js, source":"external","requires":0,"gives":1, "sha": ""}, inxjs: {"name: inx.js, source":"external","requires":0,"gives":1, "sha": ""}}, links: [{source: "test", target: "test"}]};
var testObj = JSON.stringify(graphObj);



// Write tests!

console.log("#Test 0: Check the local host client setup");
  assert.equal(redis.clientAuth,"password");
console.log("#test0 passed");

console.log("#Test 0.5: Check the local host client setup");
  process.env.REDIS_URL = "";
  redis = require('../redisAdaptor.js')('fakeredis');
  assert.equal(redis.clientAuth,null);
console.log("#test0.5 passed");


console.log("#Test 1: Check write method with valid inputs");
redis.write("owner/repo/branch", testObj, function(err,reply){
  assert.equal(reply, "OK");
  console.log("#test1 passed");
});

console.log("#Test 2: Check write method with invalid path: no branch part");
redis.write("owner/repo", testObj, function(err,reply){
  assert.notEqual(reply, "OK");
  console.log("#test2 passed");
});

console.log("#Test 3: Check write method with invalid path: empty branch");
redis.write("owner/repo/", testObj, function(err,reply){
  assert.notEqual(reply, "OK");
  console.log("#test3 passed");
});

console.log("#Test 4: Check if inserted JSON object exists");
redis.write("owner/repo/branch", undefined, function(err,reply){
  assert.notEqual(reply, "OK");
  console.log("#test4 passed");
});

console.log("#Test 5: Check if inserted string is valid JSON");
redis.write("owner/repo/branch", "foo" , function(err,reply){
  assert.notEqual(reply, "OK");
  console.log("#test5 passed");
});


// Read tests

console.log("#Test 6: Check read method with present key");
redis.read("owner/repo/branch", function(err,reply){
  assert.equal(reply, testObj);
  console.log("#test6 passed");
});

console.log("#Test 7: Check read method with absent key");
redis.read("does/not/exist", function(err,reply){
  assert.equal(reply, null);
  console.log("#test7 passed");
});

redis.write("a/repo/path", testObj, function(){
  redis.write("another/repo/path", testObj, function(){

    // Get repos tests

    console.log("#Test 7: Check getrepos method");
    redis.adminGetRepos(function(err,reply){
      assert(reply.indexOf("a/repo/path")>-1,"one repo not present");
      assert.equal(reply.length, 3 ,"number of repos incorrect");
      console.log("#test7 passed");

      // Delete repos tests

      console.log("#Test 8: Check a single deletion");
      redis.adminDelete(["a/repo/path"], function(err,reply){
        assert.equal(reply,1);
        redis.read("a/repo/path", function(err,reply){
          assert.equal(reply,null);
          console.log("#test8 passed");
        });
      },function(){});

      console.log("#Test 9: Check multi deletion with one missing already");
      redis.adminDelete(["a/repo/path","another/repo/path","owner/repo/branch"], function(){}, function(err,replies){
        assert.deepEqual(replies,[0,1,1]);
        console.log("#test9 passed");
      });

      console.log("#Test 10: Give invalid delete arguments");
      redis.adminDelete([undefined], function(err,reply){
        assert.notEqual(err,null);
        console.log("#test10 passed");
      }, function(){});

    });

  });
});
