var horaa = require('horaa'),
    repo = require('../lib/repository.js'),
    nodemock = require('nodemock');

exports.shouldCreateRepoObject = function(test) {
    var path = 'testrepo',
        r = repo.create(path);
    
    test.equal(path, r.path);
    test.done();
};

exports.shouldTouchRepositoryDirectory = function(test) {
    // given
    var utilsHoraa = horaa(__dirname + '/../lib/utils');
    var r = repo.create('testrepo');
    
    utilsHoraa.hijack('touchDirectory', function(path) {
        touchCalled = true;
    });

    // when
    r.init();

    // then
    test.ok(touchCalled, 'Touch called on path not called');
    test.done();
};

exports.shouldCheckIfArtifactExists = function(test) {
    var utilsHoraa = horaa(__dirname + '/../lib/utils');
    var r = repo.create('testrepo');
    var artifactPath = 'abc/def/obj-1.0.pom';
    
    utilsHoraa.hijack('existsOnPath', function(path) {
        return (path === 'testrepo/' + artifactPath);
    });

    // when
    test.ok(r.artifactExists(artifactPath), 'Exists on path not invoked or paths don\'t match');
    test.done();
};

exports.shouldFindAllVersionOfArtifacts = function(test) {

};

exports.shouldCreateFolderForArtifact = function(test) {

};