var redisAdaptor = function (redisFakeyOrNoFakey) {

  "use strict";

  var redis = require(redisFakeyOrNoFakey);
  var client;
  var url = require('url');

  if(process.env.REDIS_URL) {
    var redisURL = url.parse(process.env.REDIS_URL);
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(":")[1]);
  } else {
  client = redis.createClient();
  }


  function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  return {
    clientAuth: client.auth_pass, //used for testing!!
    write: function (repo, graphObj, callback){
      client.select(0, function() {
        if (!isJsonString(graphObj)){return callback("Undefined or invalid JSON object",undefined);}
        if (repo.split('/').length !== 3 || !repo.split('/')[2] ){return callback("Repo path not in required form",undefined);}
        client.set(repo, graphObj, function(err,nOK){
          callback(err,nOK);
        });
      });
    },
    read: function (repo, callback){
      client.select(0, function() {
        client.get(repo, function(err,reply){
          callback(err,reply);
        });
      });
    },
    adminDelete: function (repoArray,callbackSingle, callbackAll){
      var multi = client.multi();
      repoArray.forEach(function(repo){
        multi.del(repo,function(err,oneZero){
          if (err) {callbackSingle(err,undefined);}
        });
      });
      multi.exec(function (err, replies) {
        callbackAll(err, replies);
      });
    },
    adminGetRepos: function (callback){
      client.select(0, function() {
        client.keys('*',function(err,keys){
          callback(err,keys);
        });
      });
    }

  };
};

module.exports = redisAdaptor;
