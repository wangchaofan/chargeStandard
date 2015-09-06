var Scroll = function (options) {
	this.options = {
		unit: '',
		sections: [],
		step: 1,
		origValue: 1,
		render: ''
	}
	this.dom = null;
	$.extend(this.options, options);
	this.init();
}
Scroll.prototype = {
	init: function () {
		var options = this.options;
		this.dom = $('#' + options.render);
		this.dom.addClass('scroll');
		this.initEvent();
	},
	initEvent: function () {
		var startX = 0,
			endX = 0,
			$dom = $('.scroll');
		var $thumb = $dom.find('.scroll-thumb');
		$thumb.on('touchStart', function (event) {
			var event = event || window.event;
			console.log(event);
		});
	}
}