//imports
var models = require('../models');
var asyncLib = require('async');




module.exports = {
    register: function (req, res) {
        var codeBarre    = req.body.codeBarre;
        var dangerous = req.body.dangerous;
        var nameMoleculeDangerous = req.body.nameMoleculeDangerous;
        var name      = req.body.name;
        var description = req.body.description;
        var image      = req.body.image;
        
        if (codeBarre == null || name == null || description == null) {
            return res.status(400).json({'error': 'missing parameters'});
        }
       
        // TODO: différents controle de conformité des informations

        asyncLib.waterfall([
            function(done) {
                models.pe.findOne({
                    attributes: ['name'],
                    where: { name: name }
                })
                .then(function (ProductFound) {
                    done(null, ProductFound);
                })
                .catch(function(err){
                    return res.status(500).json({'error': 'unable to verify Product'});
                })
            },
            function(ProductFound, done) {
                if(!ProductFound) {

                    var newProduct = models.Produit.create({
                        codeBarre: codeBarre,
                        username: username,
                        nameMoleculeDangerous: nameMoleculeDangerous,
                        name:name,
                        description: description,
                        image: img_name                    })
                    .then(function(newProduct){
                        done(newProduct);
                    })
                    .catch(function(err){
                        return res.status(500).json({'error': 'cannot add Product'});
                    }); 
                
                } 
                else {
                    return res.status(409).json({'error': 'Product already exist'});
                }
            },
          
        ], function(newProduct) {
                if(newProduct) {
                    return res.status(201).json({'userId': newProduct.codeBarre });
                } else {
                    return res.status(400).json({'error': 'cannot add Product'}); 
                }
        });
    }

}


//TODO: système pour importer des images 

/*
var file=req.files.pictures;
        var img_name=file.name;
if(!req.files)
                        {
                            return res.status(400).send('No files were uploaded.');
                        }

                     if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
                        file.mv('/pictures/'+file.name, function(err) {
                                           
                         if (err)
                           return res.status(500).send(err);

                           else 
                           {
                               return res.json( "This format is not allowed , please upload file with '.png','.gif','.jpg'");
                                
                           }*/