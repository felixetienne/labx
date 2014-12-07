(function () {

	Object.prototype.forEach = function (f) {
		[this].forEach(f);
		return this;
	}

})();
