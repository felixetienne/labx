var BaseRepository = require('./BaseRepository');

module.exports = function ProjectsRepository(pg, bricks, config){

    var _base = new BaseRepository(pg, config);

    this.getProjectByName = function(projectName, imageFolder, action, emptyAction){
        if(_base.isInvalidAction(action)) return;

        _base.open(function(client){

            var projectQuery =
                bricks
                .select("   projects.title as projectitle, \
                            images.title as imagetitle, \
                            images.id as imageid, \
                            images.name as imagename")
                .from('projects')
                .join('images', { 'projects.id': 'images.projectid' })
                .where('projects.name', projectName)
                .where('projects.isactive', true)
                .limit(1)
                .toString();

            client
            .query(projectQuery, function(err, res){

                if(err) {
                    console.log(err);
                    _base.close(client);
                    return;
                }

                if(_base.hasResults(res, emptyAction)) {

                    var p = res.rows[0];
                    var imagePath = imageFolder + p.imagename + '.jpg';

                    var data = {
                        title: p.projecttitle,
                        image: {
                            title: p.imagetitle,
                            path: imagePath
                        }
                    };

                    _base.imageManager.testImage(imagePath, function(){
                        console.log('[INFO:repositories:projects.getFromName] Image ' + imagePath + ' already exists on disk.');
                    }, function(){

                        _base.open(function(client2){

                            var imageQuery =
                                bricks
                                .select("images.image as rawimage")
                                .from('images')
                                .where('images.id', p.imageid)
                                .where('images.isactive', true)
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
                                    _base.imageManager.writeImage(imagePath, i.rawimage);
                                }else{
                                    console.log('[INFO:repositories:projects.getFromName] No image for the current project.');
                                }

                                _base.close(client2);
                            });
                        });
                        console.log('[INFO:repositories:projects.getFromName] Image ' + imagePath + ' does not exists on disk.');
                    });

                    action(data);
                }

                _base.close(client);
            });
        });
    }
}
