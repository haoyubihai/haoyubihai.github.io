$.getJSON("../kotlin/asset/kotlin-content.json","",function (data) {
    var itemStr = "";
    $.each(data,function (index,item) {
        $.each(item,function (index,content) {
            itemStr += "<li id='li_item'>\n" +
                "                <div class='item'>\n" +
                "                    <a href="+content.url+">\n" +
                "                        <div class='item_l'>\n" +
                "                            <h2>"+content.title+"</h2>\n" +
                "                            <div class='a-summary sub-title'>"+content.summary+"</div>\n" +
                "                            <div class='title-b'>\n" +
                "                                <div class='i-author'><span id='id-author' data-href="+content.author_url+">"+content.author+"</span></div>\n" +
                "                                <div class='i-time'>"+content.time+"</div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div class='item_r'><img src="+content.carver+" /></div>\n" +
                "                    </a>\n" +
                "                </div>\n" +
                "            </li>";

        });

        $(".ul_content").append(itemStr);
        $(".ul_content").on("click","#id-author","",function (e) {
            window.location.href = $(this).attr("data-href");
            return false
        })
    })
})
