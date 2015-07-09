var handlers = require('./handlers.js');

module.exports = [
  {
    method: 'GET',
    path: "/",
    handler: handlers.home
  },
  {
    method: 'GET',
    path: "/crystalise/{path*}",
    handler: handlers.crystalise
  },
  {
    method: 'GET',
    path: "/getCrystal/{repoPath*}",
    handler: handlers.getCrystal
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
