var assert = require('assert'),
    redis = require('../redisAdaptor.js')('fakeredis');

var graphObj1 = {nodes: {indexjs: {"name: index.js, source":"external","requires":0,"gives":1, "sha": ""}, inxjs: {"name: inx.js, source":"external","requires":0,"gives":1, "sha": ""}}, links: [{source: "test", target: "test"}]};
var graphObj2 = {nodes: {indexjs: {"name: poop.js, source":"external","requires":0,"gives":1, "sha": ""}, inxjs: {"name: inx.js, source":"external","requires":0,"gives":1, "sha": ""}}, links: [{source: "test", target: "test"}]};
var testObj1 = JSON.stringify(graphObj1);
var testObj2 = JSON.stringify(graphObj2);


// Write tests!

console.log("#Test 1: Check write method with valid inputs");
redis.write("owner/repo/branch", testObj1, function(err,reply){
  assert.equal(reply, "OK");
  console.log("#test1 passed");
});

console.log("#Test 2: Check write method with invalid path: no branch part");
redis.write("owner/repo", testObj1, function(err,reply){
  assert.notEqual(reply, "OK");
  console.log("#test2 passed");
});

console.log("#Test 3: Check write method with invalid path: empty branch");
redis.write("owner/repo/", testObj1, function(err,reply){
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
  assert.equal(reply, testObj1);
  console.log("#test6 passed");
});

console.log("#Test 6: Check read method with present key");
redis.read("owner/repo/branc", function(err,reply){

  console.log(err,reply);
});
//
//
// console.log("#Test 2: check read method retrieves entries from the db in the order in which they were written ");
// var test1 = {name: "nikki", time: "1234"};
// var test2 = {name: "michelle", time: "1235"};
// Model.create(test1, function(){});
// Model.create(test2, function(){});
// Model.read(function(obj){
//   // console.log("readALL", obj);
//   assert.deepEqual([test1, test2], obj);
//   console.log("#test2 passed");
// });
