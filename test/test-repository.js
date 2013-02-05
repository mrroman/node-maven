var horaa = require('horaa'),
    repo = require('../lib/repository.js'),
    
    nodemock = require('nodemock');

module.exports = {
    setUp: function(callback) {
        this.utilsHoraa = horaa(__dirname + '/../lib/utils');
        callback();
    },
 
    tearDown: function(callback) {
        callback();
    },

    shouldCreateRepoObject: function(test) {
        var path = 'testrepo',
            r = repo.create({ path: path });
    
        test.equal(path, r.path);
        test.done();
    },

    shouldTouchRepositoryDirectory: function(test) {
        // given
        var r = repo.create({ path: 'testrepo' });
        this.utilsHoraa.hijack('touchDirectory', function(path) {
            touchCalled = true;
        });
        
        // when
        r.init();
        
        // then
        test.ok(touchCalled, 'Touch called on path not called');
        test.done();
        this.utilsHoraa.restore('touchDirectory');
    },

    shouldCheckIfArtifactExists: function(test) {
        var r = repo.create({ path: 'testrepo' });
        var artifactPath = 'abc/def/obj-1.0.pom';
        
        this.utilsHoraa.hijack('existsOnPath', function(path) {
            return (path === 'testrepo/' + artifactPath);
        });
        
        // when
        test.ok(r.artifactExists(artifactPath), 'Exists on path not invoked or paths don\'t match');
        test.done();
        this.utilsHoraa.restore('existsOnPath');
    },
    
    shouldFindAllVersionOfArtifacts: function(test) {
        test.done();
    },
    
    shouldGetDirectoryForArtifactAndTouchIt: function(test) {
        // given
        var r = repo.create({ path: 'testrepo' }),
            touchCalled = false,
            artifactPath = 'abc/dev/obj-1.0.pom';

        this.utilsHoraa.hijack('touchDirectory', function (path) {
            touchCalled = true;
        });

        // when
        var result = r.getArtifactDirectory(artifactPath);

        // then
        test.equal(result, 'testrepo/abc/dev');
        test.ok(touchCalled);
        test.done();
        this.utilsHoraa.restore('touchDirectory');
    }
};