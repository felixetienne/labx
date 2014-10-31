
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
        title: 'Home',
        text: 'lorem ipsum'
  })
};

exports.about = function(req, res){
     res.render('about', {
        title: 'About',
        text: 'lorem ipsum'
  })
};

exports.contact = function(req, res){
     res.render('contact', {
        title: 'Contact',
        text: 'lorem ipsum'
  })
};
