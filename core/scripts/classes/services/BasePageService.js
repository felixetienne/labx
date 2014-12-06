(function(){

    module.exports = function (context){

        this.config = require('../../modules/appConfig');
        this.currentView = context.getCurrentView();
        this.currentRequest = context.getCurrentRequest();

        function buildUrl(page){
            var url = '/';

            if(page.name == 'index') return url;

            url += page.name;

            // temporary for test
            if(page.name != 'project') return url;
            return url += '/test';
        }

        this.getPageData = function(x){

            var data = {
                website: {
                    title: x.website.title,
                    subtitle: x.website.subtitle,
                    date: x.website.date
                },
                page:{
                    title: x.page.title,
                    shortTitle: x.page.title_short,
                    description: x.page.description,
                    name: x.page.name
                },
                allPages: []
            };

            for(k in x.allPages){
                var page = x.allPages[k];

                data.allPages.push({
                    shortTitle: page.title_short,
                    shortDescription: page.description_short,
                    name: page.name,
                    url: buildUrl(page)
                });
            }

            return data;
        }
    }
})();
