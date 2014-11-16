module.exports = function List(){

    var container = new Array();

    this.count = function(){ return container.length; }

    this.contains = function(obj){

        for(var i = 0; i < container.length; i++){
            if(container[i] === obj) return true;
        };

        return false;
    };

    this.remove = function(obj){

        for(var i = 0; i < container.length; i++){
            if(container[i] === obj){
                container.splice(i, 1);
                return this;
            }
        };
        return this;
    }

    this.add = function(obj){
        if(this.contains(obj)) return this;
        container.push(obj);
        return this;
    }

    this.at = function(i){
        return i>=container.length ? null : container[i];
    }
}
