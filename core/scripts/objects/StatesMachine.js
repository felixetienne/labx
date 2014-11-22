module.exports = function StatesMachine(condition, callback){

    var error = false;

    this.errorOccur = function(){ error = true; }

    this.hasError = function(){ return error; }

    this.tryCallback = function(action){

        if(action) action();

        if(condition()){
            callback();
            return true;
        }

        return false;
    }
}
