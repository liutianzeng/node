var express=require('express');
var app=new express();
var DB=require("./model/db");
// var MongoClient=require('mongodb').MongoClient;
// var DbUrl='mongodb://localhost:27017/productmanage';
// 保存用户信息
var session=require('express-session');
var fs=require('fs');
var md5=require("md5-node");//加密模块
//配置中间件
app.use(session({
  secret: 'keyboard cat',//加密方式。任意一个字符
  resave: false,//会自动保存
  saveUninitialized: true,//强制存储未初始化的session
  cookie: { maxAge:1000*60*30,secure: true },
    rolling:true
}));

// var bodyParser=require('body-parser');//无法处理上传的图片，可以处理数据，所以要引进另一个处理图片的模块
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
var multiparty=require('multiparty');//既可以获取form表单提交的数据，也可以上传图片
app.use(express.static('public'));
//配置虚拟静态路由，否则图片默认在public中找找不到
app.use('/upload',express.static('upload'));
//自定义中间件，判断登录状态
app.use(function (req,res,next) {
    if(req.url=='/login'|| req.url=='/doLogin'){
        next();
    }
    else{
        if(session.userinfo&&session.userinfo.username!=''){
            next();
        }
        else{
            res.redirect('/login');
        }
    }
})
app.set('view engine','ejs');
//将session信息保存在每个渲染模板上去,ejs中设置全局数据，所有页面都可以用
app.get('/login',function (req,res) {
    res.render('login');
});
app.get('/product',function (req,res) {
    DB.find('product',{},function (err,data){
        res.render('product',{list:data})
    })
});
//显示增加商品的页面
app.get('/productadd',function (req,res) {
    res.render('productadd');
});
//获取表单提交的数据以及post过来的图片
app.post('/doProductAdd',function (req,res) {
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
                res.redirect('/product');//上传成功跳转到首页
            }
        })
    })
});
app.get('/productedit',function (req,res) {
    var id=req.query.id;
    DB.find('product',{"_id":new DB.ObjectID(id)},function (err,data) {
        res.render('productedit',{
            data:data[0]
        });
    })

});
//获取登录提交的数据
app.post('/doLogin',function (req,res) {
    //对提交过来的数据进行加密
    var form = new multiparty.Form();
    form.uploadDir = 'upload';//上传图片保存的地址
    form.parse(req, function (err, fields, files) {
        var username=fields.username[0];
        var password=fields.password[0];
        DB.find('user',{"username":username,"password":md5(password)},function (err,data) {
        if(err){
            console.log(err);
            return;
        }
        if(data.length>0){
                //保存用户信息
                app.locals['userinfo']=data[0];
                session.userinfo=data[0];
                 res.redirect('/product');
            }
            else{
                res.send("<script>alert('登录失败');location.href='/login'</script>")
            }
    });
    })
    // 1、获取数据
    // 2、连接数据库进行比对


});
app.get('/loginOut',function (req,res) {
    //销毁session
    req.session.destroy(function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
    })
});
app.get('/delete',function (req,res) {
    DB.delete('product',{"titile":"iphone8"},function (err,data) {
        if(!err){
            res.send("删除数据成功");
        }
    })
});
//修改商品
app.post('/doEdit',function (req,res) {
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
                res.redirect('/product');
            }
        });
    });
});
//删除商品
app.get('/doProductdelete',function (req,res) {
    var _id=req.query.id;
    DB.delete('product',{"_id":new DB.ObjectID(_id)},function (err,data) {

    });
    res.redirect('/product');
});
app.listen(8080)
