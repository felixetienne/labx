module.exports = function BaseService(context){

    this.config = require('../../modules/appConfig');
    this.currentView = context.getCurrentView();
    this.currentRequest = context.getCurrentRequest();
}
