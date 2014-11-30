module.exports = function (){

    var _container = new Array();
    var clipFromRange = function(index){ return Math.max(0, Math.min(_container.length - 1, index)); }
    var isOutOfRange = function(index){ return index < 0 || index >= _container.length; }

    this.count = function(){ return _container.length; }
    this.contains = function(value){ return _container.indexOf(value) >= 0; }
    this.push = function(value){ _container.push(value); return this; }
    this.pop = function(){ return _container.pop(); }
    this.pushMany = function(values){
        for(var i=0; i<values.length; i++){
            _container.push(values[i]);
        }
        return this;
    }
    this.popMany = function(quantity){
        var array = [];
        for(var i=0; i<quantity; i++){
            array.push(_container.pop());
        }
        return array;
    }
    this.splitAt = function(index){
        var list = new List();
        if(isOutOfRange(index)) return list;
        for(var i=index; i<_container.length; i++){
               list.add(_container.pop());
        }
        return list;
    }
    this.remove = function(value){
        var position = _container.indexOf(value);
        if(position < 0) return this;
        _container.splice(position, 1);
        return this;
    }
    this.add = function(value, index){
        var position = isNaN(index) ? _container.length - 1 : clipFromRange(index);
        _container.splice(position, 0, value);
        return this;
    }
    this.at = function(index){ return isOutOfRange(index) ? null : _container[i]; }
    this.removeAt = function(index){
        if(isOutOfRange(index)) return this;
        _container.splice(index, 1);
        return this;
    }
    this.clear = function(){ _container.splice(0, _container.length); }
    this.toArray = function(){
        var array = [];
        for(var i = 0; i<_container.length; i++){
            array.push(_container[i]);
        }
        return array;
    }
    this.do = function(f){
        for(var i=0; i<_container.length; i++){
            f(_container[i], i);
        }
        return this;
    }
    this.print = function(){
        console.log(_container);
        return this;
    }
}
