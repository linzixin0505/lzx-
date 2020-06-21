//入口函数
$(function () {
    // 一：新闻详情信息显示
    //一进入页面,发送ajax请求,获取文章详细信息,渲染到页面
    //首先需要获取文章id
    var articleId = window.location.search.split('=')[1];
    if (articleId == undefined) { //当直接通过连接进入时 id是undefined 则直接打回主页
        window.location.href = './index.html';
        return;
    }

    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/article',
        data: {
            id: articleId
        },
        success: function (backdata) {
            console.log(backdata);
            if (backdata.code == 200) {
                // 顶部文章分类
                $('.breadcrumb>a:eq(1)').text(backdata.data.category)

                $('.article_title').text(backdata.data.title); //文章标题
                $('.article_con').html(backdata.data.content); //文章内容
                if (backdata.data.prev == null) {
                    $('.article_links>a').eq(0).text('没有上一页');
                } else {
                    $('.article_links>a').eq(0).text(backdata.data.prev.title).attr('href',
                        './article.html?id=' + backdata.data.prev.id);
                }
                if (backdata.data.next == null) {
                    $('.article_links>a').eq(1).text('没有下一页');
                } else {
                    $('.article_links>a').eq(1).text(backdata.data.next.title).attr('href',
                        './article.html?id=' + backdata.data.next.id);
                }
                // 通过模板引擎渲染
                var res = template('newtemp', backdata);
                $('.article_info').html(res);


            }
        }
    })

    // 二：所有评论显示
    // 根据id，获取对应文章的评论
    //发送ajax请求，用模板引擎渲染
    function getComment() {
        $.ajax({
            type: 'get',
            url: 'http://localhost:8080/api/v1/index/get_comment',
            data: {
                articleId: articleId
            },
            success: function (backdata) {
                if (backdata.code == 200) {
                    //模板引擎
                    var res = template('pinluntemp', backdata);
                    $('.comment_list_con').html(res);
                    //评论条数
                    $('.comment_count').text(backdata.data.length + '条评论');
                }
            }
        })
    }
    getComment();

    // 三：发表评论
    // 给评论按钮注册点击事件
    $('.comment_sub').on('click', function (e) {
        e.preventDefault();
        //获取输入框评论数据
        var comment_name = $('.comment_name').val().trim();
        var comment_input = $('.comment_input').val().trim();
        if (comment_name == '' || comment_input == '') {
            alert('评论内容不能为空！')
            return;
        }
        //通过评论名称,内容以及id 发送ajax请求
        $.ajax({
            type: 'post',
            url: 'http://localhost:8080/api/v1/index/post_comment',
            data: {
                author: comment_name,
                content: comment_input,
                articleId: articleId
            },
            success: function (backdata) {
                if (backdata.code == 201) {
                    alert('发表成功,待审核！');
                    //清空输入框
                    $('.comment_name').val("");
                    $('.comment_input').val("");
                    //重新发送ajax请求,刷新评论
                    getComment();
                }
            }
        })
    })

    // ---------------------补充---------------------------------

    // 四：热门排行
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/rank',
        success: function (backData) {
            //console.log(backData);
            if (backData.code == 200) {
                //遍历数据
                //找到数据要渲染的标签,分别渲染上. 
                for (var i = 0; i < backData.data.length; i++) {
                    $('.content_list>li').eq(i).children('a').text(backData.data[i].title);
                    $('.content_list>li').eq(i).children('a').attr('href',
                        './article.html?id=' + backData.data[i].id);
                }
            }
        }
    });

    //五: 最新评论
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/latest_comment',
        success: function (backData) {
            var resHtml = template('latestcomment_temp', backData);
            $('.comment_list').html(resHtml);
        }
    });

    //六: 焦点关注
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/attention',
        success: function (backData) {
            //console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('attention_temp', backData);
                $('.guanzhu_list').html(resHtml);
            }
        }
    })
    //七: 获取所有的文章类型
    $.ajax({
        url: 'http://localhost:8080/api/v1/index/category',
        success: function (backData) {
            //console.log(backData);
            if (backData.code == 200) {
                var resHtml = template('category_temp', backData);
                $('.level_two').html(resHtml);;
                //七.获取所有的文章类型2
                var resHtml2 = template('category_temp2', backData);
                $('.left_menu.fl').html(resHtml2);
            }
        }
    });


    //八:点击搜索按钮
    $('.search_btn').on('click', function () {
        var searchTxt = $('.search_txt').val().trim();
        if (searchTxt == "") {
            alert("搜索关键字为空!");
            return;
        } else if (isNaN(parseInt(searchTxt)) == false) {
            alert('搜索关键字为文本内容');
            return;
        } else {
            window.location.href = "./list.html?searchTxt=" + searchTxt;

        }
    })
    //优化：文本输入框设置键盘按下事件:回车
    $('.search_txt').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('.search_btn').click();
        }
    })

})