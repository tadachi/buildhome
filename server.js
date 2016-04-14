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

/*
 * USE NGINX upstream for SSL/HTTPS!!
 * /

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

var ioHttp = require('socket.io').listen(httpServer);

/**
 *  Initialize website(s).
 */
// This app is routed to a variable called homepage called homepage calling express. You can host multiple websites by following homepage as a template.
var home = express();

// Config for router.
home.set('strict routing', true);
home.enable('case sensitive routing');

/**
 *  Explicitly setup the website(s)' resources.
 */
home.use('/js', express.static(__dirname + '/homepage/view/js'));
home.use('/css', express.static(__dirname + '/homepage/view/css'));
home.use('/img', express.static(__dirname + '/homepage/view/img'));
home.use('/fonts', express.static(__dirname + '/homepage/view/fonts'));
home.use('/pdf', express.static(__dirname + '/homepage/view/pdf'));
home.use('/res', express.static(__dirname + '/homepage/view/res'));
home.use('/webm', express.static(__dirname + '/homepage/view/webm'));

home.use('/multi-twitch-chat/js', express.static(__dirname + '/multi-twitch-chat/app/js'));
home.use('/multi-twitch-chat/css', express.static(__dirname + '/multi-twitch-chat/app/css'));
home.use('/multi-twitch-chat/img', express.static(__dirname + '/multi-twitch-chat/app/img'));

home.use('/srlplayer2/js', express.static(__dirname + '/srlplayer2/app/js'));
home.use('/srlplayer2/css', express.static(__dirname + '/srlplayer2/app/css'));
home.use('/srlplayer2/img', express.static(__dirname + '/srlplayer2/app/img'));

home.use('/match-follows/js', express.static(__dirname + '/match-follows-for-twitch/www/js'));
home.use('/match-follows/css', express.static(__dirname + '/match-follows-for-twitch/www/css'));
home.use('/match-follows/fonts', express.static(__dirname + '/match-follows-for-twitch/www/fonts'));
home.use('/match-follows/images', express.static(__dirname + '/match-follows-for-twitch/www/images'));

home.use('/manga-front/js', express.static(__dirname + '/manga-front/js'));
home.use('/manga-front/css', express.static(__dirname + '/manga-front/css'));
home.use('/manga-front/fonts', express.static(__dirname + '/manga-front/fonts'));
home.use('/manga-front/manga_index', express.static(__dirname + '/manga-front/manga_json'));
home.use('/manga-front/manga_index', express.static(__dirname + '/manga-front/manga_index'));
home.use('/manga-front/manga', express.static(__dirname + '/manga-front/manga'));

home.use('/streamy/js', express.static(__dirname + '/streamy/js'));
home.use('/streamy/css', express.static(__dirname + '/streamy/css'));
home.use('/streamy/assets', express.static(__dirname + '/streamy/assets'));

// Set the Favicon.
app.use(favicon(__dirname + '/favicon.ico'));

/**
 * Redirect rules.
 */
home.get('/multi-twitch-chat', function(req, res) {
    res.redirect('/multi-twitch-chat/')
});
home.get('/srlplayer2', function(req, res) {
    res.redirect('/srlplayer2/')
});
home.get('/match-follows', function(req, res) {
    res.redirect('/match-follows/')
});
home.get('/manga-front', function(req, res) {
    res.redirect('/manga-front/')
});
home.get('/streamy', function(req, res) {
    res.redirect('/streamy/')
});

/**
 *  Serve web content.
 */
home.get('/', function(req, res) {
    res.sendFile(__dirname + '/homepage/view/index.html');
    eventEmitter.emit('process IP', req.ip);
});
home.get('/multi-twitch-chat/', function(req, res) {
    res.sendFile(__dirname + '/multi-twitch-chat/app/index.html');
    eventEmitter.emit('process IP', req.ip);
});
home.get('/srlplayer2/', function(req, res) {
    res.sendFile(__dirname + '/srlplayer2/app/index.html');
    eventEmitter.emit('process IP', req.ip);
});
home.get('/match-follows/', function(req, res) {
    res.sendFile(__dirname + '/match-follows-for-twitch/www/index.html');
    eventEmitter.emit('process IP', req.ip);
});
home.get('/manga-front/', function(req, res) {
    res.sendFile(__dirname + '/manga-front/index.html');
    eventEmitter.emit('process IP', req.ip);
});
home.get('/streamy/', function(req, res) {
    res.sendFile(__dirname + '/streamy/index.html');
    eventEmitter.emit('process IP', req.ip);
});

// Actual domain names.
app.use(vhost('www.takbytes.com', home));

// Local host file domain names.
//app.use(vhost('www.tak.com', home));

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