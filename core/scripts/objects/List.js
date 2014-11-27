module.exports = function List(){

    var _container = new Array();
    var isInRange = function(index){ return index >= 0 && index < _container.length; }
    var clipFromRange = function(index){ return Math.max(0, Math.min(_container.length - 1, index)); }
    this.count = function(){ return _container.length; }
    this.contains = function(value){ return _container.indexOf(value) >= 0; }
    this.push = function(value){ _container.push(value); return this; }
    this.pop = function(){ return _container.pop(); }
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
    this.at = function(index){ return isInRange(index) ? _container[i] : null; }
    this.removeAt = function(index){
        var position = clipFromRange(index);
        _container.splice(position, 1);
    }
    this.clear = function(){ _container.splice(0, _container.length); }
}
