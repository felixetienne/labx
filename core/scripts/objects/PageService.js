module.exports = function PageService(context, repo){

    this.getData = function(successAction, errorAction){
        repo.pages.getFromName(context.getCurrentView(), function(page){
            var data = {
                page:{
                    title: page.pageTitle
                },
                content: {
                    title: page.title,
                    shortTitle: page.shortTitle,
                    text: page.text
                }
            };

            successAction(data);
        }, function(){
            errorAction();
        });
    };
}
