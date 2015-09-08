var Scroll = function (options) {
	this.options = {
		render: '',
		sections: [],
		step: 1,
		origValue: 1,
		unitPrice: 0
	}
	this.dom = null;
	$.extend(this.options, options);
	this.value = this.options.origValue;
	this.coverLength = this.getCoverLength();
	console.log(this.coverLength);
	this.init();
}
Scroll.prototype = {
	init: function () {
		var options = this.options;
		this.dom    = $('#' + options.render);
		if(this.dom.length < 0) {
			throw new Error(0, 'render is not found');
		}
		this.dom.addClass('scroll');
		this.initHtml();
		this.initEvent();
	},
	initHtml: function () {
		var _self   = this,
			options = this.options;
		var $rangeScroll = $('<div class="scroll-range">');
		var sections_html = [];
		for(var i = 0;i < options.sections.length; i++) {
			sections_html.push('<span class="scroll-item-box" data-value="'+ options.sections[i] +'">'+ options.sections[i] +'</span>')
		}
		var scroll_cover_html = '<div class="scroll-cover scroll-transition"><div class="scroll-current">' + sections_html.join('') + 
								'</div></div>';
		var scroll_bar_html   = '<div class="scroll-bar">' + sections_html.join('') + '</div>';
		var scroll_thum_html  = '<div class="scroll-thumb scroll-transition"><span></span><span></span></div>';
		var scroll_value_html = '<div class="scroll-value nostyle">' +
									'<input type="number" value="'+ options.origValue +'" step="'+ options.step +'"/>' +
									'<p class="danwei">'+ options.danwei +'</p>' +
								'</div>';
		$rangeScroll.html(scroll_thum_html + scroll_cover_html + scroll_bar_html).appendTo(_self.dom);
		_self.dom.append(scroll_value_html);
	},
	initEvent: function () {
		var startX = 0,
			down   = false;
			left   = 0;
		var $thumb = this.dom.find('.scroll-thumb');
		var $cover = this.dom.find('.scroll-cover');
		var $range = this.dom.find('.scroll-range');
		$range.on('mousedown', function (event) {
			var event = event || window.event;
			var pageX = event.pageX;
			var offsetX = $range.offset().left;
			$thumb.css('left', pageX - offsetX);
			$cover.css('width', pageX - offsetX);
		});
		$thumb.bind('mousedown', mouseDown);
		$('body').bind('mouseup', mouseUp);

		function mouseDown(event) {
			var event = event || window.event;
			event.stopPropagation();
			startX = event.pageX;
			down   = true;
			$cover.removeClass('scroll-transition');
			$thumb.removeClass('scroll-transition');
			$('body').bind('mousemove', mouseMove);
			return false;
		}
		function mouseMove(event) {
			if(down) {
				var event       = event || window.event;
				var slideLength = (event.pageX - startX + left) > 0 ? (event.pageX - startX + left) : 0;
				$thumb.css('left',  slideLength);
				$cover.css('width', slideLength);
			}
		}
		function mouseUp(event) {
			down = false;
			left = parseInt($thumb.css('left').substr(0, $thumb.css('left').length - 2), 10);
			$cover.addClass('scroll-transition');
			$thumb.addClass('scroll-transition');
			$('body').unbind('mousemove');
		}
	},
	setValue: function () {
		setTimeout()
	},
	getCoverLength: function () {
		var _self    = this;
		var sections = this.options.sections;
		var i = 0;
		while(sections[i] < _self.value) {
			i++;
		}
		return  100 * i + (_self.value - (sections[i - 1] || 0)) / (sections[i] / 100);
	}
}