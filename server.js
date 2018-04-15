// Imports
var express   = require('express');
var bodyParser = require('body-parser');
var apiRouter  = require('./apiRouter').router;
var cors = require('cors');
//var fileUpload = require('express-fileupload');
//instatanciation serveur

var server = express();

// body parser config
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(cors());
//server.use(fileUpload()); 


//configuration route

server.get('/', function (req,res) {
    res.setHeader('Content-Type','text/html');
    res.status(200).send('<h1>test</h1>')

});
server.use('/api/',apiRouter);


// lancement du server
server.listen(8080,function(){
    console.log('server listening');
})