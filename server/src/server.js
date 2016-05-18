import express from 'express';
import vhost from 'vhost';
import favicon from 'serve-favicon';
import events from 'events';
import fs from 'fs';

/**
 * USE NGINX upstream for SSL/HTTPS!!
 */

/**
 * Globals
 */
let eventEmitter    = new events.EventEmitter();
let app             = express();

/**
 * Configuration
 */
let hostname = 'beastmachine';
// let hostname = 'www.takbytes.com'; // Production
let http_port = parseInt(process.env.PORT, 10) || 4000;

/**
 *  Configure the HTTP webServer.
 */
var httpServer = app.listen(http_port, function() {
    //debug('Express webServer listening on http_port ' + webServer.address().httpPort);
    console.log(__dirname);
    console.log('Listening on: ' + hostname + ':' + http_port);
    console.log('node -v: ' + process.versions.node);
});

var io = require('socket.io').listen(httpServer);

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

home.use('/streamy/remote-controller', express.static(__dirname + '/streamy/remote-controller/js'));

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
home.get('/streamy/remote-controller', function(req, res) {
    res.redirect('/streamy/remote-controller/')
});

/**
 *  Serve web content.
 */
home.get('/', function(req, res) {
    res.sendFile(__dirname + '/homepage/view/index.html');
});
home.get('/multi-twitch-chat/', function(req, res) {
    res.sendFile(__dirname + '/multi-twitch-chat/app/index.html');
});
home.get('/srlplayer2/', function(req, res) {
    res.sendFile(__dirname + '/srlplayer2/app/index.html');
});
home.get('/match-follows/', function(req, res) {
    res.sendFile(__dirname + '/match-follows-for-twitch/www/index.html');
});
home.get('/manga-front/', function(req, res) {
    res.sendFile(__dirname + '/manga-front/index.html');
});
home.get('/streamy/', function(req, res) {
    res.sendFile(__dirname + '/streamy/index.html');
});
home.get('/streamy/remote-controller/', function(req, res) {
    res.sendFile(__dirname + '/streamy/remote-controller/index.html');
});

// Local host file domain names.
app.use(vhost(hostname, home));

// '*' denotes catch all. If the above routes do not trigger, respond with 404.
app.get('*', function(req, res, next) {
    res.sendFile(__dirname + '/html-error-pages/404.html');
});

/**
 *  Events
 */
// STUB

/**
 * Socket.io Server-side. HTTP
 */

// srlplayer2 socket.io stuff.
io.on('connection', function(socket){ // By default io looks for 'connection' message.
    socket.on('connect srl', function(msg){
        io.emit('connected srl', io.engine.clientsCount);
    });

    // Disconnect such as closing tab and exiting webpage.
    socket.on('disconnect', function() {
        io.emit('connected srl', io.engine.clientsCount);
    });
});

// Streamy-remote-controller stuff. 
//test
let streamy_remote_controller = io.of('/remote-controller');


let user_map = new Map();

streamy_remote_controller.on('connection', function(socket) {
    console.log(`client ${socket.id} connected`);

    socket.on('join', function(room) { 
        console.log(`${socket.id} joining room:`, room);
        socket.join(room); 
    })
    
    socket.on('send', function(data) {
        console.log(`room: ${data.room} sending message: ${data.msg}`)
        streamy_remote_controller.in(data.room).emit('message', data.msg);
    });
   
    socket.on('disconnect', function (room) {
        console.log(`client ${socket.id} disconnected`);
    });
    
});

const util = require('util');

setInterval(function() {
    let mem = process.memoryUsage();
    console.log(
        `rss: ${parseInt(mem.rss/1000000)}M, heapTotal: ${parseInt(mem.heapTotal/1000000)}M, heapUsed: ${parseInt(mem.heapUsed/1000000)}M`
    );
}, 1000);