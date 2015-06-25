require('hapi-auth-cookie');
var Server = require('./server.js'); 
var cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
server.app.cache = cache;


module.exports = [


	{
	    Server.auth.strategy('session', 'cookie', true, {
	        password: 'secret',
	        cookie: 'sid-example',
	        redirectTo: '/login',
	        isSecure: false,
	        validateFunc: function (session, callback) {

	            cache.get(session.sid, function (err, cached) {

	                if (err) {
	                    return callback(err, false);
	                }

	                if (!cached) {
	                    return callback(null, false);
	                }

	                return callback(null, true, cached.account);
	            });
	        }
	    }
	}

];