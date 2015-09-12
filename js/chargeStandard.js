var Charge = {
	totalPrice: 0
};
// 计算价格
Charge.balance = function () {
	Charge.totalPrice = 0;
	$priceVal.text('正在计算价格..');
	$('.select').each(function () {
		Charge.totalPrice += parseFloat($(this).attr('price'));
	});
	Charge.totalPrice = Charge.totalPrice.toFixed(2);
	$priceVal.text(Charge.totalPrice);
};
//不同会员选择不同套擦
Charge.selectMeal = function (data) {
	var mealData = JSON.parse(data);
	for(var key in mealData) {
		if(key === 'jianli') {
			jianliScroll.setValue(0, parseInt(mealData[key]));
			jianliScroll.setCoverLength();
		} else if(key === 'zhaopin') {
			zhaopinScroll.setValue(0, parseInt(mealData[key]));
			zhaopinScroll.setCoverLength();
		} else {
			$('#' + mealData[key]).click();
		}
	}
};

var $btnRegistUer = $('.btn-regist-user');
var $priceVal     = $('.expenses .price'); 

//选择服务
$('.rc').on('click', '.span1, .span2', function () {
	$(this).siblings().removeClass('select');
	$(this).addClass('select');
	$('#' + $(this).parent().data('select')).text($(this).text());
	$(this).attr('data') && Charge.selectMeal($(this).attr('data')); 
	Charge.balance();
});
//点解同意协议checkbox
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
	danwei: '份',
	origValue: 100,
	step: 100,
	unitPrice: 20
});

var zhaopinScroll = new Scroll({
	render: 'zhaoPin',
	sections: [1, 2, 5, 8, 10],
	danwei: '场',
	origValue: 1,
	step: 1,
	unitPrice: 20
});

//初始计算价格
Charge.balance();
