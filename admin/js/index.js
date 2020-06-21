//入口函数
$(function () {
    //1.进入页面，发送ajax请求
    //2.获取用户信息
    $.ajax({
        type: 'get',
        url: BigNew.user_info,
        // url:'http://localhost:8080/api/v1/admin/user/info',
        // headers:{
        //     Authorization:localStorage.getItem('token') //获取localStorage里的token,设置给请求头
        // },
        success: function (backdata) {
            // console.log(backdata);
            //将用户信息显示到对应位置
            $('.user_info i').text(backdata.data.nickname);
            $('.user_info>img').attr('src', backdata.data.userPic);
            $('.user_center_link>img').attr('src', backdata.data.userPic);
        }
    })

    //退出登录
    $('.logout').on('click', function () {
        if (confirm('你确定要退出吗？')) {
            //删除localStorage里的token
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    })

    //左侧一级菜单，点击事件
    $('.menu>.level01').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
        //判断点击的如果是文件管理,显示二级菜单
        if($(this).index() == 1){
            $('ul.level02').slideToggle();
            //默认触发第一个li的a标签的点击事件,事件冒泡,会先触发自己的点击事件,跳转页面,然后触发li的点击事件
            //注意:这里要用dom元素触发,因为jq对象点击事件是不会触发a标签超链接的
            $('ul.level02>li:eq(0)>a')[0].click();
        }
        //小箭头旋转,默认90°,添加rotate0类,旋转回0°,实现动画
        $(this).find('b').toggleClass('rotate0');
        
    })

    //左侧二级菜单，点击事件
    $('ul.level02>li').on('click',function(){
        $(this).addClass('active').siblings().removeClass('active');
    })
})