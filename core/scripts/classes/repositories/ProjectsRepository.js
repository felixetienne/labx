(function(BaseRepository){

    module.exports = function (pg, bricks, config){

        var _base = new BaseRepository(pg, config);

        this.getProjectByName = function(projectName, imageFolder, action, emptyAction){
            if(_base.isInvalidAction(action)) return;

            _base.open(function(client){

                var projectQuery =
                    bricks
                    .select("   projects.title, \
                                projects.title_short, \
                                projects.description, \
                                projects.description_short, \
                                projects.name, \
                                images.title as image_title, \
                                images.id as image_id, \
                                images.name as image_name")
                    .from('projects')
                    .join('images', { 'projects.id': 'images.id_project' })
                    .where('images.active', true)
                    .where('projects.active', true)
                    .where('projects.name', projectName)
                    .limit(1)
                    .toString();

                client
                .query(projectQuery, function(err, res){

                    if(err) {
                        _base.close(client);
                        throw err;
                    }

                    if(_base.hasResults(res, emptyAction)) {

                        var data = res.rows[0];

                        data.image_path = imageFolder + data.image_name + '.jpg';

                        //TODO: Write images from seprarated post-deploy task.
                        _base.imageManager.testImage(data.image_path, null, function(){

                            _base.open(function(client2){

                                var imageQuery =
                                    bricks
                                    .select("images.image as image_raw")
                                    .from('images')
                                    .where('images.id', data.image_id)
                                    .where('images.active', true)
                                    .toString();

                                client2
                                .query(imageQuery, function(imageError, imageResult){
                                    if(imageError) {
                                        console.log(imageError);
                                        _base.close(client2);
                                        return;
                                    }

                                    if(imageResult.rowCount > 0){
                                        var i = imageResult.rows[0];
                                        _base.imageManager.writeImage(data.image_path, i.image_raw);
                                    }else{
                                        console.log('[INFO:repositories:projects.getFromName] No image for the current project.');
                                    }

                                    _base.close(client2);
                                });
                            });
                            console.log('[INFO:repositories:projects.getFromName] Image ' + data.image_path + ' does not exists on disk.');
                        });

                        action(data);
                    }

                    _base.close(client);
                });
            });
        }
    }
})(require('./BaseRepository'));
