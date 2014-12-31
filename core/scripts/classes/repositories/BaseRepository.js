(function(ImageManager) {

  module.exports = function(pg, config) {
    var _fullDatabaseUrl = config.getDatabaseUrl() + "?ssl=true";
    var _imageFolder = config.getImageFolder();
    var _errors = [];

    this.imageManager = new ImageManager();

    this.isInvalidAction = function(action) {
      if (!action) throw "[ERROR:Dal:getAll] 'action' parameter is null.";
      if (typeof(action) !== "function") throw "[ERROR] The argument 'action' parameter is not a function.";
      return false;
    }

    this.hasResults = function(res) {
      return res && res.rows && res.rowCount > 0;
    }

    this.open = function(callback) {
      pg.connect(_fullDatabaseUrl, function(err, client) {
        if (err) throw "[ERROR:pg:connect] " + err;
        if (!client) throw "[ERROR:dal:pages:getAll] the parameter 'client' is null";
        callback(client);
      });
    }

    this.getErrors = function() {
      return _errors;
    }

    this.addError = function(error) {
      _errors.push(error);
    }

    this.close = function(client) {
      client.end();
    }

    this.extractImages = function(imageList) {
      var images = [];

      if (!imageList) return images;

      var imagesParts = imageList.split(';');

      for (var i = 0; i < imagesParts.length; i++) {
        var imagesPart = imagesParts[i];

        if (!imagesPart) continue;

        var imageParts = imagesPart.split(',');
        var image = {};

        for (var j = 0; j < imageParts.length; j++) {
          var part = imageParts[j];

          if (j === 0) {
            image.name = part;
          } else if (j === 1) {
            image.title = part;
          }
        }

        image.path = image.name ? _imageFolder + image.name + '.jpg' :
          null;

        images.push(image);
      }

      return images;
    }
  }

})(require('../ImageManager'));
