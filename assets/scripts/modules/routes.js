
/*
 * GET home page.
 */

var repo = require('./repositories');

exports.index = function(req, res){
    var name = 'index';

    repo.pages.getFromName(name, function(page){

        res.render(name, {
            pageTitle: page.pageTitle,
            shortTitle: page.shortTitle,
            title: page.title,
            text: page.shortDescription
        });
    }, function(){
         res.render('404');
    });
};

exports.about = function(req, res){
    var name = 'about';

    repo.pages.getFromName(name, function(page){
        res.render(name, {
            pageTitle: page.pageTitle,
            shortTitle: page.shortTitle,
            title: page.title,
            text: page.shortDescription
        });
    }, function(){
         res.render('404');
    });
};

exports.contact = function(req, res){
    var name = 'contact';

    repo.pages.getFromName(name, function(page){
        res.render(name, {
            pageTitle: page.pageTitle,
            shortTitle: page.shortTitle,
            title: page.title,
            text: page.shortDescription
        });
    }, function(){
         res.render('404');
    });
};
