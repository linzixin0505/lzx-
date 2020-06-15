//自己封装设置请求头函数
$.ajaxSetup({
    // 发送请求前运行的函数
    beforeSend:function(xhr){
        //设置请求头
        xhr.setRequestHeader('Authorization',localStorage.getItem('token'));
    },
    //如果请求失败要运行的函数。
    error:function(xhr,status,error){
        //如果没有token error会返回forbidden 那么我们就可以做判断
        if(error == 'Forbidden') {
            alert('请先登录')
            location.href = './login.html';
        }
    }
})