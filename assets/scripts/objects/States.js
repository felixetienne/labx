module.exports = function States(condition, callback){

    var error = false;

    this.errorOccur = function(){ error = true; }
    this.hasError = function(){ return error; }
    this.test = function(){
        if(condition()){
            callback();
            return true;
        }
        return false;
    }
}
