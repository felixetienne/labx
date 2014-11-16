module.exports = function Notificator(){

    require('./List')();

    var registry = new List();

    this.subscribe = function(obj){
        if(registry.contains(obj)) return this;
        registry.add(obj);
        return this;
    };

    this.remove = function(obj){
        registry.remove(obj);
        return this;
    }

    this.notify = function(notification){

        for(var i = 0; i< registry.length; i++){
            var o = registry.at(i);
            if(!o.receiveNotification) {
                console.log('Registry oject ' + o + 'does not contains the method \'receiveNotification\'.');
                continue;
            };
            o.receiveNotification(notification);
        }

        return this;
    }
}
