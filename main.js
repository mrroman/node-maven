var http = require('http'),
    routes = require('./routes.js'),
    config = require('./config.js');

http.createServer(routes.requestHandler).listen(config.server.port, config.server.host);
console.log('Server running at http://' + config.server.host + ':' + config.server.port +'/');
