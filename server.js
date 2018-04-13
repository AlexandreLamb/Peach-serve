// Imports
var express    = require('express');
var bodyParser = require('body-parser');
var apiRouter  = require('./apiRouter').router;
var cors = require('cors');
//instatanciation serveur

var server = express();

// body parser config
server.use(bodyParser.urlencoded({extend: true}));
server.use(bodyParser.json());
server.use(cors());


//configuration route

server.get('/', function (req,res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>test</h1>')

});
server.use('/api/',apiRouter);

server.post('/api/test',function(req,res) {
    console.log(req.body);
    res.json(req.body);
});
// lancement du server
server.listen(8080,function(){
    console.log('server listening');
})