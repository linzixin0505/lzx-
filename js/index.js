//入口函数
$(function () {
    //1.最新资讯
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/latest',
        success: function (backdata) {
            if (backdata.code == 200) {
                //通过模板引擎渲染数据
                var res = template('message_temp', backdata);
                $('.common_news').html(res);
            }
        }
    })

    //2.热点图
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/hotpic',
        success: function (backdata) {
            if (backdata.code == 200) {
                //通过模板引擎渲染
                var res = template('hot_temp', backdata);
                $('.focus_list').html(res);
            }
        }
    })

    //3.一周排行
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/rank',
        success: function (backdata) {
            if (backdata.code == 200) {
                for (var i = 0; i < backdata.data.length; i++) {
                    $('ul.hotrank_list>li').eq(i).children('a').text(backdata.data[i]
                        .title);
                    $('ul.hotrank_list>li').eq(i).children('a').attr('href',
                        './article.html?id=' + backdata.data[i].id);
                }
            }
        }
    })

    //4.最新评论
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/latest_comment',
        success: function (backdata) {
            if (backdata.code == 200) {
                // var month = new Date().getMonth()+1;
                // backdata.month = month;
                // console.log(backdata);
                //通过模板引擎渲染
                var res = template('comments_temp', backdata);
                $('ul.comment_list').html(res);
            }
        }
    })

    //5.焦点关注
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/attention',
        success: function (backdata) {
            //通过模板引擎渲染
            var res = template('attention_temp', backdata);
            $('.guanzhu_list').html(res);
        }
    })

    //6.文章分类
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/category',
        success: function (backdata) {
            //通过模板引擎渲染
            var res = template('category_temp', backdata);
            $('ul.level_two').html('<li class="up"></li>'+res);
            $('.left_menu').html(res);
        }
    })

    //7.文章搜索
    //给搜索按钮注册点击事件
    $('.search_btn').on('click',function(){
        var searchTxt = $('.search_txt').val().trim();
        //非空判断
        if(searchTxt == ''){
            alert('请输入搜索词')
            return;
        }
        window.location.href = './list.html?search='+searchTxt;
    })

    //优化：文本输入框设置键盘按下事件:回车
    $('.search_txt').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('.search_btn').click();
        }
    })
})
