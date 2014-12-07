(function (BaseRepository) {

	module.exports = function (pg, bricks, config) {
		var _base = new BaseRepository(pg, config);
		var _imageFolder = config.getImageFolder();

		this.getAll = function (action, emptyAction) {
			if (_base.isInvalidAction(action)) return;

			_base.open(function (client) {

				var query = bricks
					.select(
						'\
            images.title, \
            images.name, \
            images.id'
					)
					.from('images')
					.where('images.active', true)
					.toString();

				client
					.query(query, function (err, res) {

						if (err) {
							_base.close(client);
							throw err;
						}

						if (_base.hasResults(res)) {
							var data = res.rows[0];

							data.path = _imageFolder + data.name + '.jpg';

							action(data);
						} else {
							emptyAction();
						}

						_base.close(client);
					});
			});
		}

		this.getByIds = function (idsList, includeRawData, action, emptyAction) {
			if (_base.isInvalidAction(action)) return;

			_base.open(function (client) {

				var query = bricks
					.select('images.name');

				if (includeRawData)
					query = query.select('images.image as raw');


				query = query
					.from('images')
					.where('images.active', true);

				idsList.do(function (x, i) {
					query = query.where('images.id', x);
				});

				query = query.toString();

				client
					.query(query, function (err, res) {

						if (err) {
							_base.close(client);
							throw err;
						}

						if (_base.hasResults(res)) {
							var data = res.rows[0];

							data.path = _imageFolder + data.name + '.jpg';

							action(data);
						} else if (typeof emptyAction === 'function') {
							emptyAction();
						}

						_base.close(client);
					});
			});
		}
	}
})(require('./BaseRepository'));
