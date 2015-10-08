var http = require('http'),
    host = '192.168.1.131',
    port = '9000';

var fs = require('fs');
var path = require('path');

var mimes = {
    '.htm' : 'text/html',
    '.html' : 'text/html',
    '.css' : 'text/css',
    '.js' : 'text/javascript',
    '.gif' : 'image/gif',
    '.jpg' : 'image/jpg',
    '.png' : 'image/png',
    '.woff2' : 'application/x-font-woff',
    '.ttf' : 'application/octet-stream'
}

var server = http.createServer(function(req, res) {

    var filepath = ( req.url === "/") ? ('./index.html') : ('.' + req.url);

    var contentType = mimes[path.extname(filepath)];

    fs.exists(filepath, function(file_exists){
        
        if(file_exists){

            res.writeHead(200, {'Content-Type' : contentType});

            var streamFile = fs.createReadStream(filepath).pipe(res);

            streamFile.on('error', function(){
                res.writeHead(500);
            })

        }else{
            res.writeHead(404);
            res.end("Sorry, the minions could not find the file you requested.");
        }
        
    })

}).listen(port, host, function() {

    console.log('Listening in http://' + host + ':' + port);

});