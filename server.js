var Hapi = require('hapi'),
    server = new Hapi.Server(),
    https = require('https'),
    Path = require('path');

var serverOptions   = {port: (process.env.PORT || 8000 ), host: process.env.PORT ? '0.0.0.0' : 'localhost'};

server.connection(serverOptions);

server.route(require('./routes'));

server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, "views"),
});

server.start(function () {
    console.log('Server running at: ' + server.info.uri);
});
