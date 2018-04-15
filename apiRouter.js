//imports

var express   = require('express');
var usersCtrl = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var pesCtrl = require('./routes/pesCtrl');


//Router

exports.router = (function() {
    var apiRouter = express.Router();

    //user routes
        apiRouter.route('/users/register/').post(usersCtrl.register);
        apiRouter.route('/users/login/').post(usersCtrl.login);
        apiRouter.route('/users/me/').get(usersCtrl.getUserProfil);
        apiRouter.route('/users/update/').put(usersCtrl.updateUserProfil);
        apiRouter.route('/register/Product').post(pesCtrl.register); 
    
    //message routes
        apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
        apiRouter.route('/messages/').get(messagesCtrl.listMessages);


    return apiRouter;

})();