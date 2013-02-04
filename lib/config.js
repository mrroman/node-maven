var fs = require('fs'),
    options = {};

function initConfig(data) {
    for (var key in data) {
        options[key] = data[key];
    }
}

exports.options = options;

exports.load = function(callback) {
    fs.readFile('config.json', function(err, data) {
        if (err) {
            throw err;
        }
        
        initConfig(JSON.parse(data));
        callback(options);
    });
};
