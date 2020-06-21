//入口函数
$(function () {
    //1.头像预览功能
    $('#inputCover').on('change', function () {
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        $('.article_cover').attr('src', url);
    })

    //2.一进入页面,获取所有文章类别,显示到select
    $.ajax({
        type: 'get',
        url: BigNew.category_list,
        success: function (backdata) {
            if (backdata.code == 200) {
                //使用模板引擎渲染数据
                var reshtml = template('articletemp', backdata);
                $('.category').html(reshtml);
            }
        }
    })

    //3.日期插件
    jeDate("#testico", {
        trigger: 'click', //默认也是click,写上去好理解  是否为内部触发事件，默认为内部触发事件
        /* true : 不会弹出日期
            false : 会弹出
            'click' : 会弹出
         */
        zIndex: 999999, //层级
        format: "YYYY-MM-DD",
        isTime: false, //是否开启时间选择
        minDate: "2014-09-19 00:00:00",
    })

    //4.富文本编辑器使用
    var E = window.wangEditor
    var editor = new E('#editor')
    editor.create()

    //文章编辑第一大步 获取信息显示到对应输入框
    //5.进入页面,获取list传过来url里面带的id
    var id = window.location.search.split('=')[1];
    //5.1根据id,发送ajax请求,获取对应文章内容
    $.ajax({
        type: 'get',
        url: BigNew.article_search,
        data: {
            id
        },
        success: function (backdata) {
            if (backdata.code == 200) {
                $('#inputTitle').val(backdata.data.title); //文章标题
                $('.article_cover').attr('src', backdata.data.cover); //文章封面
                $('#categoryId').val(backdata.data.categoryId); //文章id
                $('#testico').val(backdata.data.date); //文章时间
                editor.txt.html(backdata.data.content); //文章内容
                // $('#articleId').val(backdata.data.id); //这个地方如果设置隐藏域,才以这样的方式添加id到value里
            }
        }
    })

    //编辑第二大步
    //6.给修改按钮和草稿按钮注册点击事件
    //6.1 修改文章
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('form'));
        //追加发布状态 , 发布内容
        fd.append('content', editor.txt.html()); //发布内容
        fd.append('state', '已发布'); //发布状态
        fd.append('id', id) //文章id
        //判断表单数据不能有空
        if (
            fd.get('title') == '' ||
            fd.get('cover').size == 0 ||
            fd.get('date') == null ||
            fd.get('content') == null
        ) {
            alert('图片未修改');
            return;
        }
        $.ajax({
            type: 'post',
            url: BigNew.article_edit,
            contentType: false,
            processData: false,
            data: fd,
            success: function (backdata) {
                if (backdata.code == 200) {
                    alert('修改成功')
                    // location.href = './article_list.html';
                    //发表文章高亮样式
                    parent.$('.level02>li:eq(0) a').click(); //这里直接出发a标签点击事件也可以
                }
            }
        })
    })
    //6.2 草稿按钮注册点击事件
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('form'));
        //追加发布状态与发布内容
        fd.append('content', editor.txt.html()); //发布内容
        fd.append('id', id) //文章id
        // fd.append('state', ''); //发布状态的接口参数如果是空,就是存为草稿,所以这里可以不用追加
        //判断表单数据不能有空
        if (
            fd.get('title') == '' ||
            fd.get('cover').size == 0 ||
            fd.get('date') == null ||
            fd.get('content') == null
        ) {
            alert('图片未修改');
            return;
        }
        $.ajax({
            type: 'post',
            url: BigNew.article_edit,
            contentType: false,
            processData: false,
            data: fd,
            success: function (backdata) {
                if (backdata.code == 200) {
                    alert('已存为草稿')
                    location.href = './article_list.html';
                    parent.$('.level02>li:eq(0)').click();
                }
            }
        })
    })
})