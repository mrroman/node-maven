var utils = require('./utils'),
    path = require('path'),
    config = require('./config').options;

function init() {
    utils.touchDirectory(this.path);
}

function artifactExists(artifactPath) {
    return utils.existsOnPath(this.path + '/' + artifactPath);
}

function statArtifact(artifactPath) {
    return utils.statPath(this.path + '/' + artifactPath);
}

function getArtifactDirectory(artifactPath) {
    var baseDir = path.dirname(artifactPath),
        absolutePath = this.path + '/' + baseDir;

    utils.touchDirectory(absolutePath);
    return absolutePath;
}

function getArtifactFullPath(artifactPath) {
    return this.path + '/' + artifactPath;
}

exports.getRepository = function(id) {
    var repositoryConfig = config.repositories[id];

    if (repositoryConfig) {
        return exports.create(repositoryConfig);
    } else {
        return null;
    }
};

exports.create = function(repositoryConfig) {
    return {
        path: repositoryConfig.path,

        init: init,
        artifactExists: artifactExists,
        getArtifactDirectory: getArtifactDirectory,
        getArtifactFullPath: getArtifactFullPath,
        statArtifact: statArtifact
    };
};