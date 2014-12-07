"use strict";

window.main = window.main || {};

window.main.dependancies = (function(dependancies){

    dependancies.context = window.currentContext;
    dependancies.jQuery = window.jQuery;

    for(var k in dependancies){
        if(dependancies.hasOwnProperty(k) && typeof dependancies[k] === 'undefined') throw '[ERROR] The dependancy "' + k + '" is not defined.';
    }

    return dependancies;

})(window.main.dependancies || {});

(function(main){

    main.helpers = (function(mod){

        mod.throw = function(exeption) { throw exeption.getMessage(); }

        return mod;

    })(main.helpers || {});

    main.classes = (function(mod, context){

        var BaseExeption = function(message){
            var msg = '[ERROR:' + context.projectName + '] ' + message;
            this.getMessage = function(){ return msg; }
        }

        mod.NullOrUndefniedExeption = function(objName){
            var base = new BaseExeption('The object "' + objName + '" is null or undefined.');
            this.getMessage = function(){ return base.getMessage(); }
        }

        return mod;

    })(main.classes || {}, main.dependancies.context)

    // Modules here...

})(window.main);
