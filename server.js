var Hapi = require('hapi'),
    server = new Hapi.Server(),
    https = require('https');

server.connection({ port: 8000});

server.route(require('./routes'));

server.start(function () {
    console.log('Server running at: ' + server.info.uri);
});
