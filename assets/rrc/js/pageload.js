// 轮播图
$(function(){
	$(".carousel").carousel();
})
//城市选择
$("#city-picker").cityPicker({
	title: "请选择项目所在地"
});
//按城市筛选

$("#address_sort").cityPicker({
	title: "城市选择"
});
//筛选
$("#sort").select({
  title: "排序",
  items: [
    {
      title: "默认排序",
      value: "001",
    },
    {
      title: "价格最低",
      value: "002",
    },
    {
      title: "价格最高",
      value: "003",
    },
    {
      title: "评价最多",
      value: "004",
    },
  ]
});

//图表
$(function(){
    Morris.Bar({
        element: 'id-year-sum-chart',
        data: [{'x':'2010年','y':1980,'z':320},
              {'x':'2011年','y':3276,'z':520},
                {'x':'2012年','y':7865,'z':1342},
              {'x':'2013年','y':5689,'z':1546},
              {'x':'2014年','y':2397,'z':580},
              {'x':'2015年','y':16574,'z':2480},
              {'x':'2016年','y':23768,'z':3268}],
        xkey: 'x',
        parseTime: false,
        ykeys: ['y','z'],
        labels: ['消费额','节省'],
        barRatio: 0.4,
        xLabelAngle: 35,
        hideHover: 'auto',
        barColors: ['#FCB322','#A9D86E']
      });
    Morris.Bar({
        element: 'id-month-sum-chart',
        data: [{'x':'2010年1月','y':1980,'z':320},
              {'x':'2011年2月','y':3276,'z':520},
                {'x':'2012年3月','y':7865,'z':1342},
              {'x':'2013年4月','y':5689,'z':1546},
              {'x':'2014年5月','y':2397,'z':580},
              {'x':'2015年6月','y':16574,'z':2480},
              {'x':'2016年7月','y':23768,'z':3268},
              {'x':'2011年8月','y':3276,'z':520},
              {'x':'2013年9月','y':5689,'z':1546},
              {'x':'2016年10月','y':23768,'z':3268},
                {'x':'2010年11月','y':1980,'z':320},
                {'x':'2013年12月','y':5689,'z':1546}],
        xkey: 'x',
        parseTime: false,
        ykeys: ['y','z'],
        labels: ['消费额','节省'],
        barRatio: 0.4,
        xLabelAngle: 35,
        hideHover: 'auto',
        barColors: ['#FCB322','#A9D86E']
      });
})
