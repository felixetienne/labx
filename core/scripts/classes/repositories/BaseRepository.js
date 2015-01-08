(function(config, ImageManager) {

  module.exports = function() {
    var _imageFolder = config.getImageFolder();
    var _imageExtension = 'jpg';
    var _errors = [];

    this.imageManager = new ImageManager();
    this.buildImagePath = buildImagePath;
    this.addError = addError;

    this.executeQuery = function(client, query, emptyAction, callback) {

      testFunctions([callback, emptyAction], function(e) {
        client.end();
        throw e;
      });

      client.query(query, function(err, res) {

        if (err) {
          addError(new Error(error, 500));
          emptyAction();
          return;
        }

        if (hasResults(res)) {
          callback(res);
        } else {
          emptyAction();
        }
      });
    }

    this.getConfig = function() {
      return config;
    }

    this.getErrors = function() {
      return _errors;
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

        if (areImages)
          media.path = buildImagePath(media);

        medias.push(media);
      }

      return medias;
    }

    function testFunctions(functions, errorFunction) {

      functions.forEach(function(f) {
        var error;

        if (!f) {
          error = '[ERROR] The function is null.';
        } else if (typeof(f) !== 'function') {
          error = '[ERROR] The object is not a function.';
        }

        if (!error) {
          return;
        }

        if (errorFunction && typeof(errorFunction) === 'function') {
          errorFunction(error);
          return;
        }

        throw error;
      });
    }

    function hasResults(res) {
      return res && res.rows && res.rowCount > 0;
    }

    function addError(error) {
      _errors.push(error);
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
  require('../../modules/appConfig'),
  require('../ImageManager'));
