var Handlers = require("./handlers.js");

module.exports = [

  // /usersignin path required by login form
  {
    path: '/usersignin',
    method: ['POST'],
    config: {
      handler: Handlers.usersignin,
      auth: {
        mode: 'try',
        strategy:'session'
      },
      plugins:{
        'hapi-auth-cookie': {redirectTo: false}}
    }
  },
  {
    path: '/logout',
    method: 'GET',
    config: {
            handler: Handlers.logout,
            auth: 'session'
    }
//    handler: Handlers.up
  },
  // Site analyitcs
    {
    path: '/analytics',
    method: 'GET',
    handler: Handlers.analytics
  },
  // /usersignin path required by login form
  {
    path: '/usersignin',
    method: 'POST',
    handler: Handlers.usersignin
  },

  // /upload path required by upload form
  {
    path: '/upload',
    method: 'POST',
    config: {
      auth:'session',
      handler: Handlers.upload
    }
  },
  // /createuser path required from createuser form
  {
    path: '/createuser',
    method: 'POST',
    handler: Handlers.createuser
  },
  // /pics/{picid} path required by /view/{picKey}/{picVal} request
  {
    path: '/pics/{picid}',
    method: 'GET',
    handler: Handlers.getpic
  },
  // /view/{picKey}/{picVal} path required by read keyvalue form
  {
    path: '/view/{picKey}/{picVal}',
    method: 'GET',
    handler: Handlers.keyvaluesearch
  },
  // //recent/{numhours} path required by read time form
  {
    path: '/recent/{numhours}',
    method: 'GET',
    handler: Handlers.recentsearch
  },
  // src files
  {
    method: 'GET',
    path: '/src/{filename}',
    handler: Handlers.getsrcfile
  },

  {
    method: 'GET',
    path: '/validate/{id}',
    handler: Handlers.emailvalidate
  },

  // sign up and login form on landing
  {
    path: '/',
    method: 'GET',
    handler: Handlers.landing
  },

  // generic goes to search photos page (must be changed when we decide on how to work things along with lots of stuff above)
  {
    path: '/{whatever}',
    method: 'GET',
    handler: Handlers.whatever
  },
];
