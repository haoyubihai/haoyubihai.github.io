$.getJSON("../kotlin/asset/kotlin-content.json","",function (data) {
    $.each(data,function (index,item) {
        $.each(item,function (index,content) {
            console.log(index+"***"+content.title)
            var $item = $("<li id='li_item'>\n" +
                "                <div class=\"item\">\n" +
                "                    <a href="+content.url+">\n" +
                "                        <div class=\"item_l\">\n" +
                "                            <h2>"+content.title+"</h2>\n" +
                "                            <div class=\"a-summary sub-title\">"+content.summary+"</div>\n" +
                "                            <div class=\"title-b\">\n" +
                "                                <div class=\"i-author\"><span id='id-author'>"+content.author+"</span></div>\n" +
                "                                <div class=\"i-time\">"+content.time+"</div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div class=\"item_r\"><img src="+content.carver+" alt=\"\"></div>\n" +
                "                    </a>\n" +
                "                </div>\n" +
                "            </li>");
            $(".ul_content").append($item);
        })

        $(".ul_content").delegate("#id-author","click",function () {
            var $index = $(this).parents('#li_item').index();
            // window.location.href = data.data[$index].author_url;
            alert(data.data[$index].author_url);
            window.location.href = "http://www.baidu.com";
            return false
        })
    })
})
