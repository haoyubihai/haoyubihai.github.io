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