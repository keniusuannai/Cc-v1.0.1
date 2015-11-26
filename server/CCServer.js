/**
 * Created by bigta on 2015/8/27.
 */
var express = require('express'),
    io = require('socket.io');

var app = express();

app.use(express.static(__dirname));

var server = app.listen(8888);


var ws = io.listen(server);


ws.on('connection', function(client){
    client.on('login', function(name,pwd){

        if(name=='123'&&pwd=='123'){
            client.nickname = name;
            console.log(name + ' 加入了聊天室!');
        }else{
            console.log(name,pwd);
        }
    });

});