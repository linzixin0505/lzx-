//入口函数
$(function () {
    //1.给登录按钮注册点击事件
    //2.点击登录 获取账号和密码
    //3.发送ajax请求
    //4.登录成功跳转到index页面
    $('.input_sub').on('click', function (e) {
      e.preventDefault();//阻止默认行为
      var username = $('.input_txt').val();
      var password = $('.input_pass').val();
      //非空判断
      if (username == '' || password == '') {
        //使用bootstrap模态框
        $('.modal-body>p').text('账号或密码不能为空！')
        $('#myModal').modal(); //弹出提示
        return;
      }
      $.ajax({
        type: 'post',
        // url: 'http://localhost:8080/api/v1/admin/user/login',
        url:BigNew.user_login,
        data: {
          username,
          password
        },
        success: function (backdata) {
          //把token存储到localStorage
          localStorage.setItem('token',backdata.token);
          $('.modal-body>p').text(backdata.msg);//提示信息
          $('#myModal').modal(); //弹出提示
          if (backdata.code == 200) {
            //此事件，当模态框被隐藏之后触发
            $('#myModal').on('hidden.bs.modal', function () {
              location.assign('./index.html');
            })
          }
        }
      })
    })
  })