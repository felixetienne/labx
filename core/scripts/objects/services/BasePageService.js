//var List = require('../List');

module.exports = function BasePageService(context){

    this.config = require('../../modules/appConfig');
    this.currentView = context.getCurrentView();
    this.currentRequest = context.getCurrentRequest();
    this.getPageData = function(x){

        var data = {
            page:{
                title: x.page.pageTitle
            },
            content: {
                title: x.page.title,
                shortTitle: x.page.shortTitle,
                text: x.page.text
            },
            allPages: []
        };

        for(k in x.allPages){
            var p = x.allPages[k];
            var url = '/';
            if(p.name != 'index'){
                url += p.name;
                if(p.name == 'project'){
                    url += '/test';
                }
            }
            data.allPages.push({
                title: p.title,
                url: url
            });
        }

        return data;
    }
}
