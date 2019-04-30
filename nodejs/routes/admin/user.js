var express = require('express');
var router = express.Router();
var app=new express();
var DB=require("../../model/db");
router.get('/',function (req,res) {
    DB.find('user',{},function (err,data) {
        res.render('user',{
            list:data,username:req.session.userinfo.username
        });
    })
});
router.get('/userAdd',function (req,res) {
    res.send("增加用户单元,敬请期待");
});
module.exports=router;
