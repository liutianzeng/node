var express = require('express');
var router = express.Router();
var app=new express();
var multiparty=require('multiparty');
var DB=require("../../model/db");
var md5=require("md5-node");//加密模块
// app.set('view engine','ejs');
/* GET home page. */
router.get('/',function (req,res) {
    res.render('login');
});
router.post('/doLogin',function (req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';//上传图片保存的地址
    form.parse(req, function (err, fields, files) {
        var username = fields.username[0];
        var password = fields.password[0];
        DB.find('user', {"username": username, "password": md5(password)}, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            if (data.length > 0) {
                //保存用户信息
                req.session.userinfo = data[0];
                res.redirect('/admin/product');
            }
            else {
                res.send("<script>alert('登录失败');location.href='/admin/login'</script>")
            }
        });
        // 1、获取数据
        // 2、连接数据库进行比对
    });
})
router.get('/loginOut',function (req,res) {
     req.session.destroy(function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/admin/login');
        }
    })
})
module.exports = router;
