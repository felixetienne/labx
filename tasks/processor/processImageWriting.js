require('../../core/scripts/extensions/ObjectExtensions');

(function (q, appConfig, repositoriesFactory, ImageManager, List) {

	var _imageManager = new ImageManager();
	var _repo = repositoriesFactory.createImagesRepository();

	//appConfig.setEnvFile(__dirname + '../../../.env');

	getAllImages()
		.then(getWritesImages)
		.done();

	function getAllImages() {
		var deferred = q.defer();

		_repo.getAll(function (data) {
			var ids = new List();

			data.forEach(function (x) {
				if (_imageManager.exists(x.path)) return;
				ids.add(x.id);
			});

			deferred.resolve(ids);
		}, function () {
			deferred.reject();
		});

		return deferred.promise
	}

	function getWritesImages(ids) {

		if (ids.count() === 0) return;

		_repo.getByIds(ids, true, function (data) {

			data.forEach(function (x) {
				_imageManager.write(x.path, x.raw);
			});

		}, null);
	}

})(
	require('q'),
	require('../../core/scripts/modules/appConfig'),
	require('../../core/scripts/modules/factories/repositoriesFactory'),
	require('../../core/scripts/classes/ImageManager'),
	require('../../core/scripts/classes/List'));
