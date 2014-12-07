(function (fs) {

	module.exports = function () {

		var _rootPath = __dirname + "/../../../public";

		this.existsAsync = function (imagePath, imageExistsAction,
			imageNotExistsAction) {
			var fullPath = _rootPath + imagePath;
			fs.exists(fullPath, function (exists) {
				if (exists) {
					if (imageExistsAction) imageExistsAction();
					return;
				}
				if (imageNotExistsAction) imageNotExistsAction();
			});
		};

		this.exists = function (imagePath, imageExistsAction,
			imageNotExistsAction) {
			var fullPath = _rootPath + imagePath;
			if (fs.existsSync(fullPath)) {
				if (imageExistsAction) imageExistsAction();
				return true;
			} else {
				if (imageNotExistsAction) imageNotExistsAction();
				return false;
			}
		};

		this.write = function (imagePath, rawData) {
			var fullPath = _rootPath + imagePath;
			fs.writeFileSync(fullPath, rawData);
		};

		this.writeAsync = function (imagePath, rawData) {
			var fullPath = _rootPath + imagePath;
			fs.writeFile(fullPath, rawData);
		};
	}

})(require('fs'));
