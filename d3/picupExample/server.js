var Hapi = require('hapi');
var HapiAuthCookie = require('hapi-auth-cookie');

var Validator = require("./validator.js");

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});


server.state('data', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: false, // remove invalid cookies
    strictHeader: true // don't allow violations of RFC 6265
});

server.register(HapiAuthCookie, function (err) {
    console.log(server.app.cache);
    server.auth.strategy('session','cookie',  {
        password: 'random string to act as hash',
        cookie: 'sid-example',
        redirectTo: '/',
        isSecure: false,
    });

});

// Add the routes
server.route(require('./routes.js'));

var options = {
    opsInterval: 1000,
    reporters: [{
        reporter: require('good-file'),
        events: { response: '*'},
        config: './src/log/response_log'

    },
    {
        reporter: require('good-file'),
        events: { ops: '*' },
        config: './src/log/ops_log'

    },
    {
        reporter: require('good-file'),
        events: { request: '*' },
        config: './src/log/request_log'

    },
    {
        reporter: require('good-file'),
        events: { log: '*'},
        config: './src/log/log_log'

    }]
};

    // Add the routes

    server.register({
        register: require('good'),
        options: options
    }, function (err) {

        if (err) {
            console.error(err);
        }
        else {
            server.start(function () {

                console.info('Server started at %s' + server.info.uri);
            });
        }
    });

//
//    // Start the server
//    server.start(function(){console.log('Server started at %s', server.info.uri);});
