var horaa = require('horaa'),
    utils = require('../lib/utils.js'),
    nodemock = require('nodemock');

module.exports = {
    setUp: function(callback) {
        this.fsHoraa = horaa('fs');
        this.mkdirpHoraa = horaa('mkdirp');
        callback();
    },
 
    tearDown: function(callback) {
        callback();
    },

    shouldCheckIfPathExists: function(test) {
        // given
        var statCalled = false;

        this.fsHoraa.hijack('statSync', function(path) {
            statCalled = true;
            throw { code: 'ENOENT' };
        });

        // when
        test.ok(!utils.existsOnPath('testpath'));
        test.ok(statCalled, 'Stat on path not called');
        test.done();

        this.fsHoraa.restore('statSync');
    },
    
    shouldCreateDirectoryIfPathNotExists: function(test) {
        // given
        var statCalled = false,
            mkdirpCalled = false;
        
        this.fsHoraa.hijack('statSync', function(path) {
            statCalled = true;
            throw { code: 'ENOENT' };
        });
        this.mkdirpHoraa.hijack('sync', function(path) {
            mkdirpCalled = true;
        });
        
        // when
        utils.touchDirectory('testpath');
        
        // then
        test.ok(statCalled, 'Stat on path not called');
        test.ok(mkdirpCalled, 'Make dir was not called');
        test.done();        

        this.fsHoraa.restore('statSync');
        this.mkdirpHoraa.restore('sync');
    },

    shouldNotCreateDirectoryWhenDirectoryExists: function(test) {
        // given
        var statCalled = false,
            mkdirpCalled = false;
        
        this.fsHoraa.hijack('statSync', function(path) {
            statCalled = true;
        });
        this.mkdirpHoraa.hijack('sync', function(path) {
            mkdirpCalled = true;
        });
        
        // when
        utils.touchDirectory('testpath');
        
        // then
        test.ok(statCalled, 'Stat on path not called');
        test.ok(!mkdirpCalled, 'Make dir was called');
        test.done();

        this.fsHoraa.restore('statSync');
        this.mkdirpHoraa.restore('sync');
    }
};
