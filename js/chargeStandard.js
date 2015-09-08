$('.rc').on('click', '.span1, .span2', function () {
	$(this).siblings().removeClass('select');
	$(this).addClass('select');
});

var jianliScroll = new Scroll({
	render: 'jianLi',
	sections: [100, 200, 500, 1000, 3000],
	danwei: '封',
	origValue: 100,
	step: 100,
	unitPrice: 20
});