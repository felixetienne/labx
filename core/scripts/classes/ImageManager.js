(function(fs){

    module.exports = function (){

        var _rootPath = __dirname + "/../../../public";

        this.testImage = function(imagePath, imageExistsAction, imageNotExistsAction){
            var fullPath = _rootPath + imagePath;
            fs.exists(fullPath, function(exists){
                if(exists) {
                    if(imageExistsAction != null) imageExistsAction();
                    return;
                }
                if(imageNotExistsAction != null) imageNotExistsAction();
            });
        };

        this.writeImageSync = function(imagePath, rawData){
            var fullPath = _rootPath + imagePath;
            fs.writeFileSync(fullPath, rawData);
        };

        this.writeImage = function(imagePath, rawData){
            var fullPath = _rootPath + imagePath;
            fs.writeFile(fullPath, rawData);
        };
    }

})(require('fs'));
