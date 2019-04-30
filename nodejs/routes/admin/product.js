var express = require('express');
var router = express.Router();
// var app=new express();
var DB=require("../../model/db");
var multiparty=require('multiparty');
var fs=require('fs');

// app.set('view engine','ejs');
/* GET home page. */
router.get('/',function (req,res) {

   DB.find('product',{},function (err,data){
        res.render('product',{list:data,username:req.session.userinfo.username})
    })
});
router.get('/productadd',function(req,res){
    res.render('productadd',{username:req.session.userinfo.username});
});
router.post('/doProductAdd',function(req,res){
    var form=new multiparty.Form();
    form.uploadDir='upload';//上传图片保存的地址
    form.parse(req,function (err,fields,files) {
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(fields);//获取表单的数据
        // console.log(files);//图片上传成功返回的信息
        var titile=fields.title[0];
        var price=fields.price[0];
        var fee=fields.fee[0];
        var description=fields.description[0];
        var pic=files.pic[0].path;
        DB.insert('product',{titile,price,fee,description,pic},function (err,data) {
            if(!err){
                res.redirect('/admin/product');//上传成功跳转到首页
            }
        })
    })
});
router.get('/productedit',function(req,res){
    var id=req.query.id;
    DB.find('product',{"_id":new DB.ObjectID(id)},function (err,data) {
        res.render('productedit',{
            data:data[0],username:req.session.userinfo.username
        });
    })
});
router.post('/doEdit',function (req,res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';//上传图片保存的地址
    form.parse(req, function (err, fields, files) {
        //获取提交的数据以及图片上传成功返回的图片信息
        // console.log(fields);//获取表单的数据
        // console.log(files);//图片上传成功返回的信息
        var _id = fields._id[0];
        var titile = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        var pic = files.pic[0].path;
        var originalFilename = files.pic[0].originalFilename;
        if (originalFilename) {
            var setData = {titile, price, fee, description, pic};
        } else {
            var setData = {titile, price, fee, description};
            //删除生成的临时文件
             fs.unlink(pic,function () {

        });
        }

        DB.update('product', {"_id": new DB.ObjectID(_id)}, setData, function (err, data) {
            if (!err) {
                res.redirect('/admin/product');
            }
        });
    });
});
router.get('/delete',function (req,res) {
     var _id=req.query.id;
    DB.delete('product',{"_id":new DB.ObjectID(_id)},function (err,data) {

    });
    res.redirect('/admin/product');
});
router.post('/',function (req,res) {
   var form = new multiparty.Form();
   form.parse(req, function (err, fields, files) {
       //获取提交的数据以及图片上传成功返回的图片信息
       // console.log(fields);//获取表单的数据
       // console.log(files);//图片上传成功返回的信息
       var title  = fields.name[0];
       DB.find('product',{},function (err,data) {
           var list=[];
           data.forEach((item,i)=>{
               if(item.titile.indexOf(title)!=-1){
                   list.push(item);
               }
           });
           res.render('product',{list:list,username:req.session.userinfo.username})
       })
   })
});
module.exports = router;
