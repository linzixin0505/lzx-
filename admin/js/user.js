//入口函数
$(function () {
    //1.获取个人信息
    //2.发送ajax请求,显示到页面
    $.ajax({
        type: 'get',
        url: BigNew.user_detail,
        success: function (backdata) {
            if (backdata.code == 200) {
                //这里遍历添加更快
                for (var key in backdata.data) {
                    $('.' + key).val(backdata.data[key]);
                }
                $('.user_pic').attr('src', backdata.data.userPic);
            }
        }
    })

    //3.编辑信息
    //给修改按钮注册点击事件
    $('.btn-edit').on('click', function (e) {
        e.preventDefault();
        //使用formdata获取输入框信息
        var fd = new FormData(document.querySelector('form'));
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: BigNew.user_edit,
            data: fd,
            contentType: false,
            processData: false,
            success: function (backdata) {
                if (backdata.code == 200) {
                    alert('修改成功');
                    //方式一:刷新父页面 因为当前页面是iframe里的user.html
                    // parent.window.onload();
                    //方式二:重新发送ajax请求,更新父元素标签
                    $.ajax({
                        type: 'get',
                        url: BigNew.user_info,
                        // url:'http://localhost:8080/api/v1/admin/user/info',
                        // headers:{
                        //     Authorization:localStorage.getItem('token') //获取localStorage里的token,设置给请求头
                        // },
                        success: function (backdata) {
                            //将用户信息显示到对应位置
                            parent.$('.user_info i').text(backdata.data
                                .nickname);
                            parent.$('.user_info>img').attr('src',
                                backdata.data.userPic);
                            parent.$('.user_center_link>img').attr(
                                'src', backdata.data.userPic);
                        }
                    })
                }
            }
        })
    })

    //4.图片预览
    $('#exampleInputFile').on('change', function (e) {
        e.preventDefault();
        var file = this.files[0]; //获取文件
        var url = URL.createObjectURL(file); //生成内存地址
        $('.user_pic').attr('src', url);
    })

})