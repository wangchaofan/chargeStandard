var Charge = {
	totalPrice: 0
};
var $btnRegistUer = $('.btn-regist-user');

var $priceVal = $('.expenses .price'); 

//选择服务
$('.rc').on('click', '.span1, .span2', function () {
	$(this).siblings().removeClass('select');
	$(this).addClass('select');
	$('#' + $(this).parent().data('select')).text($(this).text());
	Charge.balance();
});

$('#protocol').on('click', function () {
	if($(this).is(':checked')) {
		$btnRegistUer.removeClass('disabled');
	} else {
		$btnRegistUer.addClass('disabled');
	}
});

var jianliScroll = new Scroll({
	render: 'jianLi',
	sections: [100, 200, 500, 1000, 3000],
	danwei: '封',
	origValue: 200,
	step: 100,
	unitPrice: 20
});

var zhaopinScroll = new Scroll({
	render: 'zhaoPin',
	sections: [1, 2, 5, 8, 10],
	danwei: '场',
	origValue: 2,
	step: 1,
	unitPrice: 20
});
// 计算价格
Charge.balance = function () {
	Charge.totalPrice = 0;
	$priceVal.text('正在计算价格..');
	$('.select').each(function () {
		Charge.totalPrice += parseFloat($(this).attr('price'));
	});
	Charge.totalPrice = Charge.totalPrice.toFixed(2);
	$priceVal.text(Charge.totalPrice);
}
//初始计算价格
Charge.balance();
