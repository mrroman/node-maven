var horaa = require('horaa'),
    utils = require('../lib/utils.js'),
    nodemock = require('nodemock');

exports.shouldCreateDirectoryIfPathNotExists = function(test) {
    // given
    var fsHoraa = horaa('fs'),
        mkdirpHoraa = horaa('mkdirp'),
        statCalled = false,
        mkdirpCalled = false;
    
    fsHoraa.hijack('statSync', function(path) {
        statCalled = true;
        throw { code: 'ENOENT' };
    });
    mkdirpHoraa.hijack('sync', function(path) {
        mkdirpCalled = true;
    });

    // when
    utils.touchDirectory('testpath');

    // then
    test.ok(statCalled, 'Stat on path not called');
    test.ok(mkdirpCalled, 'Make dir was not called');
    test.done();
};

exports.shouldNotCreateDirectoryWhenDirectoryExists = function(test) {
    // given
    var fsHoraa = horaa('fs'),
        mkdirpHoraa = horaa('mkdirp'),
        statCalled = false,
        mkdirpCalled = false;
  
    fsHoraa.hijack('statSync', function(path) {
        statCalled = true;
    });
    mkdirpHoraa.hijack('sync', function(path) {
        mkdirpCalled = true;
    });

    // when
    utils.touchDirectory('testpath');

    // then
    test.ok(statCalled, 'Stat on path not called');
    test.ok(!mkdirpCalled, 'Make dir was called');
    test.done();
};
