var redisAdaptor = function (config) {
  "use strict";

  var redis = config.connection;
  var client;
  var url = require('url');

  if(process.env.REDIS_URL) {
    var redisURL = url.parse(process.env.REDIS_URL);
    client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
    client.auth(redisURL.auth.split(":")[1]);
}

else {
  client = redis.createClient();
}
  return {
    create: function(imageData, callback) {
      client.select(0, function() {
          client.hmset(imageData.id, imageData, function(err){
            callback(err);
          });
        }
      );
    }, //database 0 is for our metadata

    addAnalytics: function(data, callback) {
      client.select(1, function() {
          client.hmset(data.time, data, function(err){
            callback(err);
          });
        }
      );
    }, //database 1 is for analytics

    read: function(db, callback) {
      var fileLoad = [];
      var len;

      var cb = function(err, data) {
        console.log("data:", data);
        fileLoad.push(data);
      };

      var scan = function(x) {
        client.scan(x, function(err, data) {
          if(err) {
            console.log(err);
          } else {
            var dbindex = data[0];
            var files = data[1];
            len = files.length;
            for(var i = 0; i < len; i++) {
              client.hgetall(files[i], cb);
            }

            if(dbindex === "0") {
              callback(fileLoad);
            } else {
              scan(dbindex);
            }
          }
        });
      };

      client.select(db, function() {
        scan(0);
      });
    },

    delete: function(time, callback) {
      client.del(time, function(err, reply) {
        callback(reply);
      });
    }

  };

};

module.exports = redisAdaptor;
