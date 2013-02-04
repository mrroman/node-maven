var utils = require('./utils');

function init() {
    utils.touchDirectory(this.path);
}

function artifactExists(artifactPath) {
    return utils.existsOnPath(this.path + '/' + artifactPath);
}

exports.create = function(path) {
    return {
        path: path,

        init: init,
        artifactExists: artifactExists
    };
};