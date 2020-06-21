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
        isinitVal: true, //初始化时间
        minDate: "2014-09-19 00:00:00",
    })

    //4.富文本编辑器使用
    var E = window.wangEditor
    var editor = new E('#editor')
    editor.create()

    //5.通过formdata获取表单数据,发送ajax请求
    //5.1给发布按钮注册点击事件
    $('.btn-release').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('form'));
        //追加发布状态 , 发布内容
        fd.append('content', editor.txt.html()); //发布内容 html()拿到富文本编辑器里面的带标签的文本
        fd.append('state', '已发布'); //发布状态
        //判断表单数据不能有空
        if (
            fd.get('title') == '' ||
            fd.get('cover').size == 0 ||
            fd.get('date') == null ||
            fd.get('content') == null
        ) {
            alert('内容不能有空');
            return;
        }

        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
            contentType: false,
            processData: false,
            data: fd,
            success: function (backdata) {
                if (backdata.code == 200) {
                    alert('发布成功')
                    location.href = './article_list.html';
                    //发表文章高亮样式
                    parent.$('.level02>li:eq(0)').click();
                }
            }
        })
    })
    //5.2给草稿按钮注册点击事件
    $('.btn-draft').on('click', function (e) {
        e.preventDefault();
        var fd = new FormData(document.querySelector('form'));
        //追加发布状态与发布内容
        fd.append('content', editor.txt.html()); //发布内容
        // fd.append('state', ''); //发布状态的接口参数如果是空,就是存为草稿,所以这里可以不用追加
        //判断表单数据不能有空
        if (
            fd.get('title') == '' ||
            fd.get('cover').size == 0 ||
            fd.get('date') == null ||
            fd.get('content') == null
        ) {
            alert('内容不能有空');
            return;
        }
        $.ajax({
            type: 'post',
            url: BigNew.article_publish,
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