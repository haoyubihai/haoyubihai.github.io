$.getJSON("../kotlin/asset/kotlin-content.json","",function (data) {
    $.each(data,function (index,item) {
        $.each(item,function (index,content) {
            console.log(index+"***"+content.title)
            var $item = $("<li> <div class=\"item\">\n" +
                "                    <a href="+content.url+">\n" +
                "                        <div class=\"item_l\">\n" +
                "                            <h2>"+content.title+"</h2>\n" +
                "                            <div class=\"a-summary sub-title\">"+content.summary+"</div>\n" +
                "                            <div class=\"title-b\">\n" +
                "                                <div class=\"i-author\"><a href="+content.author_url+">"+content.author+"</a></div>\n" +
                "                                <div class=\"i-time\">"+content.time+"</div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div class=\"item_r\"><img src="+content.carver+" alt=\"\"></div>\n" +
                "                    </a>\n" +
                "                </div></li>");
            $(".ul_content").append($item);
        })
    })

})