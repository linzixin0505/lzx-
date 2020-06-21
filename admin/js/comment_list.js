//入口函数
$(function () {
    //一.进入页面 发送ajax请求 获取所有评论数据
    //通过模板引擎渲染
    /**
     * @description: 发送ajax请求,获取所有评论数据,并且分页
     * @param {type} 当前页(为点击时onPageClick事件获取到的page通过实参传递,重绘分页结构)
     * @param {type} 回调函数 根据不同条件 做不同功能
     *           当页码发生改变时，触发onPageClick事件,重新刷新分页结构
     *           (回调函数一进入页面第一次调用即可,为了显示分页结构,后面只需要根据条件判断是否需要重绘)
     *               条件1：当有数据时，调用回到函数，正常传递返回的backdata数据,通过twbsPagination事件,将分页结构显示
     *               条件2：当没有数据时，不用调用回调函数，对分页结构进行重绘
     * @return: 
     */
    function getData(mypage, callback) {
      $.ajax({
        type: 'get',
        url: BigNew.comment_list, //此接口作用就是返回所有数据,data数组里面存的是本页显示的数据
        data: {
          page: mypage, //当前页，为空返回第1页
          perpage: 10 //每页显示条数，为空默认每页6条
        },
        success: function (backdata) {
          if (backdata.code == 200) {
            //将返回数据渲染到页面
            var res = template('pinluntemp', backdata);
            $('tbody').html(res);
            //当回调函数为空,且有页面有数据是,不会执行下面条件
            if (callback != null && backdata.data.data.length != 0) {
              callback(backdata) // 将返回的数据,传入回调函数
              //当回调函数不为空,且当前页面没有数据,且是最后一页,就重绘分页结构
                                //这里的总页数=当前页-1 是因为上面重新发送ajax请求,总页数少了一页,当时当前页还是之前的总页数
            } else if (callback != null && backdata.data.data.length == 0 && backdata.data.totalPage == currentpage - 1) {
              //直接调用回调函数 进行重绘 更好理解
              currentpage --;
              callback(backdata)

              // //分页重绘
              // $('#pagination').twbsPagination('changeTotalPages', backdata.data
              //   .totalPage, currentpage);

            } //之前的article_list一个判断,没有数据是,返回文本"没有数据"
            //这里不用做,因为数据很多,不用担心没有数据
          }
        }
      })
    }

    //声明一个变量.用来记录当前页
    var currentpage = 1;
    getData(1, function (backdata) {
      //分页插件
      $('#pagination').twbsPagination({
        totalPages: backdata.data.totalPage, //总页数
        visiblePages: 5, //可见的页码
        first: '首页',
        prev: '上一页',
        next: '下一页',
        last: '尾页',
        //当点击页码时, 或者页码发生改变 ,直接触发这个事件
        onPageClick: function (event, page) {
          currentpage = page; //给当前页赋值
          //继续发送ajax请求. 获取当前点击的当前页的文章数据并渲染. 
          getData(page, null);
        }
      });
    })

    //二: 评论审核通过
    $('tbody').on('click', 'a.btn-pz', function () {
      var id = $(this).attr('data-id'); //获取评论id
      //发送ajax请求
      $.ajax({
        type: 'post',
        url: BigNew.comment_pass,
        data: {
          id
        },
        success: function (backdata) {
          if (backdata.code == 200) {
            alert('审核通过！')
            //刷新评论列表 currentpage 当前页
            getData(currentpage, null);
          }
        }
      })
    })

    //三: 评论拒绝
    $('tbody').on('click', 'a.btn-jj', function () {
      var id = $(this).attr('data-id'); //获取评论id
      //发送ajax请求
      $.ajax({
        type: 'post',
        url: BigNew.comment_reject,
        data: {
          id
        },
        success: function (backdata) {
          if (backdata.code == 200) {
            alert('已拒绝')
            //刷新评论列表 currentpage 当前页
            getData(currentpage, null);
          }
        }
      })
    })

    //四: 评论删除
    $('tbody').on('click', 'a.btn-sc', function () {
      if (confirm('你确定要删除吗？')) {
        var id = $(this).attr('data-id'); //获取评论id
        //发送ajax请求
        $.ajax({
          type: 'post',
          url: BigNew.comment_delete,
          data: {
            id
          },
          success: function (backdata) {
            if (backdata.code == 200) {
              //刷新评论列表 currentpage 当前页
              getData(currentpage, function (backdata) {
                //分页重绘
                $('#pagination').twbsPagination('changeTotalPages', backdata.data
                  .totalPage, currentpage);
              });
            }
          }
        })
      }
    })
  })