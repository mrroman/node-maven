var fs = require('fs'),
    mkdirp = require('mkdirp');

exports.touchDirectory = function(path) {
    if (!exports.existsOnPath(path)) {
            mkdirp.sync(path);
    }
};

exports.existsOnPath = function(path) {
    try {
        fs.statSync(path);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return false;
        } else {
            throw e;
        }
    }
    return true;
};

exports.statPath = function(path) {
    try {
        return fs.statSync(path);
    } catch (e) {
        if (e.code === 'ENOENT') {
            return null;
        } else {
            throw e;
        }
    }
};