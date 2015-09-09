var Scroll = function (options) {
	this.options = {
		render: '', // render Dom
		sections: [], // 分段 type: Array
		step: 1, //每次跳跃数量
		origValue: 1, // 初始价格
		unitPrice: 0 // 单位价格,
		danwei: null // 单位
	}
	this.dom = null;
	$.extend(this.options, options);
	this.value = this.options.origValue;
	this.price = this.options.origValue / this.options.step * this.options.unitPrice;
	this.coverLength = 0;
	this.init();
}
Scroll.prototype = {
	init: function () {
		var _self = this;
		var options = this.options;
		this.dom    = $('#' + options.render);
		if(this.dom.length < 0) {
			throw new Error(0, 'render is not found');
		}
		this.dom.addClass('scroll').attr('price', _self.price);
		this.setCoverLength();
		this.initHtml();
		this.initEvent();
	},
	initHtml: function () {
		var _self   = this,
			options = this.options;
		var $rangeScroll = $('<div class="scroll-range">');
		var left = _self.coverLength + 'px';
		var sections_html = [];
		for(var i = 0;i < options.sections.length; i++) {
			sections_html.push('<span class="scroll-item-box" data-value="'+ options.sections[i] +'">'+ options.sections[i] +'</span>')
		}
		var scroll_cover_html = '<div class="scroll-cover scroll-transition" style="width:'+ left +'"><div class="scroll-current">' + sections_html.join('') + 
								'</div></div>';
		var scroll_bar_html   = '<div class="scroll-bar">' + sections_html.join('') + '</div>';
		var scroll_thum_html  = '<div class="scroll-thumb scroll-transition" style="left:'+ left +'"><span></span><span></span></div>';
		var scroll_value_html = '<div class="scroll-value nostyle">' +
									'<input type="number" value="'+ options.origValue +'" step="'+ options.step +'" min="'+ options.step +'" max="'+ options.sections[i-1] +'"/>' +
									'<p class="danwei">'+ options.danwei +'</p>' +
								'</div>';
		$rangeScroll.html(scroll_thum_html + scroll_cover_html + scroll_bar_html).appendTo(_self.dom);
		_self.dom.append(scroll_value_html);
	},
	initEvent: function () {
		var _self = this;
		const RE = /^\d+/;
		var $thumb = this.dom.find('.scroll-thumb');
		var $cover = this.dom.find('.scroll-cover');
		var $range = this.dom.find('.scroll-range');
		var $input = this.dom.find('input');
		var startX = 0,
			down   = false;
			rangeLength = parseInt(RE.exec($range.css('width')), 10) - 16;

		//点击选择
		$range.on('mousedown', function (event) {
			var event = event || window.event;
			var pageX = event.pageX;
			var offsetX = $range.offset().left;
			_self.coverLength = Math.floor(pageX - offsetX > rangeLength ? rangeLength : pageX - offsetX);
			$thumb.css('left',  _self.coverLength);
			$cover.css('width', _self.coverLength);
			_self.setValue();
			_self.setCoverLength();
		});
		//直接输入
		$input.on('change', function () {
			var $this = $(this);
			var min = parseInt($this.attr('min'), 10);
			var max = parseInt($this.attr('max'), 10);
			var value = $this.val();
			value = value < min ? min : (value > max ? max : value);
			value = Math.ceil(value / _self.options.step) * _self.options.step;
			$this.val(value);
			_self.value = value;
			_self.setCoverLength();
		});
		//滑动选择
		$thumb.bind('mousedown', mouseDown);

		function mouseDown(event) {
			var event = event || window.event;
			event.stopPropagation();
			startX = event.pageX;
			down   = true;
			$cover.removeClass('scroll-transition');
			$thumb.removeClass('scroll-transition');
			$('body').bind('mousemove', mouseMove);
			$('body').bind('mouseup', mouseUp);
			return false;
		}
		function mouseMove(event) {
			if(!down) return false;
			var event       = event || window.event;
			var slideLength = event.pageX - startX + _self.coverLength;
			if(slideLength <= 0) {
				slideLength = 1;
			} else if(slideLength > rangeLength) {
				slideLength = rangeLength;
			}
			$thumb.css('left',  slideLength);
			$cover.css('width', slideLength);
			_self.setValue(slideLength);
		}
		function mouseUp(event) {
			if(!down) return false;
			down = false;
			$cover.addClass('scroll-transition');
			$thumb.addClass('scroll-transition');
			$('body').unbind('mousemove');
			$('body').unbind('mouseup');
			_self.setCoverLength();
		}
	},
	//set值
	setValue: function (slideLength) {	
		var _self    = this;
		var step     = _self.options.step;
		var sections = this.options.sections;
		var length   = slideLength || _self.coverLength;
		var i = Math.floor(length / 100),
			l = (length - 100 * i)%100;
		if(i === 0) {
			_self.value = Math.floor(l/step) * step === 0 ? step : Math.floor(l/step) * step;
		} else if(i >= sections.length) {
			_self.value = sections[i-1];
		} else {
			_self.value = (sections[i-1] || step) + ((sections[i] || 0) - sections[i-1]) * l / 100;
			_self.value = _self.value - _self.value % step + step;
		}
		_self.setPrice();
		_self.dom.find('input').val(_self.value);
		$('#' + _self.dom.attr('data-select')).text(_self.value + _self.options.danwei);
	},
	//set覆盖范围
	setCoverLength: function () {
		var _self    = this;
		var $thumb = this.dom.find('.scroll-thumb');
		var $cover = this.dom.find('.scroll-cover');
		var sections = this.options.sections;
		var i = 0;
		while(sections[i] < _self.value) {
			i++;
		}
		_self.coverLength = Math.floor(100 * i + (_self.value - (sections[i - 1] || 0)) / ((sections[i] - (sections[i - 1] || 0)) / 100));
		$thumb.css('left',  _self.coverLength);
		$cover.css('width', _self.coverLength);
	},
	//set价格
	setPrice: function () {
		var _self = this;
		_self.price = _self.value / _self.options.step * _self.options.unitPrice;
		_self.dom.attr('price', _self.price);
		Charge.balance();
	}
}