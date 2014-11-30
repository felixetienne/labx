(function(fs){

    module.exports = function (){

        var _rootPath = __dirname + "/../../../public";

        this.testImage = function(imagePath, imageExistsAction, imageNotExistsAction){
            var fullPath = _rootPath + imagePath;
            fs.exists(fullPath, function(exists){
                if(exists) {
                    imageExistsAction();
                    return;
                }
                imageNotExistsAction();
            });
        };

        this.writeImage = function(imagePath, rawData){
            var fullPath = _rootPath + imagePath;
            fs.writeFile(fullPath, rawData, function (error) {
              if (error) throw error;
            });
        };
    }

})(require('fs'));
