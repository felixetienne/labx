module.exports = function Notificator(){

    require('../extensions/ArrayExtensions')();

    var registry = new Array();

//    var contains = function(obj){
//
//        registry.forEach(function(o){
//            if(o === obj) return true;
//        });
//
//        return false;
//    }

    this.subscribe = function(obj){

        if(registry.contains(obj)) return this;

        registry.push(obj);

        return this;
    };

    this.remove = function(obj){

        if(!registry.contains(obj)) return this;

        registry.pop(obj);

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
