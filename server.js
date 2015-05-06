var express         = require('express');
var vhost           = require('vhost');
var httpPort        = parseInt(process.env.PORT, 10) || 4000;
//var httpsPort       = parseInt(process.env.PORT, 10) || 4001;
var favicon         = require('serve-favicon');

var events          = require('events');
var eventEmitter    = new events.EventEmitter();

var app             = express();
var geoip           = require('geoip-lite');

var fs              = require('fs');
var https           = require('https');

// SSL stuff. Do git commit paths to your actual keys. Edit the paths after cloning.
//var privateKey  = fs.readFileSync('YOUR PATH', 'utf8');
//var certificate = fs.readFileSync('YOUR PATH', 'utf8');
//var options = {key: privateKey, cert: certificate};

// Simple timestamp function. Invoke with timestamp();
htimeStamp = function() {
    var date = new Date();
    result = '[' + date.getFullYear() + '/' + date.getMonth() + '/' +
        date.getDate() + '/' + date.getHours() + ':' +
        date.getMinutes() + ':' + date.getSeconds() + ']';
    return result;
}

/**
 * Configure Logger
 */
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'myapp'});

/**
 *  Configure the HTTP webServer.
 */
var httpServer = app.listen(httpPort, function() {
    //debug('Express webServer listening on httpPort ' + webServer.address().httpPort);
    console.log(__dirname);
    console.log('Listening on httpPort: ' + httpPort);
    console.log('node -v: ' + process.versions.node);
});

/**
 *  Configure the HTTPS webServer. and launch it.
 */
//var httpsServer  = https.createServer(options, app).listen(httpsPort, function() {
//    //debug('Express webServer listening on httpPort ' + webServer.address().httpPort);
//    console.log(__dirname);
//    console.log('Listening on httpPort: ' + httpsPort);
//    console.log('node -v: ' + process.versions.node);
//});

var ioHttp = require('socket.io').listen(httpServer);
//var ioHttps = require('socket.io').listen(httpsServer);

/**
 *  Initialize website(s).
 */
// This app is routed to a variable called homepage called homepage calling express.io. You can host multiple websites by following homepage as a template.
var homepage = express();
var multitwitchchat = express();
var srlplayer2 = express();

/**
 *  Explicitly setup the website(s)' resources.
 */
// This has to be relative to where your html files are located, etc. In this case it is in App.
homepage.use('/js', express.static(__dirname + '/homepage/view/js'));
homepage.use('/css', express.static(__dirname + '/homepage/view/css'));
homepage.use('/img', express.static(__dirname + '/homepage/view/img'));
homepage.use('/fonts', express.static(__dirname + '/homepage/view/fonts'));
homepage.use('/pdf', express.static(__dirname + '/homepage/view/pdf'));
homepage.use('/res', express.static(__dirname + '/homepage/view/res'));
homepage.use('/webm', express.static(__dirname + '/homepage/view/webm'));

multitwitchchat.use('/js', express.static(__dirname + '/multi-twitch-chat/app/js'));
multitwitchchat.use('/css', express.static(__dirname + '/multi-twitch-chat/app/css'));
multitwitchchat.use('/img', express.static(__dirname + '/multi-twitch-chat/app/img'));

srlplayer2.use('/js', express.static(__dirname + '/srlplayer2/app/js'));
srlplayer2.use('/css', express.static(__dirname + '/srlplayer2/app/css'));
srlplayer2.use('/img', express.static(__dirname + '/srlplayer2/app/img'));

// Set the Favicon.
app.use(favicon(__dirname + '/favicon.ico'));

/**
 *  Serve web content.
 */
homepage.get('/', function(req, res) {
    res.sendFile(__dirname + '/homepage/view/index.html');
    eventEmitter.emit('process IP', req.ip);
})

multitwitchchat.get('/multitwitchchat', function(req, res) {
    res.sendFile(__dirname + '/multi-twitch-chat/app/index.html');
    eventEmitter.emit('process IP', req.ip);
})
srlplayer2.get('/srlplayer2', function(req, res) {
    res.sendFile(__dirname + '/srlplayer2/app/index.html');
    eventEmitter.emit('process IP', req.ip);
})

// Actual domain names.
//app.use(vhost('www.takbytes.com', homepage ));
//app.use(vhost('www.takbytes.com/multitwitchchat', multitwitchchat ));
//app.use(vhost('www.takbytes.com/srlplayer2/', srlplayer2 ));
// Local host file domain names.
app.use(vhost('www.tak.com', homepage ));
app.use(vhost('www.tak.com', multitwitchchat ));
app.use(vhost('www.tak.com', srlplayer2 ));

// '*' denotes catch all. If the above routes do not trigger, respond with 404.
app.get('*', function(req, res, next) {
    res.sendFile(__dirname + '/html-error-pages/404.html');
});

/**
 *  Events
 */
eventEmitter.on('process IP', function(ip) {
    log.info({'time' : htimeStamp()}, geoip.lookup(ip));
});

/**
 * Socket.io Server-side. HTTP
 */
ioHttp.on('connection', function(socket){ // By default io looks for 'connection' message.
    socket.on('connect srl', function(msg){
        ioHttp.emit('connected srl', ioHttp.engine.clientsCount);
        //console.log(htimeStamp() + " event: connected - connected users: " + io.engine.clientsCount);
    });

    // Disconnect such as closing tab and exiting webpage.
    socket.on('disconnect', function() {
        ioHttp.emit('connected srl', ioHttp.engine.clientsCount);
        //console.log(htimeStamp() + " event: disconnected - connected users: " + io.engine.clientsCount);
    });
});

/**
 * Socket.io Server-side. HTTPS
 */
//ioHttps.on('connection', function(socket){ // By default io looks for 'connection' message.
//    socket.on('connect srl', function(msg){
//        ioHttps.emit('connected srl', ioHttps.engine.clientsCount);
//        //console.log(htimeStamp() + " event: connected - connected users: " + io.engine.clientsCount);
//    });
//
//    // Disconnect such as closing tab and exiting webpage.
//    socket.on('disconnect', function() {
//        ioHttps.emit('connected srl', ioHttps.engine.clientsCount);
//        //console.log(htimeStamp() + " event: disconnected - connected users: " + io.engine.clientsCount);
//    });
//});