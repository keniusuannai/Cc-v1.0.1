/**
 * Created by bigta on 2015/8/24.
 */
var fs = require("fs");

if (!fs.existsSync("../data")) {
    fs.mkdirSync("../data", function (err) {
        if (err) {
            console.log(err);
            return;
        }
    });
}

var sqlite3 = require('sqlite3');

//��ʼ�����ݿ�
var db = new sqlite3.Database('../data/Msg.db');

db.run("CREATE TABLE IF NOT EXISTS localMsg (id INTEGER PRIMARY KEY,me TEXT,you TEXT, content TEXT, time TEXT)");
var data = {
    id: "0002",
    me: "896932646@qq.com",
    you: "13338364500@qq.com",
    content: "你好 我们来聊聊吧",
    time: "2015-8-24 23:57:58"
};

var stmt = db.prepare("INSERT OR REPLACE INTO  localMsg (id, me, you, content, time) VALUES (?, ?, ?, ?, ?)");
stmt.run(data.id, data.me, data.you, data.content, data.time);
stmt.finalize();


db.all("SELECT id, me, you, content, time FROM localMsg", function (err, res){
    console.log(res);
});



db.close();