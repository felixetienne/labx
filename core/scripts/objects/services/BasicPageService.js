module.exports = function PageService(context, repositoriesFactory){

    this.getData = function(successAction, errorAction){
        var result = {};

        var pagesRepo = repositoriesFactory.createPagesRepository();

        pagesRepo.getPageByName(context.getCurrentView(), function(page){

            result.page = page;

            var data = {
                page: {
                    title: result.page.pageTitle
                },
                content: {
                    title: result.page.title,
                    shortTitle: result.page.shortTitle,
                    text: result.page.text
                }
            };

            successAction(data);
        }, function(){
            errorAction();
        });
    }
}
