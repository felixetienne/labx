module.exports = function(){

    Array.prototype.contains = function(obj){

        for(var i = 0; i < this.length; i++){
            if(this[i] === obj) return true;
        };

        return false;
    };

    Array.prototype.remove = function(obj){

        for(var i = 0; i < this.length; i++){
            if(this[i] === obj){
                this.splice(i, 1);
                return this;
            }
        };
        return this;
    }

    Array.prototype.add = function(obj){
        if(this.contains(obj)) return this;
        this.push(obj);
        return this;
    }
};
