var http = require('http'),
    fs = require('fs'),
    repo = require('./repository.js');

function handleDownload(repository, artifactPath, req, res) {
    if (repository.artifactExists(artifactPath)) {
        var fullPath = repository.getArtifactFullPath(artifactPath);
        console.log('Serving ' + fullPath);

        var stream = fs.createReadStream(fullPath);
        res.writeHead(200);
        stream.pipe(res);
    } else {
        console.log('Not found ' + fullPath);
        res.writeHead(404, 'Not found');
        res.end(artifactPath + ' not found');
    }
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

function handleUpload(repository, artifactPath, req, res) {
    var fullPath = repository.getArtifactFullPath(artifactPath);
    var dir = repository.getArtifactDirectory(artifactPath);

    writeUpload(req, fullPath, res);
}

function handleHead(repository, artifactPath, req, res) {
    console.log('Check artifact presence ' + artifactPath);
  
    var stat = repository.statArtifact(artifactPath)
  
    if (stat) {
        res.writeHead(200, 'OK', {
            'Last-Modified': stat.mtime.toUTCString()
        });
    } else {
        res.writeHead(404, 'Not found');
    }
    res.end();
}

function handleRepository(repository, artifactPath, req, res) {
    switch (req.method) {
    case 'GET':
        handleDownload(repository, artifactPath, req, res);
        break;
    case 'PUT':
        handleUpload(repository, artifactPath, req, res);
        break;
    case 'HEAD':
        handleHead(repository, artifactPath, req, res);
        break;
    default:
        res.writeHead(400, 'Unsupported operation.');
        console.log('Unsupported operation');
        res.end('Unsupported operation.');
    }
}

exports.requestHandler = function(req, res) {
    var repositoryId = req.url.split(/\//)[1];
    var artifactPath = req.url.substring(('/' + repositoryId).length); 

    var repository = repo.getRepository(repositoryId);

    if (repository) {
        handleRepository(repository, artifactPath, req, res);
    } else {
        console.log('Repository URL not found ' + req.url);
        res.writeHead(404, 'Repository not found');
        res.end('Repository ' + repositoryId + ' not found');
    }
};