var fs=require('fs');
function getFileName(fs,extname,callback) {
    fs.readFile('../mime.json',function (err,data) {
        if(err){
            console.log('404');
            return false
        }
        else{
            var Data=JSON.parse(data.toString());
            console.log(Data[extname]);////////////////////////////////////////
            var Mime= Data[extname]||'text/html';
            callback(Mime);
            // for(var key in Data) {
            //     if (key == extname) {
            //         console.log(Data[key]);
            //         return Data[key]
            //     }
            // }
        }
    })
}
var main= getFileName(fs,'.json');
console.log(main);