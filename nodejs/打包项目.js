var express=require('express');
var admin=require('./routes/admin');
var index=require('./routes/index');
var app=new express();
var session=require('express-session');
app.use(session({
  secret: 'keyboard cat',//加密方式。任意一个字符
  resave: false,//会自动保存
  saveUninitialized: true,//强制存储未初始化的session
  cookie: { maxAge:1000*60*30},
    rolling:true
}));
app.use('/upload',express.static('upload'));
app.use(express.static('public'));
app.set('view engine','ejs');
// app.use('/admin',express.static('public'));
app.use('/',index);
app.use('/admin',admin);
app.listen(8080);





