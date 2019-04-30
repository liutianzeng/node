var MongoClient=require('mongodb').MongoClient;
var DbUrl='mongodb://localhost:27017/productmanage';
var ObjectID=require('mongodb').ObjectID;
function __connectDb(callback) {
    MongoClient.connect(DbUrl,{ useNewUrlParser: true },function (err,client) {
        if(err){
            console.log("连接数据库失败");
            return
        }
        var db=client.db("productmanage");
        //增加 修改 删除
        callback(err,db);
        client.close();
    })
}
//数据库查找
// Db.find('user',{},function () {
//
// })
exports.find=function (collectionname,json,callback) {
    __connectDb(function (err,db) {
        var result=db.collection(collectionname).find(json);
        result.toArray(function (err,data) {
            callback(err,data);
        })
    })
};
exports.insert=function (collectionname,json,callback) {
    __connectDb(function (err,db) {
        db.collection(collectionname).insertOne(json,function (err,data) {
            callback(err,data);
        })
    })
};
exports.update=function (collectionname,json1,json2,callback) {
    __connectDb(function (err,db) {
        db.collection(collectionname).updateOne(json1,{$set:json2},function (err,data) {
            callback(err,data);
        })
    })
};
exports.delete=function (collectionname,json,callback) {
    __connectDb(function (err,db) {
        db.collection(collectionname).deleteOne(json,function (err,data) {
            callback(err,data);
        })
    })
};
exports.ObjectID=ObjectID;
