module.exports = function Notificator(){

    require('../extensions/ArrayExtensions')();

    var registry = new Array();

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
            var o = registry[i];
            if(!o.receiveNotification) {
                console.log('Registry oject ' + o + 'does not contains the method \'receiveNotification\'.');
                continue;
            };
            o.receiveNotification(notification);
        }

        return this;
    }

    //this.getSubscribers = function(){ return registry; }
}
