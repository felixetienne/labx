window.Main = (function(main, contextBuilder){

    if(!contextBuilder) throw "[ERROR] The parameter 'contextBuilder' is null."
    if(!contextBuilder.build) throw "[ERROR] The context builder does have a 'build' method."

    main.context = contextBuilder.build();

    return main;

})(window.Main || {}, window.ContextBuilder);

Main.moduleTest = (function(module){

    module.isTest = function(){ return true; }

    return module;

})(Main.moduleTest || {});

console.log('Is a test? ' + Main.moduleTest.isTest());
