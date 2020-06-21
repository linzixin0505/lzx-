 //入口函数
 $(function () {
    //1.进入页面，发送ajax请求，获取所有文章分类，通过模板引擎渲染到select标签
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backdata) {
            if (backdata.code == 200) {
                //使用模板引擎渲染数据
                var reshtml = template('temp', backdata);
                $('#selCategory').html(reshtml);
            }
        }
    })

    var currentpage = null; //申明变量存储当前页

    //2.一进入页面，发送ajax请求，获取默认分类和显示默认文章
    getData(1, function (backdata) {
        //使用分页插件
        $('#pagination').twbsPagination({
            totalPages: backdata.data.totalPage, //分页总页数:通过获取返回来所有数据的总页数来设置
            visiblePages: 7, //一排显示多少个页码
            first: '首页', //设置按钮文本
            last: '尾页',
            prev: '上一页',
            next: '下一页',
            onPageClick: function (event, page) { //点击页码触发的回调函数 此方法一进入页面默认触发一次
                currentpage = page; //给当前页赋值
                //根据当前页数page,再次发送ajax请求,获取文章内容
                getData(page, null); //page = 1
            }
        });
    })

    //封装一个发送ajax请求的函数
    /**
     * @description: 发送ajax请求函数
     * @param {type} 参数1 当前显示页数
     * @param {type} 参数2 回调函数
     * @return: 
     */
    //获取所有文章内容,显示到页面
    function getData(mypage, callback) {
        $.ajax({
            type: 'get',
            url: BigNew.article_query,
            data: {
                type: $('#selCategory').val().trim(), //获取文章类别(select当前选中的value值)
                state: $('#selStatus').val().trim(), //文章状态
                page: mypage, //当前显示页
                perpage: 10 //一页显示条数
            },
            success: function (backdata) {
                // console.log(backdata);
                // console.log('当前页'+currentpage);
                // console.log('总页数'+backdata.data.totalPage);  
                if (backdata.code == 200) {
                    //通过模板引擎，渲染到页面
                    var res = template('arcitletemp', backdata)
                    $('tbody').html(res);
                    if (backdata.data.data.length != 0 && callback !=
                        null) { //有数据,把页码显示出来,数据正常显示
                        //有数据了就应该把分页插件结构给显示
                        $('#pagination').show().next().hide();
                        //回调函数 
                        callback(backdata); //将返回的数据传入回调函数 形参传递，实参接收
                    } else if (backdata.data.data.length == 0 && currentpage ==
                        1) { //没有数据,显示p标签(内容没有数据)
                        //backdata.data.data.length 当前页显示条数
                        $('#pagination').hide().next().show();
                    } else if (backdata.data.totalPage == currentpage - 1 && backdata.data
                        .data.length == 0) { //当前页-1是总页数，证明当前是最后一页
                        //查看下方通过点击删除事件,删除成功之后调用getData重新获取数据,进入此函数中,
                        //此时当前页任然是全局函数存储的没变,而总页数已经变为当前页-1
                        currentpage--;
                        //分页重绘
                        $('#pagination').twbsPagination('changeTotalPages', backdata.data
                            .totalPage, currentpage);
                    }
                }
            }
        })
    }

    //3.给筛选按钮注册点击事件
    //发送ajax请求(与获取对应文章信息发送ajax请求一致)获取对应文章内容
    //都是根据当前选中select的value值,来传入接口参数,进来判断,返回应用数据,渲染到页面
    $('#btnSearch').on('click', function (e) {
        e.preventDefault();
        getData(1, function (backdata) {
            //改变了筛选条件,那总页数就有可能发生了改变
            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
            /**
             * @description: 分页重构函数
             * @param {type} 参数1 事件名  changeTotalPages  重构总页数事件
             * @param {type} 参数2 总页数  
             * @param {type} 参数3 默认选中页数
             * @return: 
             */
            //changeTotalPages 此方法通过查看源码查找到的 详情见视频或源码
            $('#pagination').twbsPagination('changeTotalPages', backdata.data.totalPage,
                1);
        })
    })

    //4.给删除按钮注册点击事件
    $('tbody').on('click', 'a.delete', function () {
        if (confirm('你确定要删除吗？')) {
            //获取id 发送ajax请求
            var pageid = $(this).attr('data-id');
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: {
                    id: pageid
                },
                success: function (backdata) {
                    if (backdata.code == 204) {
                        // alert('删除成功！');
                        //这里删除成功之后,总页数变为当前页-1,再调用下方法getData方法,获取所有文章页数
                        //此时的总页数(totalPage)是当前页-1
                        getData(currentpage, function (backData) {
                            //删除了部分数据,那总页数就有可能发生了改变
                            //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                            $('#pagination').twbsPagination(
                                'changeTotalPages', backData.data
                                .totalPage, currentpage);
                        })
                    }
                }
            })
        }
    })
})