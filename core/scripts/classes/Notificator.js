(function(List){

    module.exports = function Notificator(){

        var _registry = new List();

        this.subscribe = function(obj){
            if(_registry.contains(obj)) return this;
            _registry.add(obj);
            return this;
        };

        this.remove = function(obj){
            _registry.remove(obj);
            return this;
        }

        this.notify = function(notification){

            for(var i = 0; i< _registry.length; i++){
                var o = _registry.at(i);
                if(!o.receiveNotification) {
                    console.log('Registry oject ' + o + 'does not contains the method \'receiveNotification\'.');
                    continue;
                };
                o.receiveNotification(notification);
            }

            return this;
        }
    }

})(require('./List'));
