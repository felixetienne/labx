module.exports = function ImageManager(){

    var _fs = require('fs');

    var _rootPath = __dirname + "/../../../public";

    this.testImage = function(imagePath, imageExistsAction, imageNotExistsAction){
        var fullPath = _rootPath + imagePath;
        _fs.exists(fullPath, function(exists){
            if(exists) {
                imageExistsAction();
                return;
            }
            imageNotExistsAction();
        });
    };

    this.writeImage = function(imagePath, rawData){
        var fullPath = _rootPath + imagePath;
        _fs.writeFile(fullPath, rawData, function (error) {
          if (error) throw error;
        });
    };
}
