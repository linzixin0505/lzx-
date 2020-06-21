//入口函数
$(function () {
    //1.文章类别管理页面
    //2.发送ajax请求,获取所有文章类别
    //3.使用模板引擎,渲染到页面
    function getData() {
        $.ajax({
            type: 'get',
            url: BigNew.category_list,
            success: function (backdata) {
                if (backdata.code == 200) {
                    //使用模板引擎渲染数据
                    var reshtml = template('temp', backdata);
                    $('tbody').html(reshtml);
                }
            }
        })
    }
    getData();

    //4.点击新增 或 编辑 弹出模态框 
    //通过给a标签添加data-toggle="modal" data-target="#myModal" 这俩个属性,来实现,bootstrap自带的
    //也可以用js,像前面的一样
    //判断弹出的模态框是新增还是编辑
    //show.bs.modal  模态框弹出之前立即触发
    // 如果是通过点击某个作为触发器的元素，则此元素可以通过事件的 relatedTarget 属性进行访问
    //此事件在模态框弹出前触发,用来判断是什么操作！
    $('#myModal').on('show.bs.modal', function (e) {
        if (e.relatedTarget === $('#xinzengfenlei')[
                0]) { //e.relatedTarget是触发的元素 bootstrap里的模态框事件
            //是新增
            $('#myModalLabel').text('新增分类');
            $('#addOrEdit').text('新增').addClass('btn-success').removeClass('btn-info');
            //form表单的DOM方法 reset() 重置表单数据(清空)
            $('#myModal form')[0].reset();
        } else {
            //是编辑
            $('#myModalLabel').text('编辑分类')
            $('#addOrEdit').text('编辑').addClass('btn-info').removeClass('btn-success')
            //编辑第一大步
            var categoryname = $(e.relatedTarget).parent().prev().prev().text(); // 获取分类名称
            var categoryslug = $(e.relatedTarget).parent().prev().text(); // 获取分类别名
            var categoryid = $(e.relatedTarget).attr('data-id'); // 获取分类id
            $('#recipient-name').val(categoryname); //设置分类名称
            $('#message-text').val(categoryslug); //设置分类别名
            $('#categoryid').val(categoryid) //设置分类id
        }
    })

    //5.判断按钮是新增还是编辑
    $('#addOrEdit').on('click', function () {
        // if($(this).text() == '新增') 方式一
        if ($(this).hasClass('btn-success')) { //方式二
            //新增
            //获取输入框内容 发送ajax请求
            var name = $("#recipient-name").val().trim();
            var slug = $("#message-text").val().trim();
            if (name == '' || slug == '') {
                alert('内容不能有空！');
                return;
            }
            //发送ajax请求
            $.ajax({
                type: 'post',
                url: BigNew.category_add,
                data: {
                    name,
                    slug
                },
                success: function (backdata) {
                    if (backdata.code == 201) {
                        alert('新增成功');
                        //重新发送ajax请求,更新文章类别
                        getData();
                        //清空输入框数据
                        // $("#recipient-name").val('');
                        // $("#message-text").val('');
                        //hide方法 隐藏模态框
                        $('#myModal').modal('hide')
                    }
                }
            })
        } else {
            //编辑第二大步
            //获取当前弹出框的信息,发送ajax请求
            //获取当前要修改的这一行分类的id, 以及用户修改后的分类名和分类别名
            // var cateId = $('#categoryid').val() //分类id
            // var cateName = $('#recipient-name').val() //分类类别名称
            // var cateSlug = $('#message-text').val() //分类类别 别名
            //上面获取数据的代码只有三句还好,如果像上面这样的获取数据的代码有三十行,那不写死了?
            //我们就想到了使用formData,但是formData他需要后端支持.  我们这个接口他不支持.
            //jQuery为我们提供了一个serialize()方法.
            //作用是: 获取form表单中有name属性的标签的值.
            var data = $('#myModal form').serialize();
            //此方法跟formdata类似
            //发送ajax请求
            $.ajax({
                type: 'post',
                url: BigNew.category_edit,
                data: data,
                // data:{
                //     id:cateId,
                //     name:cateName,
                //     slug:cateSlug
                // },
                success: function (backdata) {
                    if (backdata.code == 200) {
                        alert('修改成功!');
                        //重新发送ajax请求,更新文章类别
                        getData();
                        //清空输入框数据
                        $("#recipient-name").val('');
                        $("#message-text").val('');
                        //hide方法 隐藏模态框
                        $('#myModal').modal('hide');
                    }
                }
            })
        }
    })
    //编辑优化,如果点关闭,再点击新增,这样的话会有数据,需要点取消清空数据
    //给模态框的关闭按钮注册点击事件
    // $('.btn-close').on('click',function(){
    //     $('#myModal form')[0].reset();
    // })
    //我们可以将此代码放到弹出新增模态框时,这样每次新增都会清空

    //6.删除分类
    //给删除按钮注册点击事件 委托注册
    $('tbody').on('click', '.btn-delete', function () {
        if (confirm('你确定要删除吗？')) {
            //获取当前点击的元素的id
            var id = $(this).attr('data-id');
            //发送ajax请求,删除数据
            $.ajax({
                type: 'post',
                url: BigNew.category_delete,
                data: {
                    id
                },
                success: function (backdata) {
                    if (backdata.code == 204) {
                        alert('删除成功!')
                        //刷新数据
                        getData();
                    }
                }
            })
        }
    })
})