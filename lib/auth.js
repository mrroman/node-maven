var auth = require('http-auth');

exports.authHandler = function(handler, options) {
    var digest = auth({
        authRealm: options.security.authRealm,
        authFile: options.security.authFile,
        authType: 'digest'
    });

    return function(req, resp) {
        digest.apply(req, resp, function(user) {
            console.log('User ' + user + ' access granted');
            handler(req,resp);
        });
    };
};

