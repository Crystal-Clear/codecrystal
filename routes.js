var handlers = require('./handlers');
var lastReq;

module.exports = [
  {
     method: ['GET', 'POST'],
     path: "/login",
     handler: handlers.login
   },
   {
      method: 'GET',
      path: "/",
      handler: function(request, reply){
        reply("<h1>HELLO</h1><a href='https://github.com/login/oauth/authorize?client_id=" + process.env.CLIENT_ID + "'>LOGIN with GITHUB</a>");
      }
    },
    {
      method: 'GET',
      path: "/repo",
      handler: handlers.getRepos
    }
];
