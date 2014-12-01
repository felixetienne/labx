(function(){

    module.exports = function (testedObject, condition, callback){

        var _error = false;
        var _testedObject = testedObject;

        this.errorOccur = function(){ _error = true; }

        this.hasError = function(){ return _error; }

        this.tryCallback = function(action){

            if(action) action(_testedObject);

            if(condition(_testedObject)){
                callback(_testedObject);
                return true;
            }

            return false;
        }
    }

})();
