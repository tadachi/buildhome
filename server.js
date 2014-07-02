/*
* Dependencies:
* npm install express cpmmect body-parser method-override fs path vhost express.io
*
*
*/

var express         = require('express');

var bodyParser      = require('body-parser'); // Middleware that decodes JSON and POST parameters
var methodOverride  = require('method-override'); // Middleware that simulates DELETE (delete specified file on origin server) and PUT (Store file on origin server).
var fs              = require('fs'); // Read and write to files through nodejs.
var path            = require('path'); // Useful for manipulating strings that reference paths to files.

var router          = express.Router();
var vhost           = require('vhost');

var app             = require('express.io')();
var port            = parseInt(process.env.PORT, 10) || 4000;

app.http().io(); // Initialize the server.

/*
 * Configure the server.
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

// parse application/json
app.use(bodyParser.json());

app.use(methodOverride());

app.listen(port); // Listen through the specified port.
app.enable('trust proxy');

/*
 * Initialize website.
 */

// This app is routed to a variable called homepage called homepage calling express.io. You can host multiple websites by following homepage as a template.
var homepage = require('express.io')();
var multitwitchchat = require('express.io')();
var srlplayer = require('express.io')();

/*
 * Setup the website resources
 */

// This has to be relative to where your html files are located, etc. In this case it is in App.
homepage.use('/js', express.static(__dirname + '/homepage/view/js'));
homepage.use('/css', express.static(__dirname + '/homepage/view/css'));
homepage.use('/img', express.static(__dirname + '/homepage/view/img'));

multitwitchchat.use('/js', express.static(__dirname + '/multitwitchchat/app/js'));
multitwitchchat.use('/css', express.static(__dirname + '/multitwitchchat/app/css'));
multitwitchchat.use('/img', express.static(__dirname + '/multitwitchchat/app/img'));

srlplayer.use('/js', express.static(__dirname + '/srlplayer/app/js'));
srlplayer.use('/css', express.static(__dirname + '/srlplayer/app/css'));
srlplayer.use('/img', express.static(__dirname + '/srlplayer/app/img'));

//home.set('jsonp callback', true);

/* Add specific headers before you send a response to your client. */
//home.use(function (req, res, next) {
    // Website you wish to allow to connect via CORS
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");

    // Request methods you wish to allow
//	res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Pass to next layer of middleware
    //next();
//});

app.use(vhost('www.tak.com', homepage)); // Vhost allows you to host multiple websites on the same server.
app.use(vhost('mtc.tak.com', multitwitchchat)); // Vhost allows you to host multiple websites on the same server.
app.use(vhost('srl.tak.com', srlplayer)); // Vhost allows you to host multiple websites on the same server.

/*
 * Routing
 */
homepage.get('/', function(req, res) {
    res.sendfile(__dirname + '/homepage/view/index.html');
    //req.io.route('homepage');
})

multitwitchchat.get('/', function(req, res) {
    res.sendfile(__dirname + '/multitwitchchat/app/index.html');
})
srlplayer.get('/', function(req, res) {
    res.sendfile(__dirname + '/srlplayer/app/index.html');
})

/* Outputs the users' ips visiting your website. */
// app.io.route('homepage', function (req) {
    // console.log('homepage: ' + req.ip);
// });

/* Debug */
console.log(__dirname);
console.log(__dirname + '/app/');
console.log('Listening on port: ' + port);
