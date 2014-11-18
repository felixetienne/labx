module.exports = function ImageManager(){

    var fs = require('fs');

    var rootPath = __dirname + "/../../../public";

    this.testImage = function(imagePath, imageExistsAction, imageNotExistsAction){
        var fullPath = rootPath + imagePath;
        fs.exists(fullPath, function(exists){
            if(exists) {
                imageExistsAction();
                return;
            }
            imageNotExistsAction();
        });
    };

    this.writeImage = function(imagePath, rawData){
        var fullPath = rootPath + imagePath;
        fs.writeFile(fullPath, rawData, function (error) {
          if (error) throw error;
        });
    };
}
