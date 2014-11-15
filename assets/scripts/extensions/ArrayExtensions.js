module.exports = function(){

    Array.prototype.contains = function(obj){

        this.forEach(function(o){
            if(o === obj) return true;
        });

        return false;
    };

};
