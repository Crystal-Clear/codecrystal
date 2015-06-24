var handlers = require('./handlers');

module.exports = [
  {
     method: ['GET', 'POST'],
     path: "/login",
     handler: handlers.login
     //after login need to redirect the user to the /repo endpoint to get the repos and then reply.view with the repo.html page using repoList helper
   },
   {
      method: 'GET',
      path: "/",
      handler: function(request, reply){
        reply("<h1>HELLO</h1><a href='https://github.com/login/oauth/authorize?client_id=" + process.env.CLIENT_ID + "'>LOGIN with GITHUB</a>");
        // reply.view("home");
      }
    },
    {
      method: 'GET',
      path: "/repo",
      handler: handlers.getRepos
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

];
