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
			sections_html.push('<span class="scroll-item-box">'+ options.sections[i] +'</span>')
		}
		var scroll_cover_html = '<div class="scroll-cover"><div class="scroll-current">' + sections_html.join('') + 
								'</div></div>';
		var scroll_bar_html   = '<div class="scroll-bar">' + sections_html.join('') + '</div>';
		var scroll_thum_html  = '<div class="scroll-thumb"><span></span><span></span></div>';
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
		var $bar = this.dom.find('.scroll-bar');
		$thumb.bind('mousedown', mouseDown);
		$('body').bind('mouseup', mouseUp);

		function mouseDown(event) {
			var event = event || window.event;
			startX = event.pageX;
			down   = true;
			$('body').bind('mousemove', mouseMove);
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
			$('body').unbind('mousemove');
		}
	}
}