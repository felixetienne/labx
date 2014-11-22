module.exports = function List(){

    var _container = new Array();

    this.count = function(){ return _container.length; }

    this.contains = function(obj){

        for(var i = 0; i < _container.length; i++){
            if(_container[i] === obj) return true;
        };

        return false;
    };

    this.remove = function(obj){

        for(var i = 0; i < _container.length; i++){
            if(_container[i] === obj){
                _container.splice(i, 1);
                return this;
            }
        };
        return this;
    }

    this.add = function(obj){
        if(this.contains(obj)) return this;
        _container.push(obj);
        return this;
    }

    this.at = function(i){
        return i >= _container.length ? null : _container[i];
    }

    this.clear = function(){
        _container.splice(0, _container.length);
    }
}
