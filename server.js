/*
* Dependencies:
* npm install express connect vhost express.io
*
*
*/
var express         = require('express');

var router          = express.Router();
var vhost           = require('vhost');

var app             = require('express.io')();
var port            = parseInt(process.env.PORT, 10) || 4000;

var favicon         = require('serve-favicon');

// Simple timestamp function. Invoke with timestamp();
htimestamp = function() {
    var date = new Date();
    result = '[' + date.getFullYear() + '/' + date.getMonth() + '/' +
        date.getDate() + '/' + date.getHours() + ':' +
        date.getMinutes() + ':' + date.getSeconds() + ']';
    return result;
}

app.http().io(); // Initialize the server.

/*
 * Configure the server.
 */

//Do not tell header that server is powered by Node.js
app.disable('x-powered-by');

app.listen(port); // Listen through the specified port.

/*
 * Setup 4xx 5xx error pages.
 */
app.use('/html-error-pages', express.static(__dirname + '/html-error-pages'));

/*
 * Initialize website(s).
 */

// This app is routed to a variable called homepage called homepage calling express.io. You can host multiple websites by following homepage as a template.
var homepage = require('express.io')();
var multitwitchchat = require('express.io')();
var srlplayer2 = require('express.io')();

/*
 * Explicitly setup the website(s)' resources.
 */

// This has to be relative to where your html files are located, etc. In this case it is in App.
homepage.use('/js', express.static(__dirname + '/homepage/view/js'));
homepage.use('/css', express.static(__dirname + '/homepage/view/css'));
homepage.use('/img', express.static(__dirname + '/homepage/view/img'));
homepage.use('/fonts', express.static(__dirname + '/homepage/view/fonts'))
homepage.use('/pdf', express.static(__dirname + '/homepage/view/pdf'));
homepage.use('/res', express.static(__dirname + '/homepage/view/res'));
homepage.use('/webm', express.static(__dirname + '/homepage/view/webm'));

multitwitchchat.use('/js', express.static(__dirname + '/multitwitchchat/app/js'));
multitwitchchat.use('/css', express.static(__dirname + '/multitwitchchat/app/css'));
multitwitchchat.use('/img', express.static(__dirname + '/multitwitchchat/app/img'));

srlplayer2.use('/js', express.static(__dirname + '/srlplayer2/app/js'));
srlplayer2.use('/css', express.static(__dirname + '/srlplayer2/app/css'));
srlplayer2.use('/img', express.static(__dirname + '/srlplayer2/app/img'));

app.use(vhost('www.takbytes.com', homepage)); // Vhost allows you to host multiple websites on the same server.
app.use(vhost('mtc.takbytes.com', multitwitchchat));
app.use(vhost('srl.takbytes.com', srlplayer2));
app.use(favicon(__dirname + '/favicon.ico'));

/*
 * Routing
 */
homepage.get('/', function(req, res) {
    res.sendfile(__dirname + '/homepage/view/index.html');
    req.io.route('log');
})

multitwitchchat.get('/', function(req, res) {
    res.sendfile(__dirname + '/multitwitchchat/app/index.html');
    req.io.route('log');
})
srlplayer2.get('/', function(req, res) {
    res.sendfile(__dirname + '/srlplayer2/app/index.html');
    req.io.route('log');
})

/* Outputs the users' ips visiting your website with a timestamp.*/
app.io.route('log', function (req) {
    console.log(htimestamp() + ' ' + req.ip);
});

// '*' denotes catch all. If the above routes do not trigger, respond with 404.
app.get('*', function(req, res, next) {
    res.sendfile(__dirname + '/html-error-pages/404.html');
});

/* Debug */
console.log(__dirname);
console.log('Listening on port: ' + port);
