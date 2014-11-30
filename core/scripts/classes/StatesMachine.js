(function(){

    module.exports = function StatesMachine(condition, callback){

        var _error = false;

        this.errorOccur = function(){ _error = true; }

        this.hasError = function(){ return _error; }

        this.tryCallback = function(x, action){

            if(action) action(x);

            if(condition(x)){
                callback(x);
                return true;
            }

            return false;
        }
    }

})();
