var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var formidable = require('formidable');

exports.upload = function(request, response) {
    console.log('Rozpoczynam obsługę żądania upload.');
    var form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
        var uploadedFileName = fields.title + path.extname(files.upload.name);

        fs.renameSync(files.upload.path, uploadedFileName);

        fs.readFile('templates/upload.html', function(err, html) {
            response.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
            });

            response.write(
                html
                    .toString()
                    .replace(
                        'src="/show"',
                        'src="/show?name=' + uploadedFileName + '"'
                    )
            );
            response.end();
        });
    });
};

exports.welcome = function(request, response) {
    console.log('Rozpoczynam obsługę żądania welcome.');
    fs.readFile('templates/start.html', function(err, html) {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.write(html);
        response.end();
    });
};

exports.show = function(request, response) {
    fs.readFile(
        querystring.parse(url.parse(request.url).query).name,
        'binary',
        function(error, file) {
            response.writeHead(200, { 'Content-Type': 'image/png' });
            response.write(file, 'binary');
            response.end();
        }
    );
};

exports.error = function(request, response) {
    console.log('Nie wiem co robić.');
    response.write('404 :(');
    response.end();
};
