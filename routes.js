// var handlers = require('./handlers');

module.exports = [
   {
      method: 'GET',
      path: "/",
      handler: function(request, reply){
        reply.view("home");
      }
    },
    {
      method: 'GET',
      path: "/repo/{path*}",
      handler: function(request,reply){reply.view("graph");}
    },
    {
      method: 'GET',
      path: "/static/{path*}",
      handler: {
        directory: {
          path: "./"
        }
      }
    },
    {
      method: "GET",
      path: "/create/{owner}/{repo}/{branch}",
      handler: handlers.createCrystal
    }
    // {
    //   method: 'GET',
    //   path: "/map/{path*}",
    //   handler: handlers.getMap
    // },
    // {
    //   method: 'GET',
    //   path: "/crystal/{path*}",
    //   handler: function(request,reply){reply.view("graph");}
    // }

];
