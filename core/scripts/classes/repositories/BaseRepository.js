(function(pg, config, ImageManager) {

  module.exports = function() {
    var _fullDatabaseUrl = config.getDatabaseUrl() + "?ssl=true";
    var _imageFolder = config.getImageFolder();
    var _imageExtension = 'jpg';
    var _errors = [];

    this.imageManager = new ImageManager();

    this.buildImagePath = buildImagePath;

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

    this.getConfig = function() {
      return config;
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

    this.extractMedias = function(mediaList, areImages) {
      var delimiters = {
        media: '|',
        property: '^'
      };
      var medias = [];

      if (!mediaList) return medias;

      var mediasParts = mediaList.split(delimiters.media);

      for (var i = 0; i < mediasParts.length; i++) {
        var mediasPart = mediasParts[i];

        if (!mediasPart) continue;

        var mediaParts = mediasPart.split(delimiters.property);
        var media = {};

        for (var j = 0; j < mediaParts.length; j++) {
          var mediaPart = mediaParts[j];

          if (areImages) {
            mapImageProperty(media, j, mediaPart);
          } else {
            mapMediaProperty(media, j, mediaPart);
          }
        }

        if (areImages) {
          media.path = buildImagePath(media);
        }

        medias.push(media);
      }

      return medias;
    }

    function mapImageProperty(image, index, property) {
      if (index === 0) {
        image.name = property;
      } else if (index === 1) {
        image.title = property;
      }
    }

    function mapMediaProperty(media, index, property) {
      if (index === 0) {
        media.content = property;
      } else if (index === 1) {
        media.title = property;
      } else if (index === 2) {
        media.typeName = property;
      } else if (index === 3) {
        media.typeTitle = property;
      }
    }

    function buildImagePath(image) {
      if (!image.name) return null;

      var path = _imageFolder + image.name + '.' + _imageExtension;

      return path;
    }
  }

})(
  require('pg'),
  require('../../modules/appConfig'),
  require('../ImageManager'));
