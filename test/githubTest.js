var fs = require('fs');
var assert = require('assert');
var githubAdaptor=require('../js/githubAdaptor.js');
var thisFileContents=fs.readFileSync(__dirname+"/githubTest.js",'utf8');

console.log("1: Tests getRepoObj function");

console.log("#Test 1.1: If repo does not exist return error");
githubAdaptor.getRepoObj("I/dont/exist",function(err, result){
  assert.equal(err,'{"message":"Not Found","documentation_url":"https://developer.github.com/v3"}');
  assert.equal(result,null);
  console.log("#test1.1 passed");
});

// console.log("#Test 1.2: If repo is private return error");
// githubAdaptor.getRepoObj("I/am/private",function(err, result){
//   assert.equal(err,"Repo is private");
//   assert.equal(result,null);
//   console.log("#test1.2 passed");
// });
//
// console.log("#Test 1.3: LOLOLOL When called on this repo check the contents of this file is the same as whats given");
// githubAdaptor.getRepoObj("crystal-clear","codecrystal","master",function(err, result){
//   var matches=result.files.filter(function(file){return file.name==="test/githubTest.js" && file.content===thisFileContents;});
//   assert.equal(matches.length,1);
//   console.log("#test1.3 passed");
// });

console.log("2: Tests getRepoCommit function");

console.log("#Test 2.1: Check sha and last-modified of commit obtained");
githubAdaptor.getRepoCommit({user:"crystal-clear",repo:"codecrystal",ref:"heads/master"},function(err, result){
  assert(result.sha && result.last);
  console.log("#test2.1 passed");
});
console.log("#Test 2.2: Check sha of commit obtained");
githubAdaptor.getRepoCommit({user:"crystal-clear",repo:"codecrystal",ref:"heads/fakebranch"},function(err, result){
  assert.equal(result,null);
  assert(err);
  console.log("#test2.2 passed");
});


console.log("3: Tests getCommitTree function");

console.log("#Test 3.1: Faulty repoOtions obj");
githubAdaptor.getCommitTree({user:"test",repo:"test"},function(err, result){
  assert(err);
  console.log("#test3.1 passed");
});

console.log("#Test 3.2: Returned object has fields property and all files are blobs");
githubAdaptor.getCommitTree({user:"crystal-clear",repo:"codecrystal",sha:"0fb1da485470333281a74576428771aa0ac62a79"},function(err, result){ //nice to change to something clever
  assert(result.files);
  assert.deepEqual(result.files.filter(function(file){return file.type!=="blob";}),[]);
  console.log("#test3.2 passed");
});

console.log("4: Tests getFileContents function");

console.log("#Test 4.1: should get repoObj back with files that have content");
githubAdaptor.getFileContents({user: "crystal-clear", repo: "codecrystal", files: [{sha:"c91b63d1943cd17fbcb59ba5361a703f9a4e0b57"},{sha:"c3c8c603540a0c2c6e561bbeb0970f32203d6c26"}]},function(err, result){
  assert(result.files[1].content);
  assert.equal(result.files.length,2);
  console.log("#test4.1 passed");
});

console.log("#Test 4.2: Faulty repoOptions obj");
githubAdaptor.getFileContents({user:"crystal-clear", files: [{sha:"c3c8c603540a0c2c6e561bbeb0970f32203d6c26"}]},function(err, result){
  assert(err);
  console.log("#test4.2 passed");
});
