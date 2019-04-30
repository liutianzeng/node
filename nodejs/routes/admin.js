var express=require('express');
var router=express.Router();
//引入登录和商品逻辑文件
var login=require('./admin/login');
var product=require('./admin/product');
var user=require('./admin/user');
// 权限判断
router.use(function (req,res,next) {
    if(req.url=='/login'|| req.url=='/login/doLogin'){
        next();
    }
    else{
        if(req.session.userinfo&&req.session.userinfo.username!=''){
            res.app.locals['userinfo']=req.session.userinfo;
            next();
        }
        else{
            res.redirect('/admin/login');
        }
    }
})
router.use('/login',login);
router.use('/product',product);
router.use('/user',user);
module.exports=router;
