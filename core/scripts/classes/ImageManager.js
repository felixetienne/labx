(function(fs) {

  module.exports = function() {

    var _rootPath = __dirname + "/../../../public";

    this.testImage = function(imagePath, imageExistsAction,
      imageNotExistsAction) {
      var fullPath = _rootPath + imagePath;
      fs.exists(fullPath, function(exists) {
        if (exists) {
          if (imageExistsAction) imageExistsAction();
          return;
        }
        if (imageNotExistsAction) imageNotExistsAction();
      });
    };

    this.writeImageSync = function(imagePath, rawData) {
      var fullPath = _rootPath + imagePath;
      fs.writeFileSync(fullPath, rawData);
    };

    this.writeImage = function(imagePath, rawData) {
      var fullPath = _rootPath + imagePath;
      fs.writeFile(fullPath, rawData);
    };
  }

})(require('fs'));
