var github=require("./github.js");

module.exports = {

  getRepoObj: function(repoPath, callback) {
    var repoPathArr=repoPath.split('/');
    var options = {
      user: repoPathArr[0],
      repo: repoPathArr[1],
      ref: "heads/" + repoPathArr[2],
      branch: repoPathArr[2]
    };
    getRepoCommit(options, function(err, commitOptions) {
      if (err) {return callback(err, null);}
      getCommitTree(commitOptions, function(err, treeOptions){
        if (err) { return callback(err, null);}
        getFileContents(treeOptions, function(err, repoObj){
          if (err){ return callback(err, null);}
          callback(err,repoObj);
        });
      });
    });
  },

  getRepoCommit: getRepoCommit,

  getCommitTree: getCommitTree,

  getFileContents: getFileContents

};


function decodeBase64 (fileContent) {
  var buf = new Buffer(fileContent, 'base64');
  return buf.toString();
}

function getRepoCommit (options, callback) {
  var commitOptions=JSON.parse(JSON.stringify(options));
  github.gitdata.getReference(commitOptions, function(err, data){
    if (err) {return callback(err, null);}
    else {
      commitOptions.sha = data.object.sha;
      commitOptions.last= data.meta['last-modified'];
      return callback(null,commitOptions);
    }
  });
}

function getCommitTree (options, callback) {
  var treeOptions=JSON.parse(JSON.stringify(options));
  treeOptions.recursive=true;
  github.gitdata.getTree(treeOptions, function(err, data) {
    if (err) {return callback(err, null);}
    else {
      delete treeOptions.recursive;
      treeOptions.files = data.tree.filter(function(file) { return file.type ==="blob";});
      treeOptions.truncated=data.truncated;
      return callback(null, treeOptions);
    }
  });
}

function getFileContents (options, callback) {
  var repoObj = {
    user: options.user,
    repo: options.repo,
    commitSha: options.sha,
    truncated: options.truncated,
    lastModified: options.last
  };
  var config = {user: options.user, repo: options.repo};
  var results = [];
  options.files.forEach(function(file) {
    var fileOptions=JSON.parse(JSON.stringify(config));
    fileOptions.sha=file.sha;
    fileOptions.path=file.path;
    github.gitdata.getBlob(fileOptions, function(err, data) {
      if (err) {return callback(err, null);}
      var fileContent=decodeBase64(data.content);
      results.push(err || {name: fileOptions.path, content: fileContent, sha: fileOptions.sha});
      if (results.filter(function(elem){return elem;}).length === options.files.length){
        repoObj.files=results;
        callback(err,repoObj);
      }
    });
  });
}
