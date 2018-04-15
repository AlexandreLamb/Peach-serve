//imports

var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

//constante

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^[a-zA-Z]\w{3,14}$/;
//routes

module.exports = {
    register: function (req, res) {
        var email    = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var bio      = req.body.bio;
        var allergies = req.body.allergies;
        var age      = req.body.age;
        if (email == null || username == null || password == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }
        if(username.lenght >=13 || username.lenght<=4) {
            return res.status(400).json({'error': 'wrong usernam (5-12)'});
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({'error': 'wrong email'});
        }
        if(!PASSWORD_REGEX.test(password)) {
           return res.status(400).json({'error': 'wrong password type'});
        }

        asyncLib.waterfall([
            function(done) {
                models.user.findOne({
                    attributes: ['username'],
                    where: { username: username }
                })
                .then(function (userFound) {
                    done(null, userFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'unable to verify user'});
                })
            },
            function(userFound, done) {
                if(!userFound) {
                    bcrypt.hash(password,5,function(err,bcryptedPassword){
                        done(null,userFound,bcryptedPassword);
                    }); 
                } else {
                    return res.status(409).json({'error': 'user already exist'});
                }
            },
            function(userFound,bcryptedPassword,done) {
                var newuser = models.user.create({
                    email: email,
                    username: username,
                    password: bcryptedPassword,
                    bio: bio,
                    isAdmin: 0,
                    allergies: allergies,
                    age: age
                })
                .then(function(newuser){
                    done(newuser);
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'cannot add user'});
                });
            }
        ], function(newuser) {
                if(newuser) {
                    return res.status(201).json({'userId': newuser.id });
                } else {
                    return res.status(400).json({'error': 'cannot add user'}); 
                }
        });
    },
    login: function(req ,res) {
        console.log( req.body.username);
        var username = req.body.username;
        var password = req.body.password;

        if (username == null || password == null) {
            return res.status(400).json({
                'error': 'missing paramters'
            });
        }

        asyncLib.waterfall([
            function(done) {
                models.user.findOne({
                     where: {username:username}
                })
                .then(function(userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function(userFound, done) {
                if(userFound) {
                    bcrypt.compare(password, userFound.password, function (errBcrypt, resBcrypt) {
                        done(null,userFound,resBcrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not existe in the DB' });
                }
            },
            function(userFound,resBcrypt,done) {
                if(resBcrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function(userFound) {
                if(userFound) {
                    return res.status(201).json({'success': userFound.username });
                } else  {
                    return res.status(500).json({'error': 'cannot log on user'});
                }   
            });
    },
    getUserProfil: function(req, res) {
            var headerAuth = req.headers['authorization'];
            var userId     = jwtUtils.getUserId(headerAuth);

            if( userId < 0)
            return res.status(400).json({'error':'wrong token'});
       
            models.user.findOne({
                attributes: ['id','email','username','bio'],
                where: { id: userId }
            }).then(function(user){
                if(user) {
                    res.status(201).json(user);
                } else {
                    res.status(404).json({'error' : 'user not found'});
                }
            }).catch(function(err) {
                res.status(500).json({'error' : 'cannot fetch user'});
            });     
    },
    updateUserProfil: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userId     = jwtUtils.getUserId(headerAuth);

        var bio = req.body.bio;

        asyncLib.waterfall([
            function(done) {
                models.user.findOne({
                    attributes: ['id', 'bio'],
                    where: { id:userId }
                }).then(function (userFound){
                    done(null,userFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'unable to verify user'})
                });
            },
            function(userFound,done) {
                if(userFound) {
                    userFound.update({
                        bio: ( bio ? bio : userFound.bio )
                    }).then(function(){
                        done(userFound);
                    })
                    .catch(function(err) {
                         res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                     res.status(404).json({'error': 'user not found'});
                }
            },
        ], function(userFound) {
                if(userFound) {
                    return res.status(201).json(userFound);
                } else {
                    return res.status(500).json({'error': 'cannot update user profil'});
                }
            });
        }
}
