var Hapi = require('hapi'),
    server = new Hapi.Server(),
    https = require('https'),
    Path = require('path');

server.connection({ port: 8000});

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
