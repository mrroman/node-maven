var http = require('http'),
    fs = require('fs'),
    config = require('./config.js').options,
    mkdirp = require('mkdirp');

function getRepoRequest(path) {
    var repoRequest = {};
    
    repoRequest.repositoryId = path.split(/\//)[1];
    repoRequest.artifactPath = path.substring(('/' + repoRequest.repositoryId).length);

    return repoRequest;
}

function handleDownload(repository, repoRequest, req, res) {
    var fullPath = repository.path + repoRequest.artifactPath;
    
    fs.stat(fullPath, function(err, st) {
        if (err) {
            console.log('Not found ' + fullPath);
            res.writeHead(404, 'Not found');
            res.end(repoRequest.artifactPath + ' not found');
        } else {
            console.log('Serving ' + fullPath);
            var stream = fs.createReadStream(fullPath);
            res.writeHead(200);
            stream.pipe(res);
        }
    });
}

function writeUpload(req, path, res) {
    console.log('Uploading ' + path);
    var stream = fs.createWriteStream(path);

    req.on('end', function() {
        res.writeHead(200);    
        res.end();
        stream.end();        
    });

    req.pipe(stream, { end: false });
    req.resume();
}

function handleUpload(repository, repoRequest, req, res) {
    var fullPath = repository.path + repoRequest.artifactPath;
    var dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

    fs.stat(dir, function(err, st) {
        if (err) {
            mkdirp(dir, function() {
                writeUpload(req, fullPath, res);
            });
        } else {
            writeUpload(req, fullPath, res);
        }
    });
}

function handleRepository(repository, repoRequest, req, res) {
    switch (req.method) {
    case 'GET':
        handleDownload(repository, repoRequest, req, res);
        break;
    case 'PUT':
        handleUpload(repository, repoRequest, req, res);
        break;
    default:
        res.writeHead(400, 'Unsupported operation.');
        console.log('Unsupported operation');
        res.end('Unsupported operation.');
    }
}

exports.requestHandler = function(req, res) {
    var repoRequest = getRepoRequest(req.url); 
    var repository = config.repositories[repoRequest.repositoryId];

    req.pause();

    if (repository) {
        handleRepository(repository, repoRequest, req, res);
    } else {
        console.log('Repository URL not found ' + req.url);
        res.writeHead(404, 'Repository not found');
        res.end('Repository ' + repoRequest.repositoryId + ' not found');
    }
};