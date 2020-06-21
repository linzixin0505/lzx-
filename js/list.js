//入口函数
$(function () {
    var value = window.location.search;
    var value1 = value.split('=')[0] //拿到url搜索的类型(categoryId或者search)
    var value2 = value.split('=')[1] //拿到url等号后面的id或者关键词

    //一：判断是用什么方式进入的页面
    if (value == '') { //直接进来的,打回到index,因为不知道要显示什么内容
        location.href = './index.html';
        return;
    } else if (value1 == '?categoryId') { //通过点击文章类别进来的
        //发送ajax请求,通过模板引擎渲染到页面
        $.ajax({
            type: 'get',
            url: 'http://localhost:8080/api/v1/index/search',
            data: {
                type: value2,
                perpage: 6
            },
            success: function (backdata) {
                if (backdata.code == 200) {
                    if (backdata.data.data.length > 0) {
                        var res = template('message_temp', backdata);
                        var articleClass = backdata.data.data[0].category;
                        $('.left_con').html('<div class="list_title"><h3>' + articleClass +
                            '</h3></div>' + res);
                            //分页函数调用
                            getData(backdata);
                    } else {
                        $('.left_con').html('<div class="list_title"><h3>没有数据</h3></div>');
                    }

                }
            }
        })

    } else { //通过搜索关键词进来的
        value2 = decodeURI(value2); //UrlEncode解码
        //发送ajax请求,通过模板引擎渲染到页面
        $.ajax({
            type: 'get',
            url: 'http://localhost:8080/api/v1/index/search',
            data: {
                key: value2
            },
            success: function (backdata) {
                if (backdata.code == 200) {
                    if (backdata.data.data.length > 0) {
                        var res = template('message_temp', backdata);
                        $('.left_con').html('<div class="list_title"><h3> 搜索关键词:' + value2 +
                            '</h3></div>' + res);
                            //分页函数调用
                            getData(backdata);
                    } else {
                        $('.left_con').html('<div class="list_title"><h3>没有数据</h3></div>');
                    }
                }
            }
        })
    }

    //二.点击搜索按钮
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

    //2.文章分类
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/category',
        success: function (backdata) {
            //通过模板引擎渲染
            var res = template('category_temp', backdata);
            $('ul.level_two').html('<li class="up"></li>' + res);
            $('.left_menu').html(res);
        }
    })

    //3.一周排行
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/rank',
        success: function (backdata) {
            if (backdata.code == 200) {
                for (var i = 0; i < backdata.data.length; i++) {
                    $('ul.content_list>li').eq(i).children('a').text(backdata.data[i]
                        .title);
                    $('ul.content_list>li').eq(i).children('a').attr('href',
                        './article.html?id=' + backdata.data[i].id);
                }
            }
        }
    })

    //4.焦点关注
    $.ajax({
        type: 'get',
        url: 'http://localhost:8080/api/v1/index/attention',
        success: function (backdata) {
            //通过模板引擎渲染
            var res = template('attention_temp', backdata);
            $('.guanzhu_list').html(res);
        }
    })

    //5.分页函数封装
    function getData(backdata) {
        //分页
        //显示分页结构
        $('#pagination').twbsPagination({
            totalPages: Math.ceil(backdata.data.totalCount /
                6), //分页总页数:通过获取返回来所有数据的总页数来设置
            visiblePages: 7, //一排显示多少个页码
            first: '首页', //设置按钮文本
            last: '尾页',
            prev: '上一页',
            next: '下一页',
            //页码发生改变,重新发送ajax请求,刷新本页数据
            onPageClick: function (event,
                page) { //点击页码触发的回调函数 此方法一进入页面默认触发一次
                $.ajax({
                    url: 'http://localhost:8080/api/v1/index/search',
                    data: {
                        type: value2,
                        page: page, //当前显示页
                        perpage: 6
                    },
                    success: function (backdata) {
                        if (backdata.code == 200) {
                            //刷新本页数据
                            var res = template('message_temp', backdata);
                            var articleClass = backdata.data.data[0].category;
                            $('.left_con').html('<div class="list_title"><h3>' +
                                articleClass +
                                '</h3></div>' + res);
                        }
                    }
                })
            }
        });
    }
})