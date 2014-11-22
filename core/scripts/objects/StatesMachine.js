module.exports = function StatesMachine(condition, callback){

    var _error = false;

    this.errorOccur = function(){ _error = true; }

    this.hasError = function(){ return _error; }

    this.tryCallback = function(action){

        if(action) action();

        if(condition()){
            callback();
            return true;
        }

        return false;
    }
}
